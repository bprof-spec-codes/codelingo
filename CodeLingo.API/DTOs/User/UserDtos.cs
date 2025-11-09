namespace CodeLingo.API.DTOs.User
{
    public class UserDtos
    {
        public class UserProfileDto
        {
            public string UserId { get; set; }
            public string Username { get; set; }
        }

        public class UpdateUserProfileDto
        {
            public string Username { get; set; }
        }
    }
}
