import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { createInterface } from 'readline/promises'

export async function main() {
  let io = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  console.log(`
nginx port forwarding .conf file generator

## Simple example configuration
port: 8100
server_name: example.com

## Multi host example configuration
port: 8100
server_name: www.example.com api.example.com

Waiting inputs from cli...
`)

  var answer = await io.question('server_name: ')
  let server_name = answer.trim().replaceAll(',', ' ')
  if (!server_name) {
    console.error('Invalid server_name')
    process.exit(1)
  }

  let filename = server_name.split(' ')[0] + '.conf'

  let content = readFromSystem(filename).trim()

  let first = !content

  if (content) {
    content = updateConf(content)
  } else {
    var answer = await io.question('port: ')
    let port = +answer
    if (!port) {
      console.error('Invalid port')
      process.exit(1)
    }
    content = makeConf(server_name, port)
  }

  let dir = localDir
  mkdirSync(dir, { recursive: true })

  let file = join(dir, filename)

  writeFileSync(file, content.trim() + '\n')

  if (first) {
    console.log(`
saved to: ${file}

To continue run:
$ sudo cp ${file} ${systemDir}/${filename}
$ sudo nginx -t
$ sudo certbot --nginx

Then run this cli again to enable http2
`)
  } else {
    console.log(`
saved to: ${file}

To continue run:
$ sudo cp ${file} ${systemDir}/${filename}
$ sudo nginx -t
$ sudo service nginx restart
`)
  }
  io.close()
}

let localDir = 'nginx-conf.d'
let systemDir = '/etc/nginx/conf.d'

function readFromSystem(filename: string) {
  try {
    let file = `${systemDir}/${filename}`
    return readFileSync(file).toString()
  } catch (error) {
    // file not exists
    return ''
  }
}

function updateConf(content: string): string {
  return content
    .split('\n')
    .map(line => {
      let from = 'listen 443 ssl'
      let to = 'listen 443 ssl http2'
      if (line.includes(from) && !line.includes(to)) {
        return line.replace(from, to)
      }
      return line
    })
    .join('\n')
}

function makeConf(server_name: string, port: number): string {
  return `
server {
  listen 80;
  listen [::]:80;

  server_name ${server_name};

  # client_max_body_size 1M;

  location / {
    proxy_pass http://localhost:${port};
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
`
}
