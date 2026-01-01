import {
  authSchema,
  LoginSchema,
  type AuthSchema,
} from "../schema/userSchema.ts";
import type { authRepository } from "../repositories/authRepository.ts";
import type { Prisma, User } from "../generated/prisma/client.ts";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/appError.ts";
import bcryptjs from "bcryptjs";

export class authServices {
  private readonly SALT_ROUNDS = 12; 
  private readonly JWT_SECRET  = process.env.JWT_ACCESS_SECRET!;
  private readonly JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN;
  private readonly JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

  constructor(private authRepository: authRepository) {}

  // Create user
  async createUser(data: AuthSchema): Promise<User | null> {
    const existingUser = await this.authRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictError("Email already registered");
    }
    const hashPassword = await bcryptjs.hash(data.password, 10);
    const userData: Prisma.UserCreateInput = {
      ...data,
      password: hashPassword,
    };

    const user = await this.authRepository.createUser(userData);
    return user;
  }

  // login User
  async loginUser(data: LoginSchema): Promise<User | null> {
    const findUser = await this.authRepository.findByEmail(data.email);

    if (!findUser) {
      throw new NotFoundError("User");
      return null;
    }

    const isPasswordMatch = await bcryptjs.compare(
      data.password,
      findUser.password
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedError("Invalid credientals");
    }
  }


 
}
