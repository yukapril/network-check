module.exports = {
  schedule: {
    interval: '20s',
    type: 'all', // 指定所有的 worker 都需要执行
  },
  async task (ctx) {
    ctx.service.check.ip()
    ctx.service.check.net()
  },
}
