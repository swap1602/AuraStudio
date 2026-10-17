using System.ComponentModel.DataAnnotations;

namespace AuraStudio.API.Models
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }

        public int BookingId { get; set; }

        public string CustomerName { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public string PaymentMethod { get; set; } = "Credit Card"; // Card, PayPal, Crypto, ApplePay

        public string TransactionRef { get; set; } = string.Empty;

        public string Status { get; set; } = "Paid"; // Paid, Pending, Failed

        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    }
}
