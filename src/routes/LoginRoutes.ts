import { Request, Response } from "express";
import express from "express";
const router = express.Router();

import LoginController from "../controllers/LoginController";

router.post("/", (req: Request, res: Response) => {
  LoginController.login(req, res);
});

export default router;
