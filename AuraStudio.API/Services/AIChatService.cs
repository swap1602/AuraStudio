using AuraStudio.API.Data;
using AuraStudio.API.DTOs;
using AuraStudio.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AuraStudio.API.Services
{
    public class AIChatService : IAIChatService
    {
        private readonly AppDbContext _context;

        public AIChatService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ChatReplyDto> GenerateReplyAsync(string userMessage)
        {
            var msgLower = userMessage.ToLower().Trim();

            // Save user message in memory database
            _context.ChatMessages.Add(new ChatMessage
            {
                Sender = "User",
                Text = userMessage,
                Timestamp = DateTime.UtcNow,
                IsAi = false
            });

            string replyText;
            List<string> actions = new List<string>();

            if (msgLower.Contains("price") || msgLower.Contains("cost") || msgLower.Contains("rate"))
            {
                replyText = "✨ **AuraStudio Pricing Overview:**\n" +
                            "• **Photography Suite Alpha**: $120/hr (Includes Profoto lights & motorized backdrops)\n" +
                            "• **Dolby Atmos Music Studio**: $150/hr (SSL Console, Neumann U87, Atmos 7.1.4)\n" +
                            "• **4K Podcast Lounge**: $95/hr (4x Shure SM7B, ATEM Switcher, 4K Cameras)\n" +
                            "• **Cinema Soundstage**: $220/hr (RED V-Raptor 8K, ARRI SkyPanels, 180° Green Screen)\n" +
                            "• **Dance & Performance Studio**: $80/hr (Sprung wood floor, full mirrors & JBL rig)";
                actions.Add("Book Studio Session");
                actions.Add("View Studio Gear");
            }
            else if (msgLower.Contains("podcast") || msgLower.Contains("mic") || msgLower.Contains("audio"))
            {
                replyText = "🎙️ **Podcast & Audio Studio Specs:**\n" +
                            "Our 4K Podcast Lounge and Dolby Atmos Suite are broadcast-certified! They feature acoustic vocal booths, Shure SM7B dynamic mics, Neumann U87 condenser mics, and multi-cam 4K recording. Would you like to reserve a time slot?";
                actions.Add("Book Podcast Lounge");
                actions.Add("Talk to Sound Engineer");
            }
            else if (msgLower.Contains("photo") || msgLower.Contains("camera") || msgLower.Contains("light") || msgLower.Contains("cyclorama"))
            {
                replyText = "📸 **Photography Suite Alpha:**\n" +
                            "Features a seamless white cyclorama wall, motorized color backdrops, Profoto D2 1000W flashes, tethering stations, and a dedicated vanity/makeup room. Perfect for high-fashion, product shoots, and lookbooks.";
                actions.Add("Book Photo Suite");
                actions.Add("Check Equipment List");
            }
            else if (msgLower.Contains("book") || msgLower.Contains("slot") || msgLower.Contains("reserve") || msgLower.Contains("available"))
            {
                replyText = "📅 **Studio Availability:**\n" +
                            "We are open 7 days a week from 8:00 AM to 11:00 PM! You can pick your desired studio room, date, and preferred time slot using our interactive Booking Portal.";
                actions.Add("Go to Booking Page");
            }
            else if (msgLower.Contains("location") || msgLower.Contains("address") || msgLower.Contains("where"))
            {
                replyText = "📍 **AuraStudio Headquarters:**\n" +
                            "We are located at 450 Creative Boulevard, District 7, Metropolitan Arts Center. Dedicated parking, load-in freight elevator, and VIP green room access available for all bookings.";
            }
            else if (msgLower.Contains("hello") || msgLower.Contains("hi") || msgLower.Contains("hey"))
            {
                replyText = "👋 Hello! Welcome to **AuraStudio**. I'm Aura AI, your creative production assistant. How can I help you elevate your project today?";
                actions.Add("Explore Studios");
                actions.Add("Check Pricing");
                actions.Add("Book a Session");
            }
            else
            {
                replyText = $"Welcome! I'm Aura AI. Regarding *\"{userMessage}\"*, our team provides state-of-the-art photography cycloramas, Dolby Atmos audio recording, 4K multi-cam podcasting, and cinematic green stages. Feel free to explore our services or book your studio session anytime!";
                actions.Add("Book a Session");
                actions.Add("View All Services");
            }

            _context.ChatMessages.Add(new ChatMessage
            {
                Sender = "Aura AI",
                Text = replyText,
                Timestamp = DateTime.UtcNow,
                IsAi = true
            });

            await _context.SaveChangesAsync();

            return new ChatReplyDto
            {
                Reply = replyText,
                Timestamp = DateTime.UtcNow,
                SuggestedActions = actions
            };
        }
    }
}
