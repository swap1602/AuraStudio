using AuraStudio.API.Data;
using AuraStudio.API.DTOs;
using AuraStudio.API.Models;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace AuraStudio.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
            {
                return new AuthResponseDto { Success = false, Message = "An account with this email already exists." };
            }

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = dto.Password, // Simple hash/store for studio showcase
                Role = string.IsNullOrWhiteSpace(dto.Role) ? "Customer" : dto.Role,
                Phone = dto.Phone,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);

            return new AuthResponseDto
            {
                Success = true,
                Message = "Registration successful!",
                Token = token,
                User = MapUserToDto(user)
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());
            if (user == null || user.PasswordHash != dto.Password)
            {
                return new AuthResponseDto { Success = false, Message = "Invalid email address or password." };
            }

            var token = GenerateJwtToken(user);

            return new AuthResponseDto
            {
                Success = true,
                Message = "Login successful!",
                Token = token,
                User = MapUserToDto(user)
            };
        }

        public async Task<UserDto?> GetProfileAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            return user == null ? null : MapUserToDto(user);
        }

        private string GenerateJwtToken(User user)
        {
            var secret = _configuration["Jwt:Secret"] ?? "AuraStudioSuperSecretKey2026!WithVeryLongLengthForSecurity#";
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "AuraStudio.API",
                audience: _configuration["Jwt:Audience"] ?? "AuraStudio.UI",
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static UserDto MapUserToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                Phone = user.Phone
            };
        }
    }
}
