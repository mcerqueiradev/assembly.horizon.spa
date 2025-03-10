import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContractService } from '../../../_services/contract.service';
import { ContractResponse } from '../../../_models/contractResponse';
import { gsap } from 'gsap';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrl: './contracts.component.scss',
})
export class ContractsComponent implements OnInit, OnDestroy {
  contracts: ContractResponse[] = [];
  selectedContract: ContractResponse | null = null;
  errorMessage: string = '';
  tips: string[] = [
    'Verify all property details before signing any contract.',
    'Include clear contingencies for financing and inspections.',
    'Specify repair and maintenance responsibilities in agreements.',
    'Ensure compliance with local zoning laws and regulations.',
    'Clearly define payment terms and commission structures.',
    'Include effective dispute resolution mechanisms.',
  ];
  get filterOptions() {
    return [
      {
        label: 'All',
        value: 'All',
        count: this.contracts.length,
      },
      {
        label: 'For Sale',
        value: 'Sale',
        count: this.countSaleContracts(),
      },
      {
        label: 'For Rent',
        value: 'Rent',
        count: this.countRentContracts(),
      },
    ];
  }
  filteredContracts: ContractResponse[] = [];
  filter: string = 'All';
  searchTerm: string = '';
  currentTip: number = 0;
  private intervalId: any;
  completionRate: number = 0;
  upcomingRenewals: ContractResponse[] = [];
  recentActivities: any[] = [];
  targetCompletionRate: number = 85;

  constructor(private contractService: ContractService, private router: Router, private zone: NgZone) {
    this.filteredContracts = this.contracts;
  }

  ngOnInit(): void {
    this.retrieveAllContracts();
    this.startSlider();
    this.applyFilters();
    this.filteredContracts = this.contracts;
  }

  applyFilters(): void {
    let filtered = [...this.contracts];

    // Apply type filter
    if (this.filter !== 'All') {
      filtered = filtered.filter((contract) => contract.contractType === this.filter);
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (contract) => contract.propertyTitle.toLowerCase().includes(term) || contract.customerName.toLowerCase().includes(term) || contract.status.toLowerCase().includes(term)
      );
    }

    this.filteredContracts = filtered;
  }

  retrieveAllContracts(): void {
    this.contractService.retrieveAll().subscribe({
      next: (response: any) => {
        this.zone.run(() => {
          if (response && response.contracts) {
            this.contracts = response.contracts;
            this.filteredContracts = this.contracts; // Atualiza os contratos filtrados
            console.log(this.contracts);
            this.calculateSidebarMetrics();
          }
        });
      },
      error: (error) => {
        console.error('Erro ao buscar contratos:', error);
        this.errorMessage = 'Falha ao carregar a lista de contratos.';
      },
    });
  }

  selectContract(contract: ContractResponse) {
    if (this.selectedContract?.id === contract.id) {
      this.selectedContract = null; // Deselect if already selected
    } else {
      this.selectedContract = contract;
    }
  }

  filterContracts(): void {
    const term = this.searchTerm.toLowerCase(); // Normalize the search term
    this.filteredContracts = this.contracts.filter((contract) => {
      return (
        contract.propertyTitle.toLowerCase().includes(term) || // Filter by title
        contract.customerName.toLowerCase().includes(term) || // Filter by owner
        contract.status.toLowerCase().includes(term) // Filter by status
      );
    });
  }

  formatNumber(value: number): string {
    if (value >= 1e6) {
      return (value / 1e6).toFixed(1) + 'm'; // For millions
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(1) + 'k'; // For thousands
    }
    return value.toString(); // For values less than 1000
  }

  avgDuration(): number {
    if (this.contracts.length === 0) {
      return 0; // Return 0 or any suitable value if there are no contracts
    }

    const totalDuration = this.contracts.reduce((sum, contract) => {
      return sum + contract.durationInMonths; // Adjust property name as necessary
    }, 0);

    return totalDuration / this.contracts.length; // Return the average duration
  }

  contractsValue(): number {
    return this.contracts.reduce((sum, contract) => sum + contract.value, 0);
  }

  countActiveContracts(): number {
    return this.contracts.filter((contract) => contract.isActive == true).length;
  }

  countSaleContracts(): number {
    return this.contracts.filter((contract) => contract.contractType === 'Sale').length;
  }

  countRentContracts(): number {
    return this.contracts.filter((contract) => contract.contractType === 'Rent').length;
  }

  startSlider(): void {
    const animateTip = () => {
      const tipsElements = document.querySelectorAll('.tip-slider li');
      gsap.to(tipsElements[this.currentTip], {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          this.currentTip = (this.currentTip + 1) % this.tips.length;
          gsap.to(tipsElements[this.currentTip], { opacity: 1, duration: 0.5 });
        },
      });
    };

    // Inicia a animação imediatamente
    animateTip();

    // Configura o intervalo para chamar animateTip a cada 3 segundos
    this.intervalId = setInterval(animateTip, 3000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  navigateToContract(contractId: string): void {
    this.router.navigate(['back-office/dashboard/contract/', contractId]);
  }

  navigateToAddContract(): void {
    this.router.navigate(['back-office/dashboard/contracts/add-contract']);
  }

  calculateSidebarMetrics() {
    // Calculate completion rate
    const activeContracts = this.contracts.filter((c) => c.status === 'Active');
    this.completionRate = (activeContracts.length / this.contracts.length) * 100;

    // Get upcoming renewals (contracts ending in next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    this.upcomingRenewals = this.contracts
      .filter((contract) => new Date(contract.endDate) <= thirtyDaysFromNow)
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
      .slice(0, 3);

    // Get recent activities (latest 3 contracts)
    this.recentActivities = this.contracts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);
  }

  calculateTargetProgress(): string {
    return `${this.completionRate}/${this.targetCompletionRate}`;
  }

  isTargetReached(): boolean {
    return this.completionRate >= this.targetCompletionRate;
  }
}
