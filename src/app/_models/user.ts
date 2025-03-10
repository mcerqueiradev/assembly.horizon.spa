export interface UserModel {
  id: string;
  access: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  email: string;
  isActive: boolean;
  lastActiveDate: Date;
}
