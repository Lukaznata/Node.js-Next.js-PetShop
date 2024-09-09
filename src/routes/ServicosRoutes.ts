import express from "express";
import { Request, Response } from "express";
import VerifyToken from "../helpers/verifyToken";

import ServicosController from "../controllers/ServicosController";

const router = express.Router();

router.get("/", VerifyToken, (req: Request, res: Response) => {
  ServicosController.readAllServicos(req, res);
});

router.get("/:id", VerifyToken, (req: Request, res: Response) => {
  ServicosController.readServicos(req, res);
});

router.post("/create", VerifyToken, (req: Request, res: Response) => {
  ServicosController.createServicos(req, res);
});

router.post("/update", VerifyToken, (req: Request, res: Response) => {
  ServicosController.updateServicos(req, res);
});

router.post("/delete/:id", VerifyToken, (req: Request, res: Response) => {
  ServicosController.deleteServicos(req, res);
});

export default router;
