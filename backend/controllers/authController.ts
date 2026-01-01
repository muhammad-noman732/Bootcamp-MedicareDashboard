import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { authSchema, loginSchema } from "../schema/userSchema.ts";
import { authRepository } from "../repositories/authRepository.ts";
import { authServices } from "../services/authServices.ts";

export class authController {
  constructor(private authServices: authServices) {}

  signup = asyncHandler(async (req: Request, res: Response) => {
    const body = authSchema.parse(req.body);
    console.log("data", body);

    const user = await this.authServices.createUser(body);

    res.status(200).json({
      status: "success",
      data: { user, message: "User created successfully" },
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const data = loginSchema.parse(req.body);
    console.log("data", data);

    const user = await this.authServices.loginUser(body);

    res.status(200).json({
      status: "success",
      data: { user, message: "User created successfully" },
    });
  });
}
