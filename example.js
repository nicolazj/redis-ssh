async function main() {
  const { client, close } = await Redis.connect(
    {
      host: '',
      user: '',
      privateKey: fs.readFileSync('./*.pem'),
    },
    {
      host: '',
      port: 0,
      password: '',
    }
  );

  client.doSomething('', function() {
    close();
  });
}
