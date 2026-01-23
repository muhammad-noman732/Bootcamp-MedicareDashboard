import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { AnalyticsService } from "../services/analyticsService.ts";
import type { RequestWithUser } from "./authController.ts";

export class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) { }

    getDashboardAnalytics = asyncHandler(async (req: Request, res: Response) => {
        const { id: userId } = (req as RequestWithUser).user;
        const analytics = await this.analyticsService.getDashboardAnalytics(userId);

        res.status(200).json({
            status: "success",
            data: analytics
        });
    });
}
