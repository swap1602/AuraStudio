using Microsoft.EntityFrameworkCore;
using AuraStudio.API.Models;

namespace AuraStudio.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Booking> Bookings { get; set; } = null!;
        public DbSet<Payment> Payments { get; set; } = null!;
        public DbSet<ChatMessage> ChatMessages { get; set; } = null!;
        public DbSet<StudioService> StudioServices { get; set; } = null!;

        public static void SeedData(AppDbContext context)
        {
            context.Database.EnsureCreated();

            if (!context.StudioServices.Any())
            {
                context.StudioServices.AddRange(
                    new StudioService
                    {
                        Id = 1,
                        Name = "Photography Suite Alpha",
                        Category = "Photography",
                        Description = "High-ceiling cyclorama wall with Profoto lighting grid, motorized backdrops, and private makeup station.",
                        PricePerHour = 120,
                        ImageUrl = "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
                        EquipmentList = "Profoto D2 1000W Flash, Octabox 5ft, Tethering Station, C-Stands, Color Gels",
                        Tag = "Popular"
                    },
                    new StudioService
                    {
                        Id = 2,
                        Name = "Dolby Atmos Music & Recording Studio",
                        Category = "Audio & Music",
                        Description = "Acoustically tuned control room with SSL Duality Console, Neumann U87 mics, and Genelec 7.1.4 Atmos setup.",
                        PricePerHour = 150,
                        ImageUrl = "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=800&q=80",
                        EquipmentList = "SSL Console, Neumann U87 Ai, Universal Audio Apollo x16, Moog Synthesizers, Acoustic Vocal Booth",
                        Tag = "Premium"
                    },
                    new StudioService
                    {
                        Id = 3,
                        Name = "4K Podcast & Broadcast Lounge",
                        Category = "Podcast",
                        Description = "Soundproof multi-cam broadcast setup with warm ambient RGB lighting, Shure SM7B mics, and live switching equipment.",
                        PricePerHour = 95,
                        ImageUrl = "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
                        EquipmentList = "4x Shure SM7B Mics, Blackmagic ATEM Mini Pro, Sony FX3 Cameras, Custom Podcast Desk",
                        Tag = "Bestseller"
                    },
                    new StudioService
                    {
                        Id = 4,
                        Name = "Cinema & Green Screen Soundstage",
                        Category = "Video Production",
                        Description = "Spacious 1,500 sq ft soundstage featuring 180° green screen, RED V-Raptor cameras, and heavy-duty ceiling trusses.",
                        PricePerHour = 220,
                        ImageUrl = "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
                        EquipmentList = "RED V-Raptor 8K VV, ARRI SkyPanels, Wireless Video Transmission, Teleprompter, Chroma Green Stage",
                        Tag = "Pro Stage"
                    },
                    new StudioService
                    {
                        Id = 5,
                        Name = "Dance & Performance Rehearsal Studio",
                        Category = "Rehearsal",
                        Description = "Sprung hardwood flooring, full mirrored wall, high-powered JBL sound system, and atmospheric LED mood lighting.",
                        PricePerHour = 80,
                        ImageUrl = "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
                        EquipmentList = "JBL PRX 1500W Speakers, Full Mirrored Wall, Ballet Barres, Bluetooth Audio Mixer, RGB Ambient Lighting",
                        Tag = "Spacious"
                    }
                );
            }

            if (!context.Users.Any())
            {
                context.Users.AddRange(
                    new User
                    {
                        Id = 1,
                        FullName = "Aura Admin",
                        Email = "admin@aurastudio.com",
                        PasswordHash = "admin123", // In demo environment stored directly or hashed
                        Role = "Admin",
                        Phone = "+1 555 019 2831",
                        CreatedAt = DateTime.UtcNow.AddDays(-30)
                    },
                    new User
                    {
                        Id = 2,
                        FullName = "Alex Mercer",
                        Email = "alex@example.com",
                        PasswordHash = "customer123",
                        Role = "Customer",
                        Phone = "+1 555 948 1029",
                        CreatedAt = DateTime.UtcNow.AddDays(-10)
                    }
                );
            }

            if (!context.Bookings.Any())
            {
                context.Bookings.AddRange(
                    new Booking
                    {
                        Id = 101,
                        UserId = 2,
                        CustomerName = "Alex Mercer",
                        CustomerEmail = "alex@example.com",
                        ServiceName = "Dolby Atmos Music & Recording Studio",
                        StudioRoom = "Studio Room B (Audio)",
                        BookingDate = DateTime.UtcNow.AddDays(2).Date,
                        TimeSlot = "14:00 - 17:00",
                        DurationHours = 3,
                        TotalAmount = 450,
                        Status = "Confirmed",
                        SpecialRequests = "Need sound engineer present for vocal tracking.",
                        AddOns = "Sound Engineer, Neumann Mic Upgrade",
                        CreatedAt = DateTime.UtcNow.AddDays(-2)
                    },
                    new Booking
                    {
                        Id = 102,
                        UserId = 2,
                        CustomerName = "Alex Mercer",
                        CustomerEmail = "alex@example.com",
                        ServiceName = "4K Podcast & Broadcast Lounge",
                        StudioRoom = "Podcast Suite 1",
                        BookingDate = DateTime.UtcNow.AddDays(5).Date,
                        TimeSlot = "10:00 - 12:00",
                        DurationHours = 2,
                        TotalAmount = 190,
                        Status = "Confirmed",
                        SpecialRequests = "Recording 4-person video podcast.",
                        AddOns = "4K Video Recording Package",
                        CreatedAt = DateTime.UtcNow.AddDays(-1)
                    }
                );
            }

            if (!context.Payments.Any())
            {
                context.Payments.AddRange(
                    new Payment
                    {
                        Id = 1,
                        BookingId = 101,
                        CustomerName = "Alex Mercer",
                        Amount = 450,
                        PaymentMethod = "Credit Card",
                        TransactionRef = "TXN-AURA-88392",
                        Status = "Paid",
                        PaymentDate = DateTime.UtcNow.AddDays(-2)
                    },
                    new Payment
                    {
                        Id = 2,
                        BookingId = 102,
                        CustomerName = "Alex Mercer",
                        Amount = 190,
                        PaymentMethod = "PayPal",
                        TransactionRef = "TXN-AURA-99201",
                        Status = "Paid",
                        PaymentDate = DateTime.UtcNow.AddDays(-1)
                    }
                );
            }

            context.SaveChanges();
        }
    }
}
