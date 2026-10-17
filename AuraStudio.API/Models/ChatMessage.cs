using System.ComponentModel.DataAnnotations;

namespace AuraStudio.API.Models
{
    public class ChatMessage
    {
        [Key]
        public int Id { get; set; }

        public string Sender { get; set; } = "User"; // "User" or "Aura AI"

        [Required]
        public string Text { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public bool IsAi { get; set; }
    }
}
