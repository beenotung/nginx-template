# nginx-template

Generate and update nginx configuration files for port forwarding traffic to Node.js servers with WebSocket support.

[![npm Package Version](https://img.shields.io/npm/v/nginx-template)](https://www.npmjs.com/package/nginx-template)

nginx-template is an npx CLI package that generates and updates nginx port forwarding configuration files. It facilitates the creation of .conf files and enables HTTP/2 protocol in existing configurations.

## Installation

As this is an npx package, you don't necessarily need to install it. You can run it directly using the npx command. However, you do need to have Node.js and npm installed in your system.

## Usage

You can run the CLI using the following command:

```shell
npx nginx-template
```

Upon running, you will be prompted to enter the server_name and port. If the .conf file for the provided server name exists, it will be updated to enable HTTP/2. If it doesn't exist, a new configuration file will be created.

### Usage Example

```shell
npx nginx-template
```

Then, you'll see:

```
nginx port forwarding .conf file generator

## Simple example configuration
port: 8100
server_name: example.com

## Multi host example configuration
port: 8100
server_name: www.example.com api.example.com

Waiting inputs from cli...
```

Enter the server_name:

```
server_name: www.example.com api.example.com
```

And then the port:

```
port: 8100
```

The configuration file will be created or updated and saved at `./config.d/www.example.com.conf`.

If the .conf file already exists in `/etc/nginx/config.d/`, you will see the following output:

```
saved to: config.d/www.example.com.conf

To continue run:
$ sudo cp config.d/www.example.com.conf /etc/nginx/config.d/www.example.com.conf
$ sudo nginx -t
$ sudo certbot --nginx
```

Otherwise, you will see below output:

```
saved to: config.d/www.example.com.conf

To continue run:
$ sudo cp config.d/www.example.com.conf /etc/nginx/config.d/www.example.com.conf
$ sudo nginx -t
$ sudo service nginx restart
```

## Notes

- The server_name can be a single domain or multiple domains separated by a space or comma.
- The port should be a valid port number.
- The generated .conf file will be saved in the config.d directory in the current working directory. You will need to move it to the appropriate nginx configuration directory (/etc/nginx/config.d) and restart nginx for the changes to take effect.
- If the configuration file already exists, it will be updated to enable HTTP/2. If it doesn't exist, a new one will be created.

## License

This project is licensed with [BSD-2-Clause](./LICENSE)

This is free, libre, and open-source software. It comes down to four essential freedoms [[ref]](https://seirdy.one/2021/01/27/whatsapp-and-the-domestication-of-users.html#fnref:2):

- The freedom to run the program as you wish, for any purpose
- The freedom to study how the program works, and change it so it does your computing as you wish
- The freedom to redistribute copies so you can help others
- The freedom to distribute copies of your modified versions to others
