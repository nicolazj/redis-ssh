const net = require('net');
const redis = require('redis');
const Client = require('ssh2').Client;

module.exports = {
  connect(sshConfig, redisConfig) {
    return new Promise((resolve, reject) => {
      const conn = new Client();
      conn
        .on('ready', () => {
          const server = net
            .createServer(sock => {
              conn.forwardOut(sock.remoteAddress, sock.remotePort, redisConfig.host, redisConfig.port, (err, stream) => {
                if (err) {
                  sock.end();
                } else {
                  sock.pipe(stream).pipe(sock);
                }
              });
            })
            .listen(0, () => {
              const client = redis.createClient({
                ...redisConfig,
                host: '127.0.0.1',
                port: server.address().port,
              });
              resolve(client);
            });
        })
        .on('error', reject)
        .connect(sshConfig);
    });
  },
};
