import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../utils/appError";
import { JwtService } from "../lib/jwt";
import { asyncHandler } from "../utils/asyncHandler";

export class AuthMiddleware {
  constructor(private jwtService: JwtService) { }

  authMiddleware = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const token = req.cookies.accessToken;
      if (!token) {
        throw new UnauthorizedError("Unauthorized - No Token Provided");
      }

      const decoded = this.jwtService.verifyAccessToken(token);
      req.user = { id: decoded.userId.trim(), ...decoded };

      next();
    }
  );
}
