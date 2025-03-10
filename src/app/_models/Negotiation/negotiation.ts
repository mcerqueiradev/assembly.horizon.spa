import { DocumentStatus } from './documentStatus';
import { NegotiationDocumentCommand } from './negotiationDocumentCommand';
import { NegotiationStatus } from './negotiationStatus';

export interface Negotiation {
  id: string;
  senderId: string;
  sender: Sender;
  message: string;
  counterOffer: number;
  status: NegotiationStatus;
  createdAt: Date;
  documents: DocumentResponse[];
}

export interface Sender {
  firstName: string;
  lastName: string;
  imageUrl: string;
  access: string;
}

export interface DocumentResponse {
  id: string;
  name: string;
  path: string;
  type: string;
  status: string;
}
