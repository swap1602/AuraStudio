using System.ComponentModel.DataAnnotations;

namespace AuraStudio.API.Models
{
    public class Booking
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        public string CustomerName { get; set; } = string.Empty;

        public string CustomerEmail { get; set; } = string.Empty;

        [Required]
        public string ServiceName { get; set; } = string.Empty;

        public string StudioRoom { get; set; } = string.Empty;

        public DateTime BookingDate { get; set; }

        public string TimeSlot { get; set; } = string.Empty; // e.g. "10:00 AM - 12:00 PM"

        public int DurationHours { get; set; } = 2;

        public decimal TotalAmount { get; set; }

        public string Status { get; set; } = "Confirmed"; // Pending, Confirmed, Completed, Cancelled

        public string SpecialRequests { get; set; } = string.Empty;

        public string AddOns { get; set; } = string.Empty; // e.g. "4K Camera Rig, Sound Engineer"

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
