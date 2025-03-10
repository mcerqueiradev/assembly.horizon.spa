export interface CreateFavoriteCommand {
  userId: string;
  propertyId: string;
  categoryId?: string;
  notes?: string;
}