const net = require('net');
const redis = require('redis');
const Client = require('ssh2').Client;

async function connectSSH(sshConfig) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn
      .on('ready', () => resolve(conn))
      .on('error', reject)
      .connect(sshConfig);
  });
}
async function createServer(conn, redisConfig) {
  return new Promise((resolve, reject) => {
    const server = net.createServer(sock => {
      conn.forwardOut(sock.remoteAddress, sock.remotePort, redisConfig.host, redisConfig.port, (err, stream) => {
        if (err) {
          sock.end();
        } else {
          sock.pipe(stream).pipe(sock);
        }
      });
    });
    server.on('error', reject).listen(0, () => resolve(server));
  });
}
module.exports = {
  async connect(sshConfig, redisConfig) {
    const conn = await connectSSH(sshConfig);
    const server = await createServer(conn, redisConfig);
    const client = redis.createClient({
      ...redisConfig,
      host: '127.0.0.1',
      port: server.address().port,
    });

    return {
      client,
      conn,
      server,
      close: () => {
        client.quit();
        server.close();
        conn.end();
      },
    };
  },
};
