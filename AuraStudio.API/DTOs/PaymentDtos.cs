namespace AuraStudio.API.DTOs
{
    public class ProcessPaymentDto
    {
        public int BookingId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = "Credit Card";
        public string CardNumber { get; set; } = string.Empty;
        public string ExpiryDate { get; set; } = string.Empty;
        public string Cvc { get; set; } = string.Empty;
    }

    public class PaymentResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string TransactionRef { get; set; } = string.Empty;
        public DateTime PaymentDate { get; set; }
    }
}
