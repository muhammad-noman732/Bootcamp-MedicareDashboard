import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from "express";
import { DashboardService } from "../services/dashboardService";
import { UnauthorizedError } from '../utils/appError';

export class DashboardController {

    constructor(private dashboardService: DashboardService) { }

    getStats = asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user.id;

        if (!userId) {
            throw new UnauthorizedError("Unauthorized to get dashboard stats");
        }

        const stats = await this.dashboardService.getDashboardStats(userId);

        res.status(200).json({
            status: "success",
            message: "Dashboard statistics retrieved successfully",
            data: stats
        });
    });
}
