import express from "express";
import VerifyToken from "../helpers/verifyToken.js";

const router = express.Router();

router.get("/", VerifyToken, (req, res) => {
  return res.status(200).json({ message: "Token válido" });
});

export default router;
