import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NegotiationCommand } from '../_models/Negotiation/negotiationCommand';
import { NegotiationDocumentCommand } from '../_models/Negotiation/negotiationDocumentCommand';
import { Negotiation } from '../_models/Negotiation/negotiation';

@Injectable({
  providedIn: 'root',
})
export class PropertyNegotiationService {
  private apiUrl = 'https://localhost:7220/api/PropertyNegotiation';

  constructor(private httpClient: HttpClient) {}

  createNegotiation(proposalId: string, negotiation: NegotiationCommand): Observable<any> {
    const formData = new FormData();
    formData.append('proposalId', proposalId);
    formData.append('senderId', negotiation.senderId);
    formData.append('message', negotiation.message);

    if (negotiation.counterOffer !== null) {
      formData.append('counterOffer', negotiation.counterOffer.toString());
    }

    negotiation.documents.forEach((file, index) => {
      formData.append('documents', file);
      formData.append('documentTypes', negotiation.documentTypes[index].toString());
    });

    return this.httpClient.post(`${this.apiUrl}/Create`, formData, {
      headers: { Accept: '*/*' },
    });
  }

  private prepareDocuments(files: File[]): NegotiationDocumentCommand[] {
    return files.map((file) => ({
      name: file.name,
      path: URL.createObjectURL(file),
      type: 0,
    }));
  }

  getNegotiationsByProposal(proposalId: string): Observable<Negotiation[]> {
    return this.httpClient.get<Negotiation[]>(`${this.apiUrl}/ByProposal/${proposalId}`);
  }

  private getDocumentType(mimeType: string): string {
    const typeMap: { [key: string]: string } = {
      'application/pdf': 'PDF',
      'image/jpeg': 'Image',
      'image/png': 'Image',
      'application/msword': 'Document',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Document',
    };

    return typeMap[mimeType] || 'Other';
  }
}
