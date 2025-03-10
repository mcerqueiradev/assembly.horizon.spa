import { TimeSlot } from "./TimeSlot";

export interface CreatePropertyVisitResponse {
    id: string;
    visitDate: string;
    timeSlot: TimeSlot;
    status: string;
}