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
let connection = mysql.createConnection(db_config);
const query = (sql) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, function (error, results) {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};
module.exports = {
  connection,
  query,
};
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
