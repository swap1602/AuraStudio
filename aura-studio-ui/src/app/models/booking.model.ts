export interface Booking {
  id?: number;
  userId: number;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  studioRoom: string;
  bookingDate: string;
  timeSlot: string;
  durationHours: number;
  totalAmount: number;
  status: string;
  specialRequests?: string;
  addOns?: string;
  createdAt?: string;
}
