export interface CreateCommentCommand {
  propertyId: string;
  userId: string;
  message: string;
  rating?: number;
  parentCommentId?: string;
}