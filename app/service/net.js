const Service = require('egg').Service
const Core = require('@alicloud/pop-core')

const getDnsRecord = (client, cfg) => {
  const requestOption = {
    method: 'POST'
  }

  const params = {
    RegionId: cfg.regionId,
    DomainName: cfg.domainName,
    PageSize: 500
  }

  return new Promise(async (resolve, reject) => {
    try {
      const result = await client.request('DescribeDomainRecords', params, requestOption)
      const record = result.DomainRecords.Record.filter(item => {
        return item.RR === cfg.rr
      })[0]
      resolve(record)
    } catch (ex) {
      reject(ex)
    }
  })
}

const updateDnsRecord = (client, recordId, ip, cfg) => {
  const requestOption = {
    method: 'POST'
  }

  const params = {
    'RegionId': cfg.regionId,
    'RecordId': recordId,
    'RR': cfg.rr,
    'Type': cfg.type,
    'Value': ip
  }

  return new Promise(async (resolve, reject) => {
    try {
      const result = await client.request('UpdateDomainRecord', params, requestOption)
      resolve()
    } catch (ex) {
      reject(ex)
    }
  })
}

class CheckService extends Service {
  ip () {
    const { ctx } = this
    return new Promise(async (resolve, reject) => {
      try {
        const result = await ctx.curl('http://ip-api.com/json', { dataType: 'json' })
        const json = result.data
        resolve(json)
      } catch (e) {
        reject(e)
      }
    })
  }

  visit (url) {
    const { ctx, app } = this
    return new Promise(async (resolve, reject) => {
      try {
        const result = await ctx.curl(url)
        resolve(result.res)
      } catch (e) {
        reject(e)
      }
    })
  }

  aliyunDdns (ip) {
    const { config } = this
    const aliyunConfig = config.aliyunDdns

    const client = new Core({
      accessKeyId: aliyunConfig.accessKeyId,
      accessKeySecret: aliyunConfig.accessKeySecret,
      endpoint: aliyunConfig.endpoint,
      apiVersion: aliyunConfig.apiVersion
    })

    return new Promise(async (resolve) => {
      const record = await getDnsRecord(client, aliyunConfig)
      if (aliyunConfig.type === record.Type && ip === record.Value) {
        // 没有改变，直接返回
        resolve({
          stat: 1,
          msg: `从 ${aliyunConfig.regionId} 获取 ${aliyunConfig.rr}.${aliyunConfig.domainName}, recordId: ${record.RecordId}, ip: ${ip}。` +
            `服务器配置与当前配置相同，无需修改`
        })
        return
      }
      await updateDnsRecord(client, record.RecordId, ip, aliyunConfig)
      resolve({
        stat: 2,
        msg: `从 ${aliyunConfig.regionId} 修改 ${aliyunConfig.rr}.${aliyunConfig.domainName} 的 ${aliyunConfig.type} 为: ${ip}`
      })
    })
  }
}

module.exports = CheckService
