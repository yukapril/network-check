const egg = require('egg')

const workers = require('os').cpus().length
const port = 17001

egg.startCluster({
  env: 'prod',
  baseDir: __dirname,
  workers,
  port,
})
