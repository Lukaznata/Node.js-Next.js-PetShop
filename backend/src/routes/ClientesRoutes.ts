import express from "express";
import { Request, Response } from "express";
import VerifyToken from "../helpers/verifyToken.js";

import ClientesController from "../controllers/ClientesController.js";

const router = express.Router();

router.get("/", VerifyToken, (req: Request, res: Response) => {
  ClientesController.readAllClientes(req, res);
});

router.get("/:id", VerifyToken, (req: Request, res: Response) => {
  ClientesController.readClientes(req, res);
});

router.post("/create", VerifyToken, (req: Request, res: Response) => {
  ClientesController.createClientes(req, res);
});

router.post("/delete/:id", VerifyToken, (req: Request, res: Response) => {
  ClientesController.deleteClientes(req, res);
});

router.post("/update", VerifyToken, (req: Request, res: Response) => {
  ClientesController.updateClientes(req, res);
});

export default router;
