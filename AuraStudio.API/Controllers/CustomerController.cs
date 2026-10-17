using AuraStudio.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuraStudio.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CustomerController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCustomers()
        {
            var customers = await _context.Users
                .Where(u => u.Role == "Customer")
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.Phone,
                    u.CreatedAt,
                    TotalBookings = _context.Bookings.Count(b => b.UserId == u.Id)
                })
                .ToListAsync();

            return Ok(customers);
        }

        [HttpGet("{id}/stats")]
        public async Task<IActionResult> GetCustomerStats(int id)
        {
            var bookings = await _context.Bookings.Where(b => b.UserId == id).ToListAsync();
            var totalSpent = bookings.Sum(b => b.TotalAmount);
            var activeBookings = bookings.Count(b => b.Status == "Confirmed" || b.Status == "Pending");

            return Ok(new
            {
                TotalBookings = bookings.Count,
                ActiveBookings = activeBookings,
                TotalSpent = totalSpent,
                LatestBooking = bookings.OrderByDescending(b => b.CreatedAt).FirstOrDefault()
            });
        }
    }
}
