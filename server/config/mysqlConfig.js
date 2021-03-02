/** 
  init 参数说明
    ispool: 是否以连接池的方式初始化 (default:true)
    host: host地址 (default:'127.0.0.1')
    user: 用户名 (default:'root')
    password: 数据库密码 (default:'root')
    database: 使用的数据库 (default:'test')
    port: 端口 (default:'3306')
    waitConnection: 是否等待链接(连接池时使用) (default:true)
    connectionLimit: 连接池大小 (default:10)
    queueLimit: 排队限制 (default:0)
*/
const { init, exec, sql, transaction } = require('mysqls')
// 可在项目的启动时初始化配置
init({
  host: 'localhost',
  user: 'root',
  password:'root',
  database: 'acgn_record',
  port: 3306,
})

module.exports = { init, exec, sql, transaction }