namespace CodeLingo.API.DTOs.Exceptions
{
    public class NotSufficientQuestionsException: Exception
    {
        public int AvailableCount { get; set; }
        public int RequestedCount { get; set; }

        public NotSufficientQuestionsException(string msg): base(msg)
        {
                
        }

        public NotSufficientQuestionsException(string msg, int availableCount, int requestedCount): base(msg)
        {
            AvailableCount = availableCount;
            RequestedCount = requestedCount;
        }
    }
}
