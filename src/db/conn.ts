import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

// const sequelize = new Sequelize(
//   "teste2_petshop",
//   "root",
//   process.env.PASSWORD_MYSQL,
//   {
//     // host: process.env.HOST,
//     host: process.env.DATABASE_URL,
//     dialect: "mysql",
//   }
// );



const port = process.env.MYSQLPORT ? parseInt(process.env.MYSQLPORT, 10) : 3306;

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE || 'teste2_petshop',
  process.env.MYSQLUSER || 'root',
  process.env.MYSQLPASSWORD || 'Lukaznata15@',
  {
    dialect: "mysql",
    host: process.env.MYSQLHOST,
    port: port,
  }
);



// if (!process.env.MYSQL_URL) {
//   throw new Error('MYSQL_URL is not defined in the environment variables');
// }

// const sequelize = new Sequelize(process.env.MYSQL_URL, {
//   dialect: "mysql",
// });


export default sequelize;
