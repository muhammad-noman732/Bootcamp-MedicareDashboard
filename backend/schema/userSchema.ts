import * as z from 'zod';

export const authSchema = z.object({
    userName :z.string().min(5,"userName must be at least 5 character long"),
    email:z.string().email("Must be valid email"),
    password :z.string().min(8,"password must be at least 8 characters long"),
    confirmPassword :z.string().min(8 , 'confirmPassword must be at least 8 characters long')
}).refine((data)=> data.password === data.confirmPassword,{
   message: "Passwords don't match",
    path: ["confirm"], 
} )


export const userSchema = z.object({
      name :z.string().min(5,"userName must be at least 5 character long"),
      compnyName :z.string().min(5, "companyName must be at least 5 characters"),
      industry :z.string().min(5, "industry must be at least 5 characters"),
      specialty:z.string(),
      employeeCount:z.number(),

})


