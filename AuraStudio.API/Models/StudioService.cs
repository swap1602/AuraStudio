using System.ComponentModel.DataAnnotations;

namespace AuraStudio.API.Models
{
    public class StudioService
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty; // e.g. Photography, Recording, Podcast, Video, Rehearsal

        public string Description { get; set; } = string.Empty;

        public decimal PricePerHour { get; set; }

        public string ImageUrl { get; set; } = string.Empty;

        public string EquipmentList { get; set; } = string.Empty; // Comma separated

        public string Tag { get; set; } = string.Empty; // e.g., Popular, Premium, Bestseller
    }
}
