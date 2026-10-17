using AuraStudio.API.DTOs;
using AuraStudio.API.Models;

namespace AuraStudio.API.Services
{
    public interface IPaymentService
    {
        Task<PaymentResponseDto> ProcessPaymentAsync(ProcessPaymentDto dto);
        Task<List<Payment>> GetPaymentsAsync();
        Task<Payment?> GetPaymentByBookingIdAsync(int bookingId);
    }
}
