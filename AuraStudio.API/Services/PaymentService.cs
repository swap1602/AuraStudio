using AuraStudio.API.Data;
using AuraStudio.API.DTOs;
using AuraStudio.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AuraStudio.API.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly AppDbContext _context;

        public PaymentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PaymentResponseDto> ProcessPaymentAsync(ProcessPaymentDto dto)
        {
            var booking = await _context.Bookings.FindAsync(dto.BookingId);
            if (booking == null)
            {
                return new PaymentResponseDto { Success = false, Message = "Booking not found." };
            }

            var transactionRef = $"TXN-AURA-{Random.Shared.Next(10000, 99999)}";

            var payment = new Payment
            {
                BookingId = dto.BookingId,
                CustomerName = string.IsNullOrWhiteSpace(dto.CustomerName) ? booking.CustomerName : dto.CustomerName,
                Amount = dto.Amount > 0 ? dto.Amount : booking.TotalAmount,
                PaymentMethod = dto.PaymentMethod,
                TransactionRef = transactionRef,
                Status = "Paid",
                PaymentDate = DateTime.UtcNow
            };

            _context.Payments.Add(payment);

            // Update booking status
            booking.Status = "Confirmed";

            await _context.SaveChangesAsync();

            return new PaymentResponseDto
            {
                Success = true,
                Message = "Payment processed successfully!",
                TransactionRef = transactionRef,
                PaymentDate = payment.PaymentDate
            };
        }

        public async Task<List<Payment>> GetPaymentsAsync()
        {
            return await _context.Payments
                .OrderByDescending(p => p.PaymentDate)
                .ToListAsync();
        }

        public async Task<Payment?> GetPaymentByBookingIdAsync(int bookingId)
        {
            return await _context.Payments.FirstOrDefaultAsync(p => p.BookingId == bookingId);
        }
    }
}
