import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from '../../../_services/contract.service';
import { CreateContractResponse } from '../../../_models/contract';
import { ContractResponse } from '../../../_models/contractResponse';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.scss',
})
export class ContractComponent implements OnInit {
  contractId!: string;
  contract!: ContractResponse | null;
  errorMessage: string = '';
  horizonRealtyAddress = {
    street: "123 Horizon Blvd",
    city: "Sunnyvale",
    state: "California",
    zipCode: "94085",
    country: "United States"
  };
  

  constructor(
    private contractService: ContractService,
    private router: Router,
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {
    this.getContractById();
  }

  getContractById(): void {
    this.route.paramMap.subscribe(params => {
      this.contractId = params.get('id') || '';
  
      if (this.contractId) {
        this.contractService.retrieve(this.contractId).subscribe({
          next: (contract) => {
            console.log('Contrato retornado:', contract); // Adicione esta linha
            this.contract = contract; // Armazena o contrato retornado
          },
          error: (error) => {
            if (error.status === 404) {
              this.errorMessage = 'Contrato não encontrado.';
            } else if (error.status === 500) {
              this.errorMessage = 'Erro interno do servidor.';
            } else {
              this.errorMessage = 'Erro ao carregar os detalhes do contrato.';
            }
            console.error('Erro ao buscar o contrato:', error);
          }
          
        });
      } else {
        this.errorMessage = 'ID do contrato não fornecido.';
      }
    });
  }

  openDocument(documentPath: string | undefined) {
    if (documentPath) {
        window.open(documentPath, '_blank'); // Abre em nova aba
    } else {
        console.error('Document path is undefined');
    }
}

  downloadDocument(documentPath: string) {
    const link = document.createElement('a');
    link.href = documentPath;
  
    // Usar uma verificação para garantir que estamos pegando um valor string
    const fileName = documentPath.split('/').pop() || 'download'; // Valor padrão se pop() retornar undefined
    link.download = fileName;
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Remove o link do DOM
  }
  

  previewInGoogleDocs(documentPath: string) {
    const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(documentPath)}&embedded=true`;
    window.open(googleDocsUrl, '_blank'); // Abre o documento em Google Docs
  }
  
}