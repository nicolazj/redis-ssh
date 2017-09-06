async function main() {
  const client = await Redis.connect(
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
}
