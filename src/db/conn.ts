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

const port = Number(process.env.MYSQLPORT)

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE || 'petshop',
  process.env.MYSQLUSER || 'root',
  process.env.MYSQL_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.MYSQLHOST,
    port: port,
  }
);





export default sequelize;
