import express from "express";
import cors from "cors";

import sequelize from "./db/conn";

import { config } from "dotenv";

import LoginRoutes from "./routes/LoginRoutes";
import HomeRoutes from "./routes/HomeRoutes";
import ClientesRoutes from "./routes/ClientesRoutes";
import PetsRoutes from "./routes/PetsRoutes";
import AgendamentosRoutes from "./routes/AgendamentosRoutes";
import ServicosRoutes from "./routes/ServicosRoutes";
import AgendamentosServicosRoutes from "./routes/AgendamentosServicosRoutes";
import EnderecosClientesRoutes from "./routes/EnderecosClientesRoutes";

import Clientes from "./models/Clientes";
import Pets from "./models/Pets";
import Agendamentos from "./models/Agendamentos";
import Servicos from "./models/Servicos";
import AgendamentosServicos from "./models/AgendamentosServicos";
import EnderecosClientes from "./models/EnderecosClientes";
import "./models/associations";

Clientes;
Pets;
Agendamentos;
Servicos;
AgendamentosServicos;
EnderecosClientes;

config();

const app = express();
const port = process.env.BACKEND_PORT || 5000;

app.use(express.json());

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use("/petshop/login", LoginRoutes);
app.use("/petshop", HomeRoutes);
app.use("/petshop/clientes", ClientesRoutes);
app.use("/petshop/pets", PetsRoutes);
app.use("/petshop/agendamentos", AgendamentosRoutes);
app.use("/petshop/servicos", ServicosRoutes);
app.use("/petshop/agendamentoservicos", AgendamentosServicosRoutes);
app.use("/petshop/enderecosclientes", EnderecosClientesRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(
        `Banco iniciado com sequelize e rodando servidor na porta ${port}`
      );
    });
  })
  .catch((err) => console.log("Erro ao criar tabela", err));
