const aliyun = require('./aliyun')

module.exports = appInfo => {
  return {
    aliyunDdns: {
      accessKeyId: aliyun.accessKeyId,
      accessKeySecret: aliyun.accessKeySecret,
      endpoint: aliyun.endpoint,
      apiVersion: aliyun.apiVersion,
      regionId: aliyun.regionId,
      domainName: aliyun.domainName,
      rr: aliyun.rr,
      type: aliyun.type,
    }
  }
}
