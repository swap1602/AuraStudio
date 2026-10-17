using AuraStudio.API.DTOs;
using AuraStudio.API.Models;

namespace AuraStudio.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
        Task<UserDto?> GetProfileAsync(int userId);
    }
}
