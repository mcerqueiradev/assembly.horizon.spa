export interface CreateCommentResponse {
  id: string;
  propertyId: string;
  userId: string;
  message: string;
  rating?: number;
  dateTimePosted: Date;
  flagged: boolean;
  createdAt: Date;
  createdBy: string;
  parentCommentId?: string;
}