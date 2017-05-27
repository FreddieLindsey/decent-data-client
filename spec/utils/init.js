import fs from 'fs'

global.files = {}
const assets = './assets'
const files = fs.readdirSync(assets)
for (const i in files) {
  const filename = files[i]
  global.files[filename] = fs.readFileSync(assets + '/' + filename).toString('base64')
}
