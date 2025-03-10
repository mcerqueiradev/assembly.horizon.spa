import { TimeSlot } from "./TimeSlot";

export interface CreatePropertyVisitCommand {
    propertyId: string;
    userId: string;
    realtorId: string;
    visitDate: string;
    timeSlot: TimeSlot;
    notes?: string;
}