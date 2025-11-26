using System.ComponentModel.DataAnnotations;

namespace CodeLingo.API.DTOs.Auth
{
    public class AuthDtos
    {
        public class RegisterRequestDto
        {
            [Required]
            [StringLength(50, MinimumLength = 3)]
            public string Username { get; set; }

            [Required]
            [StringLength(100, MinimumLength = 6)]
            public string Password { get; set; }
        }

        public class LoginRequestDto
        {
            [Required]
            public string Username { get; set; }

            [Required]
            public string Password { get; set; }
        }

        public class AuthResponseDto
        {
            public string Message { get; set; }
            public string UserId { get; set; }
            public string AccessToken { get; set; }
            public string RefreshToken { get; set; }
            public int ExpiresIn { get; set; }
            public bool IsAdmin { get; set; }
        }

        public class RefreshTokenRequestDto
        {
            [Required]
            public string RefreshToken { get; set; }
        }

        public class TokenResponseDto
        {
            public string AccessToken { get; set; }
            public int ExpiresIn { get; set; }
            public bool IsAdmin { get; set; }
        }
    }
}
