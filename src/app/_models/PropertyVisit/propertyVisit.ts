import { TimeSlot } from "./TimeSlot";
import { VisitStatus } from "./visitStatus";

export interface PropertyVisit {
    id: string;
    propertyId: string;
    userId: string;
    realtorId: string;
    visitDate: string;
    timeSlot: TimeSlot;
    status: VisitStatus;
    notes: string;
    propertyTitle: string;
    userName: string;
    realtorName: string;
  }
  