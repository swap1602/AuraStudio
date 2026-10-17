using AuraStudio.API.DTOs;
using AuraStudio.API.Models;

namespace AuraStudio.API.Services
{
    public interface IBookingService
    {
        Task<List<Booking>> GetAllBookingsAsync();
        Task<List<Booking>> GetUserBookingsAsync(int userId);
        Task<Booking?> GetBookingByIdAsync(int id);
        Task<Booking> CreateBookingAsync(CreateBookingDto dto);
        Task<Booking?> UpdateBookingStatusAsync(int id, string status);
        Task<bool> CancelBookingAsync(int id);
    }
}
