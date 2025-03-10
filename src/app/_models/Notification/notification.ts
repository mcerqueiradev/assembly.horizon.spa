export interface Notification {
    id: string;
    senderId: string;
    recipientId: string;
    message: string;
    type: string;
    priority: string;
    referenceId: string;
    referenceType: string;
    createdAt: string;
    status: string;
  }