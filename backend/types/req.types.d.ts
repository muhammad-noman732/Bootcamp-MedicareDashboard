import { User } from "../generated/prisma/client.ts";

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
