module.exports = {
  schedule: {
    interval: '5m',
    type: 'worker', // 指定所有的 worker 都需要执行
  },
  async task (ctx) {
    ctx.service.schedule.ip()
  },
}
