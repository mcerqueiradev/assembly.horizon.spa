import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contract, CreateContractResponse } from '../_models/contract';
import { ContractResponse } from '../_models/contractResponse';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private apiUrl = 'https://localhost:7220/api/Contract';

  constructor(private http: HttpClient) {}

  createContract(contractData: Contract): Observable<any> {
    const formData = new FormData();

    // Adicione os campos ao FormData
    formData.append('PropertyId', contractData.propertyId.toString());
    formData.append('CustomerId', contractData.customerId.toString());
    formData.append('RealtorId', contractData.realtorId);
    formData.append('StartDate', contractData.startDate.toISOString());
    formData.append('EndDate', contractData.endDate.toISOString());
    formData.append('Value', contractData.value.toString());
    formData.append('AdditionalFees', contractData.additionalFees.toString());
    formData.append('PaymentFrequency', contractData.paymentFrequency);
    formData.append('RenewalOption', contractData.renewalOption.toString());
    formData.append('IsActive', contractData.isActive.toString());
    formData.append('ContractType', contractData.contractType);
    formData.append('Status', contractData.status);
    formData.append('SignatureDate', contractData.signatureDate.toISOString());
    formData.append('SecurityDeposit', contractData.securityDeposit ? contractData.securityDeposit.toString() : '');
    formData.append('InsuranceDetails', contractData.insuranceDetails);
    formData.append('Notes', contractData.notes || 'N/A');

    return this.http.post(`${this.apiUrl}/Create`, formData);
  }

  createContractFromProposal(contractData: any): Observable<any> {
    const formData = new FormData();

    formData.append('ProposalId', contractData.proposalId.toString());
    formData.append('PropertyId', contractData.propertyId.toString());
    formData.append('CustomerId', contractData.customerId.toString());
    formData.append('RealtorId', contractData.realtorId);
    formData.append('StartDate', contractData.startDate.toISOString());
    formData.append('EndDate', contractData.endDate.toISOString());
    formData.append('Value', contractData.value.toString());
    formData.append('AdditionalFees', contractData.additionalFees.toString());
    formData.append('PaymentFrequency', contractData.paymentFrequency);
    formData.append('RenewalOption', contractData.renewalOption.toString());
    formData.append('IsActive', contractData.isActive.toString());
    formData.append('ContractType', contractData.contractType);
    formData.append('Status', contractData.status);
    formData.append('SignatureDate', contractData.signatureDate.toISOString());
    formData.append('SecurityDeposit', contractData.securityDeposit ? contractData.securityDeposit.toString() : '');
    formData.append('InsuranceDetails', contractData.insuranceDetails);
    formData.append('Notes', contractData.notes || 'N/A');

    return this.http.post(`${this.apiUrl}/CreateFromProposal`, formData);
  }

  retrieveAll(): Observable<ContractResponse[]> {
    return this.http.get<ContractResponse[]>(`${this.apiUrl}/RetrieveAll`);
  }

  retrieve(contractId: string): Observable<ContractResponse> {
    return this.http.get<ContractResponse>(`${this.apiUrl}/${contractId}`);
  }
}
