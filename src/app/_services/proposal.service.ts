import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProposalResponse } from '../_models/Proposal/proposalResponse';
import { Proposal, ProposalNegotiation } from '../_models/Proposal/proposal';

@Injectable({
  providedIn: 'root',
})
export class ProposalService {
  private apiUrl = 'https://localhost:7220/api/Proposal';

  constructor(private httpClient: HttpClient) {}

  createProposal(proposal: any) {
    return this.httpClient.post(`${this.apiUrl}/Create`, proposal);
  }

  getProposalsByRealtor(realtorId: string): Observable<ProposalResponse> {
    return this.httpClient.get<ProposalResponse>(`${this.apiUrl}/ByRealtor/${realtorId}`);
  }

  getProposalsByUser(userId: string): Observable<ProposalResponse> {
    return this.httpClient.get<ProposalResponse>(`${this.apiUrl}/ByUser/${userId}`);
  }

  getProposalById(id: string) {
    return this.httpClient.get<Proposal>(`${this.apiUrl}/${id}`);
  }

  addNegotiation(proposalId: string, negotiation: FormData): Observable<ProposalNegotiation> {
    return this.httpClient.post<ProposalNegotiation>(`${this.apiUrl}/${proposalId}/negotiations`, negotiation, {
      headers: {
        // Don't set Content-Type header as it will be automatically set for FormData
        Accept: 'application/json',
      },
    });
  }

  acceptProposal(proposalId: string, negotiationId: string): Observable<Proposal> {
    return this.httpClient.patch<Proposal>(`${this.apiUrl}/${proposalId}/negotiations/${negotiationId}/accept`, {});
  }

  acceptProposalDirectly(proposalId: string): Observable<any> {
    return this.httpClient.patch(`${this.apiUrl}/${proposalId}/accept`, {});
  }

  rejectProposal(proposalId: string, negotiationId: string): Observable<Proposal> {
    return this.httpClient.patch<Proposal>(`${this.apiUrl}/${proposalId}/negotiations/${negotiationId}/reject`, {});
  }

  updateNegotiationStatus(proposalId: string, negotiationId: string, status: string): Observable<ProposalNegotiation> {
    return this.httpClient.patch<ProposalNegotiation>(`${this.apiUrl}/${proposalId}/negotiations/${negotiationId}/status`, { status });
  }

  uploadNegotiationDocument(proposalId: string, negotiationId: string, document: FormData): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/${proposalId}/negotiations/${negotiationId}/documents`, document);
  }

  getNegotiationHistory(proposalId: string): Observable<ProposalNegotiation[]> {
    return this.httpClient.get<ProposalNegotiation[]>(`${this.apiUrl}/${proposalId}/negotiations`);
  }
}
