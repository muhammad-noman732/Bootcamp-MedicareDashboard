import { prisma } from "../lib/prisma";
import type { User } from "../types/userTypes";

export class authRepository {
    
    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id }
        });
    }

  
    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email }
        });
    }

   

    async createUser(data:User):Promise<User | null>{
        return prisma.user.create({
            data
        })
    }
}