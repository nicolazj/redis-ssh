# Redis SSH

Sets up a Redis connection inside an SSH tunnel.



## API

### `.connect(obj sshConfig, obj redisConfig)`

* `sshConfig` should be an object according to the `ssh2` package.
* `redisConfig` should be an object according to the `redis` package.
* Returns a Object, containing a `client` from the `redis` package and `close` function.


## Usage
Don't forget to `close()` the tunnel connection when you're done with redis.

```javascript
const Redis = require('redis-ssh');
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

```
