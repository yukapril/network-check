const Service = require('egg').Service

class CheckService extends Service {
  async ip () {
    const { ctx, app } = this
    const result = await ctx.curl('http://ip-api.com/json', { dataType: 'json' })
    const json = result.data
    const ip = json.query
    // ctx.logger.info('IP: %s', ip)
    app.logger.info('[MY] IP: %s', ip)
  }

  async net () {
    const { ctx, app } = this
    const result = await ctx.curl('http://www.baidu.com/')
    app.logger.info('[BAIDU] IP: %s, rt: %s', result.res.remoteAddress, result.res.rt)
  }
}

module.exports = CheckService
