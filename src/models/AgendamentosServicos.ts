import { DataTypes } from "sequelize";

import sequelize from "../db/conn";

const AgendamentosServicos = sequelize.define(
  "agendamento_servicos",
  {
    id_agendamento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "agendamentos",
        key: "id",
      },
    },
    id_servico: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "servicos",
        key: "id",
      },
    },
  },
  {
    timestamps: false,
  }
);

export default AgendamentosServicos;
