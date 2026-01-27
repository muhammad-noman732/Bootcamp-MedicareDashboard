import { User } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
                userId: string;
                type: "access" | "refresh";
                iat?: number;
                exp?: number;
            };

        }
    }
}

export { };
