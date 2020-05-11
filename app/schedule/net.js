module.exports = {
  schedule: {
    interval: '1m',
    type: 'worker', // 指定所有的 worker 都需要执行
  },
  async task (ctx) {
    ctx.service.schedule.net()
  },
}
