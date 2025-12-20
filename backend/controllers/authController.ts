import type {Request , Response , NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { authSchema } from "../schema/userSchema";
import type { authRepository } from "../repositories/authRepository";
import type { authServices } from "../services/authServices";


class authController {
    constructor(private authServices : authServices){}

     getUser = asyncHandler(async (req: Request, res: Response) => {
         const body = authSchema.parse(req.body);
         console.log("data" , body)
         
        const user = await this.authServices.createUser(body);

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    });
}