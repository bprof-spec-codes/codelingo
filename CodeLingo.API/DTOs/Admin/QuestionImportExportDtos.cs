namespace CodeLingo.API.DTOs.Admin
{
    public class QuestionImportExportDtos
    {
        public class QuestionImportErrorDto
        {
            public int RowNumber { get; set; }
            public string Message { get; set; } = string.Empty;
            public string? Field { get; set; }
        }

        public class QuestionImportReportDto
        {
            public string Status { get; set; } = string.Empty;
            public int TotalRows { get; set; }
            public int ImportedCount { get; set; }
            public int FailedCount { get; set; }
            public List<QuestionImportErrorDto> Errors { get; set; } = new();
            public string? Summary { get; set; }
        }
    }
}
