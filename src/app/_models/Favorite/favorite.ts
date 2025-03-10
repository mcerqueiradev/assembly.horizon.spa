import { Property } from '../property';

export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
  categoryId: string;
  dateAdded: string;
  notes: string;
  property: Property;
}
