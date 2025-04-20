import { DataTypes } from "sequelize";

import sequelize from "../db/conn.js";

const Clientes = sequelize.define("clientes", {
  nome_cliente: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefone_cliente: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

export default Clientes;
