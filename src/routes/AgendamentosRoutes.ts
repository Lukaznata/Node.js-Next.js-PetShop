import express from "express";
import { Request, Response } from "express";
import VerifyToken from "../helpers/verifyToken";

import AgendamentosController from "../controllers/AgendamentosController";

const router = express.Router();

router.get("/", VerifyToken, (req: Request, res: Response) => {
  AgendamentosController.readAllAgendamentos(req, res);
});

router.get("/hoje", VerifyToken, (req: Request, res: Response) => {
  AgendamentosController.readAgendamentosToday(req, res);
});

router.get("/semana", VerifyToken, (req: Request, res: Response) => {
  AgendamentosController.readAgendamentosByWeek(req, res);
});

router.get("/mes", VerifyToken, (req: Request, res: Response) => {
  AgendamentosController.readAgendamentosByMonth(req, res);
});

router.get("/data", VerifyToken, (req: Request, res: Response) => {
  AgendamentosController.readAgendamentosByDate(req, res);
});

router.get("/pendentes", VerifyToken, (req: Request, res: Response) => {
  AgendamentosController.readAgendamentosByPendentes(req, res);
});

router.get("/pagos", VerifyToken, (req: Request, res: Response) => {
  AgendamentosController.readAgendamentosByPagos(req, res);
});

router.get("/cliente/:id", VerifyToken, (req: Request, res: Response) => {
  AgendamentosController.readAgendamentosByClientes(req, res);
});

router.get("/pet/:id", VerifyToken, (req: Request, res: Response) => {
  AgendamentosController.readAgendamentosByPets(req, res);
});

router.get("/:id", VerifyToken, (req: Request, res: Response) => {
  AgendamentosController.readAgendamentos(req, res);
});

router.post("/create", VerifyToken, (req: Request, res: Response) => {
  AgendamentosController.createAgendamentos(req, res);
});

router.post("/update", VerifyToken, (req: Request, res: Response) => {
  AgendamentosController.updateAgendamentos(req, res);
});

router.post("/delete/:id", VerifyToken, (req: Request, res: Response) => {
  AgendamentosController.deleteAgendamentos(req, res);
});

export default router;
