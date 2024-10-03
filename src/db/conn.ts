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



// const port = parseInt(process.env.MYSQLPORT, 10);

// const sequelize = new Sequelize(
//   process.env.MYSQLDATABASE || 'petshop',
//   process.env.MYSQLUSER || 'root',
//   process.env.MYSQLPASSWORD,
//   {
//     dialect: "mysql",
//     host: process.env.MYSQLHOST,
//     port: port,
//   }
// );



if (!process.env.MYSQL_URL) {
  throw new Error('MYSQL_URL is not defined in the environment variables');
}

const sequelize = new Sequelize(process.env.MYSQL_URL, {
  dialect: "mysql",
});


export default sequelize;
