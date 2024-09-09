import { DataTypes } from "sequelize";

import sequelize from "../db/conn";

const Servicos = sequelize.define(
  "servicos",
  {
    nome_servico: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    valor_servico: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "servicos",
    timestamps: true,
  }
);

export default Servicos;
