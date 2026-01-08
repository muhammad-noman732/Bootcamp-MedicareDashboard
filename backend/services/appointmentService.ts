import { da } from "zod/v4/locales";
import { CreateAppoinmentSchema } from "../schema/appointmentSchema";
import { prisma } from "../lib/prisma";

export class AppointmentService{
    constructor(
        private appointRepository : AppointmentService
    ){}

     async createUser(data: CreateAppoinmentSchema): Promise<void>{
        
        // first of all for appointment get the data and create the start time and end time >

        // start time calculation
        const startTime = data.date + data.time ;
        const endTime = data.date + data.duration;

        // first check if slot is available 
        const availableSlot = await this.appointmentService


        }
}