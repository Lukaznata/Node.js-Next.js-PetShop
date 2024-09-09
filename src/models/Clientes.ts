import { DataTypes } from "sequelize";

import sequelize from "../db/conn";

const Clientes = sequelize.define("clientes", {
  nome_cliente: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefone_cliente: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
});

export default Clientes;
