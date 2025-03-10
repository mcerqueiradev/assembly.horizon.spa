import { PropertyImageResponse } from '../contractResponse';
import { UserModel } from '../user';

export interface Proposal {
  id: string;
  propertyId: string;
  propertyTitle: string;
  proposalNumber: string;
  userId: string;
  userName: string;
  proposedValue: number;
  type: string;
  status: ProposalStatus;
  paymentMethod: string;
  intendedMoveDate: Date;
  createdAt: Date;
  updatedAt: Date;
  images: PropertyImageResponse[];
  negotiations: ProposalNegotiation[];
  documents: ProposalDocument[];
  property: Property;
  user: UserModel;
}

export type ProposalStatus = 'Pending' | 'UnderAnalysis' | 'InNegotiation' | 'Approved' | 'Rejected' | 'Cancelled' | 'Completed';

export interface ProposalNegotiation {
  id: string;
  proposalId: string;
  senderId: string;
  message: string;
  counterOffer?: number;
  status: string;
  createdAt: Date;
  documents: ProposalDocument[];
  sender: UserModel;
}

export interface ProposalDocument {
  id: string;
  proposalId: string;
  negotiationId?: string;
  documentName: string;
  documentPath: string;
  contentType: string;
  fileSize: number;
  type: DocumentType;
  status: string;
  description?: string;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Property {
  id: string;
  title: string;
  price: number;
}

export enum ProposalType {
  Purchase = 'Purchase',
  Rent = 'Rent',
}
