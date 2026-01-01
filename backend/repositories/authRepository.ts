import { Prisma, type User } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

export class authRepository {

    // find by id 
    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                userName: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }

    // find by email
    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email }
        });
    }

    // create  User 
    async createUser(data: Prisma.UserCreateInput): Promise<User | null> {
        return prisma.user.create({
            data,
            select: {
                userName: true,
                email: true,
                createdAt: true,
                updatedAt: true

            }
        })
    }

}