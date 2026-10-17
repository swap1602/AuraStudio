namespace AuraStudio.API.DTOs
{
    public class ChatPromptDto
    {
        public string Message { get; set; } = string.Empty;
    }

    public class ChatReplyDto
    {
        public string Reply { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public List<string>? SuggestedActions { get; set; }
    }
}
