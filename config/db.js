/**
 * 数据库连接
 */

let mysql = require("mysql");
const db_config = {
  host: "120.27.132.13",
  user: "wise-eye",
  password: "wei123.",
  port: "3306",
  database: "wise-eye",
};
let connect = mysql.createConnection(db_config);

module.exports = connect;
/*  //基本的查询语句
 let sqlQuery="select * from test";
 connect.query(sqlQuery,function(err,result){
     if(err){
         console.log(`SQL error: ${err}!`);
     }else{
         console.log(result);
         closeMysql(connect);
     }
 });
 //查询成功后关闭mysql
 function closeMysql(connect){
     connect.end((err)=>{
         if(err){
             console.log(`mysql关闭失败:${err}!`);
         }else{
             console.log('mysql关闭成功!');
         }
  });
 } */
