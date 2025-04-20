import { DataTypes } from "sequelize";

import sequelize from "../db/conn.js";

const EnderecosClientes = sequelize.define(
  "enderecos_clientes",
  {
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "clientes",
        key: "id",
      },
    },
    cep: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nome_cidade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nome_bairro: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nome_rua: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero_casa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    complemento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

export default EnderecosClientes;
