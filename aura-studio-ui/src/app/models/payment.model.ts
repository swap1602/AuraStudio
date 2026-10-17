export interface ProcessPaymentRequest {
  bookingId: number;
  customerName: string;
  amount: number;
  paymentMethod: string;
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionRef: string;
  paymentDate: string;
}

export interface PaymentRecord {
  id: number;
  bookingId: number;
  customerName: string;
  amount: number;
  paymentMethod: string;
  transactionRef: string;
  status: string;
  paymentDate: string;
}
