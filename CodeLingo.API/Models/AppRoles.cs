namespace CodeLingo.API.Models
{
    public static class AppRoles
    {
        public const string Admin = "Admin";
        public const string User = "User";

        public static string[] AllRoles => new[] { Admin, User };
    }
}
