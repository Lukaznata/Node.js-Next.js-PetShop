import { Request, Response } from "express";
import express from "express";
import VerifyToken from "../helpers/verifyToken";

const router = express.Router();

import ClientesController from "../controllers/ClientesController";

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
