import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

export default function VerifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token não fornecido." });
  }

  const tokenValue = token.startsWith("Bearer ")
    ? token.slice(7, token.length)
    : token;

  const jwtSecret = process.env.TOKEN_JWT_SECRETS;

  if (!jwtSecret) {
    return res
      .status(500)
      .json({ message: "Secret do JWT não está configurada." });
  }

  try {
    jwt.verify(tokenValue, jwtSecret);

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido." });
  }
}
