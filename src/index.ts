import dotenv from "dotenv";
import express from "express";
import { Request, Response } from "express";

dotenv.config();

const port = process.env.BACKEND_PORT || 3000;
const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Olá mundo!");
});

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});

console.log("teste de compilador2");
