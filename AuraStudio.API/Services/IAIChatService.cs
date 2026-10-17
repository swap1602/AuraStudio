using AuraStudio.API.DTOs;

namespace AuraStudio.API.Services
{
    public interface IAIChatService
    {
        Task<ChatReplyDto> GenerateReplyAsync(string message);
    }
}
