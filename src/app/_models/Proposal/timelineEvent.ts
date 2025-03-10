export interface TimelineEvent {
  date: Date;
  title: string;
  description: string;
  type: 'status' | 'negotiation' | 'document';
  status?: string;
  icon: 'document-add' | 'search' | 'currency-dollar' | 'chat' | 'document' | 'check-circle' | 'x-circle' | 'ban';
  counterOffer?: number;
}
