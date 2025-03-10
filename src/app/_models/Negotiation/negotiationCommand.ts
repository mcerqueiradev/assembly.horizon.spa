import { NegotiationDocumentCommand } from './negotiationDocumentCommand';

export interface NegotiationCommand {
  proposalId: string;
  senderId: string;
  message: string;
  counterOffer: number | null;
  documents: File[];
  documentTypes: number[];
}
