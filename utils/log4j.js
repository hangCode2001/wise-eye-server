/**
 * 日志存储
 * @author JackBean
 */
 const log4js = require('log4js')

 const levels = {
     'trace':log4js.levels.TRACE,
     'debug':log4js.levels.DEBUG,  //一般用于细粒度级别上，对调试应用程序非常有帮助
     'info':log4js.levels.INFO,  //一般和在粗粒度级别上，强调应用程序的运行全程
     'warn':log4js.levels.WARN,  //	警告，即潜在的错误情形
     'error':log4js.levels.ERROR,  //发生错误事件，但仍不影响系统的继续运行
     'fatal':log4js.levels.FATAL,  //将会导致应用程序退出的错误
 }
 
 log4js.configure({
     appenders:{  //输出位置的基本信息设置
         console:{ type:'console' },  //设置控制台输出 （默认日志级别是关闭的（即不会输出日志））
         info:{   //所有日志记录，文件类型file
             type: 'file', 
             filename: 'logs/all-logs.log'
         },
         error:{
             type: 'dateFile',
             filename:'logs/log',
             pattern:'yyyy-MM-dd.log',
             alwaysIncludePattern:true// 设置文件名称为 filename + pattern
         }
     },
     categories:{  //不同等级的日志追加到不同的输出位置
        //appenders:采用的appender,取上面appenders项,level:设置级别
         default:{ appenders: [ 'console' ], level: 'debug' },
         info:{
             appenders: [ 'info','console' ],
             level: 'info'
         },
         error:{
             appenders: [ 'error','console' ],
             level: 'error'
         }
     }
 })
 
 /**
  * 日志输出，level为debug
  * @param {string} content 
  */
 exports.debug = (content)=>{
     let logger = log4js.getLogger();
     logger.level = levels.debug;
     logger.debug(content);
 }
 
 /**
  * 日志输出，level为info
  * @param {string} content 
  */
 exports.info = (content)=>{
     let logger = log4js.getLogger('info');  //获取一个类别为 info 的 Logger 实例
     logger.level = levels.info;
     logger.info(content);  //将信息写入
 }
 
 /**
  * 日志输出，level为error
  * @param {string} content 
  */
 exports.error = (content)=>{
     let logger = log4js.getLogger('error');
     logger.level = levels.error;
     logger.error(content);
 }