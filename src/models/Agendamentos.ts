import { DataTypes, Sequelize } from "sequelize";

import sequelize from "../db/conn";

const Agendamentos = sequelize.define("agendamentos", {
  data_agendamento: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  id_pet: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "pets",
      key: "id",
    },
  },
  situacao: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  desconto: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  observacao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default Agendamentos;
