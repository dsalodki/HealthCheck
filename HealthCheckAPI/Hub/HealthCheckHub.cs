using Microsoft.AspNetCore.SignalR;

namespace HealthCheckAPI.Hub
{
    public class HealthCheckHub : Microsoft.AspNetCore.SignalR.Hub
    {
        public async Task ClientUpdate(string message) =>
            await Clients.All.SendAsync("ClientUpdate", message);
    }
}
