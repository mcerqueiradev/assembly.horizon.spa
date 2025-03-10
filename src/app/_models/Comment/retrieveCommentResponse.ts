export interface RetrieveCommentResponse {
  id: string;
  propertyId: string;
  userId: string;
  message: string;
  rating?: number;
  dateTimePosted: Date;
  flagged: boolean;
  createdAt: Date;
  createdBy: string;
  userCommentName: string;
  userCommentEmail: string;
  userCommentPhoto: string | null;
  parentCommentId?: string;
  helpfulCount: number;
  isHelpful: boolean;
  replies?: RetrieveCommentResponse[];
}