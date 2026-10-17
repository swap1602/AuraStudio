using AuraStudio.API.DTOs;
using AuraStudio.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuraStudio.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IAIChatService _chatService;

        public ChatController(IAIChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost]
        public async Task<IActionResult> AskAi([FromBody] ChatPromptDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Message))
            {
                return BadRequest(new { message = "Message body cannot be empty." });
            }

            var reply = await _chatService.GenerateReplyAsync(dto.Message);
            return Ok(reply);
        }
    }
}
