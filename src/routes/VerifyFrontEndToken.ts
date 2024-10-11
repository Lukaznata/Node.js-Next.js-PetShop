import express from "express";
import VerifyToken from "../helpers/verifyToken";

const router = express.Router();

router.get("/auth/verify", VerifyToken, (req, res) => {
  return res.status(200).json({ message: "Token válido" });
});

export default router;
