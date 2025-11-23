using CodeLingo.API.Data;
using CodeLingo.API.Models;
using Microsoft.AspNetCore.Identity;

namespace CodeLingo.API.Logics
{
    public class AuthLogic
    {
        private readonly AppDbContext _ctx;
        private readonly IConfiguration _config;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IPasswordHasher<User> _passwordHasher;

        public AuthLogic(AppDbContext ctx, IConfiguration config,UserManager<User> userManager, RoleManager<IdentityRole> roleManager, IPasswordHasher<User> passwordHasher)
        {
            _ctx = ctx;
            _config = config;
            _userManager = userManager;
            _roleManager = roleManager;
            _passwordHasher = passwordHasher;
        }

        public string HashPassword(User user, string password)
        {
            return _passwordHasher.HashPassword(user, password);
        }

        public bool VerifyPassword(User user, string password, string passwordHash)
        {
            var result = _passwordHasher.VerifyHashedPassword(user, passwordHash, password);
            return result == PasswordVerificationResult.Success || result == PasswordVerificationResult.SuccessRehashNeeded;
        }
    }
}
