namespace AuraStudio.API.DTOs
{
    public class CreateBookingDto
    {
        public int UserId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string ServiceName { get; set; } = string.Empty;
        public string StudioRoom { get; set; } = string.Empty;
        public DateTime BookingDate { get; set; }
        public string TimeSlot { get; set; } = string.Empty;
        public int DurationHours { get; set; } = 2;
        public decimal TotalAmount { get; set; }
        public string SpecialRequests { get; set; } = string.Empty;
        public string AddOns { get; set; } = string.Empty;
    }

    public class UpdateBookingStatusDto
    {
        public string Status { get; set; } = string.Empty; // Confirmed, Completed, Cancelled
    }
}
