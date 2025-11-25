using CodeLingo.API.Models;
using CodeLingo.API.Repositories;

namespace CodeLingo.API.Logics
{
   public class SessionCleanUpLogic : BackgroundService
    {
        private IServiceScopeFactory serviceScopeFactory;
        private readonly ILogger<SessionCleanUpLogic> _logger;
        private Timer? _timer;

        public SessionCleanUpLogic(ILogger<SessionCleanUpLogic> logger, IServiceScopeFactory serviceScopeFactory)
        {
            _logger = logger;
            this.serviceScopeFactory = serviceScopeFactory;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // Schedule first run at midnight today, then every 24 hours
            var now = DateTime.Now;
            var nextRun = now.Date.AddDays(1).AddHours(0).AddMinutes(0).AddSeconds(0);  // Midnight
            if (now > nextRun) nextRun = nextRun.AddDays(1);  // If past midnight, next day

            var delay = nextRun - now;
            _timer = new Timer(DoWork, null, delay, TimeSpan.FromHours(24));  // Repeat every 24h

            _logger.LogInformation("Daily service started. Next run: {NextRun}", nextRun);
            return Task.CompletedTask;
        }

        private void DoWork(object? state)
        {
            try
            {
                _logger.LogInformation("Daily task starting at {Time}", DateTime.Now);
                using var scope = serviceScopeFactory.CreateScope();
                var repository = scope.ServiceProvider.GetRequiredService<ISessionRepository>();
                List<Session> sessions = repository.GetOutdatedSessions();
                foreach (var session in sessions)
                {
                    repository.Delete(session);
                }
                _logger.LogInformation("Daily task completed.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Daily task failed.");
                // Optional: Retry logic or queue for later
            }
        }

        public override void Dispose()
        {
            _timer?.Dispose();
            base.Dispose();
        }
    }
}
