import express from "express";
import { Request, Response } from "express";
import VerifyToken from "../helpers/verifyToken";

import AgendamentosServicosController from "../controllers/AgendamentosServicosController";

const router = express.Router();

router.get("/", VerifyToken, (req: Request, res: Response) => {
  AgendamentosServicosController.readAllAgendamentosServicos(req, res);
});

router.get("/:id", VerifyToken, (req: Request, res: Response) => {
  AgendamentosServicosController.readAgendamentosServicos(req, res);
});

router.post("/create", VerifyToken, (req: Request, res: Response) => {
  AgendamentosServicosController.createAgendamentosServicos(req, res);
});

router.post("/update", VerifyToken, (req: Request, res: Response) => {
  AgendamentosServicosController.updateAgendamentosServicos(req, res);
});

router.post("/delete/:id", VerifyToken, (req: Request, res: Response) => {
  AgendamentosServicosController.deleteAgendamentosServicos(req, res);
});

export default router;
