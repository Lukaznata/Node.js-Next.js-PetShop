import express from "express";
import { Request, Response } from "express";
import VerifyToken from "../helpers/verifyToken";

import EnderecosClientesController from "../controllers/EnderecosClientesController";

const router = express.Router();

router.get("/", VerifyToken, (req: Request, res: Response) => {
  EnderecosClientesController.readAllEnderecosClientes(req, res);
});

router.get("/:id", VerifyToken, (req: Request, res: Response) => {
  EnderecosClientesController.readEnderecosClientes(req, res);
});

router.post("/create", VerifyToken, (req: Request, res: Response) => {
  EnderecosClientesController.createEnderecosClientes(req, res);
});

router.post("/update", VerifyToken, (req: Request, res: Response) => {
  EnderecosClientesController.updateEnderecosClientes(req, res);
});

router.post("/delete/:id", VerifyToken, (req: Request, res: Response) => {
  EnderecosClientesController.deleteEnderecosClientes(req, res);
});

export default router;
