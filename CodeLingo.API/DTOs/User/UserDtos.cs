namespace CodeLingo.API.DTOs.User
{
    public class UserDtos
    {
        public class UserProfileDto
        {
            public string UserId { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string? ProfilePictureUrl { get; set; }
        }

        public class UpdateUserProfileDto
        {
            public string Username { get; set; }
            public string Email { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string? ProfilePictureUrl { get; set; }
        }
    }
}
