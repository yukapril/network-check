const Service = require('egg').Service

class CheckService extends Service {
  async ip () {
    const { ctx, app } = this
    let ip = ''
    try {
      ip = await ctx.service.net.ip()
      app.logger.info('[MY] IP: %s', ip.query)
    } catch (e) {
      app.logger.error('[MY] ERROR')
    }
    const result = await ctx.service.net.aliyunDdns(ip.query)
    app.logger.info(`[ALIYUN_DDNS_${result.stat}] ` + result.msg)
  }

  async net () {
    const { ctx, app } = this
    try {
      const visit = await ctx.service.net.visit('http://www.baidu.com/')
      app.logger.info('[BAIDU] IP: %s, rt: %s', visit.remoteAddress, visit.rt)
    } catch (e) {
      app.logger.error('[BAIDU] ERROR')
    }
  }
}

module.exports = CheckService
