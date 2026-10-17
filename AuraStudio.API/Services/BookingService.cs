using AuraStudio.API.Data;
using AuraStudio.API.DTOs;
using AuraStudio.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AuraStudio.API.Services
{
    public class BookingService : IBookingService
    {
        private readonly AppDbContext _context;

        public BookingService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Booking>> GetAllBookingsAsync()
        {
            return await _context.Bookings
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Booking>> GetUserBookingsAsync(int userId)
        {
            return await _context.Bookings
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task<Booking?> GetBookingByIdAsync(int id)
        {
            return await _context.Bookings.FindAsync(id);
        }

        public async Task<Booking> CreateBookingAsync(CreateBookingDto dto)
        {
            var booking = new Booking
            {
                UserId = dto.UserId > 0 ? dto.UserId : 2,
                CustomerName = string.IsNullOrWhiteSpace(dto.CustomerName) ? "Guest Customer" : dto.CustomerName,
                CustomerEmail = dto.CustomerEmail,
                ServiceName = dto.ServiceName,
                StudioRoom = string.IsNullOrWhiteSpace(dto.StudioRoom) ? dto.ServiceName : dto.StudioRoom,
                BookingDate = dto.BookingDate,
                TimeSlot = dto.TimeSlot,
                DurationHours = dto.DurationHours <= 0 ? 2 : dto.DurationHours,
                TotalAmount = dto.TotalAmount,
                Status = "Confirmed",
                SpecialRequests = dto.SpecialRequests,
                AddOns = dto.AddOns,
                CreatedAt = DateTime.UtcNow
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();
            return booking;
        }

        public async Task<Booking?> UpdateBookingStatusAsync(int id, string status)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return null;

            booking.Status = status;
            await _context.SaveChangesAsync();
            return booking;
        }

        public async Task<bool> CancelBookingAsync(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return false;

            booking.Status = "Cancelled";
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
