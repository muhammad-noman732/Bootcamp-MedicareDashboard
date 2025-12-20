import type { User } from "../types/userTypes";
import { authSchema } from "../schema/userSchema";
import type { authRepository } from "../repositories/authRepository";
import { ConflictError, NotFoundError } from "../utils/appError";
import bcrypt from 'bcrypt'

export class authServices {
    constructor( private authRepository : authRepository){};

    // Create user 
    async createUser(data: User ): Promise<User> {
    
        const existingUser = await this.authRepository.findByEmail(data.email);
       
        if (existingUser) {
            throw new ConflictError('Email already registered');
        }

       const hashPassword = await bcrypt.hash(data.password , 10);
       
        
       

    }


}