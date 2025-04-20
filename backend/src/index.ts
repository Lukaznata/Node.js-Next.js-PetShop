import express from "express";
import cors from "cors";

import sequelize from "./db/conn.js";

import { config } from "dotenv";

import LoginRoutes from "./routes/LoginRoutes.js";
import VerifYFrontEndToken from "./routes/VerifyFrontEndToken.js";
import HomeRoutes from "./routes/HomeRoutes.js";
import ClientesRoutes from "./routes/ClientesRoutes.js";
import PetsRoutes from "./routes/PetsRoutes.js";
import AgendamentosRoutes from "./routes/AgendamentosRoutes.js";
import ServicosRoutes from "./routes/ServicosRoutes.js";
import AgendamentosServicosRoutes from "./routes/AgendamentosServicosRoutes.js";
import EnderecosClientesRoutes from "./routes/EnderecosClientesRoutes.js";

import Clientes from "./models/Clientes.js";
import Pets from "./models/Pets.js";
import Agendamentos from "./models/Agendamentos.js";
import Servicos from "./models/Servicos.js";
import AgendamentosServicos from "./models/AgendamentosServicos.js";
import EnderecosClientes from "./models/EnderecosClientes.js";
import "./models/associations.js";

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

const allowedOrigins = [
  "https://petshop-hazel.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin as string) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Não permitido pelo CORS"));
      }
    },
  })
);

app.use("/petshop/login", LoginRoutes);
app.use("/petshop/auth/verify", VerifYFrontEndToken);
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
