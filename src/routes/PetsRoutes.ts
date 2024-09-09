import express from "express";
import { Request, Response } from "express";
import VerifyToken from "../helpers/verifyToken";

import PetsController from "../controllers/PetsController";

const router = express.Router();

router.get("/", VerifyToken, (req: Request, res: Response) => {
  PetsController.readAllPets(req, res);
});

router.get("/:id", VerifyToken, (req: Request, res: Response) => {
  PetsController.readPets(req, res);
});

router.post("/create", VerifyToken, (req: Request, res: Response) => {
  PetsController.createPets(req, res);
});

router.post("/update", VerifyToken, (req: Request, res: Response) => {
  PetsController.updatePets(req, res);
});

router.post("/delete/:id", VerifyToken, (req: Request, res: Response) => {
  PetsController.deletePets(req, res);
});

export default router;
