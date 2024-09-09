import { DataTypes } from "sequelize";

import sequelize from "../db/conn";

const Pets = sequelize.define("pets", {
  nome_pet: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  raca_pet: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "clientes",
      key: "id",
    },
  },
});

export default Pets;
