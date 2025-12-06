using CodeLingo.API.Models;
using CodeLingo.API.Repositories;
using System.Text.Json;
using static CodeLingo.API.DTOs.Question.QuestionDtos;

namespace CodeLingo.API.Logics
{
    public class AnswerEvaluationLogic
    {
        IMultipleChoiceQuestionRepository multipleChoiceQuestionRepository;
        SessionQuestionRepository sessionQuestionRepository;

        public AnswerEvaluationLogic(IMultipleChoiceQuestionRepository multipleChoiceQuestionRepository, SessionQuestionRepository sessionQuestionRepository)
        {
            this.multipleChoiceQuestionRepository = multipleChoiceQuestionRepository;
            this.sessionQuestionRepository = sessionQuestionRepository;
        }

        public AnswerDto EvaluateAnswer(JsonElement body, string sessionId)
        {
            if (body.TryGetProperty("questionType", out JsonElement questionTypeElement))
            {
                string questionType = questionTypeElement.GetString();

                if (questionType == "MultipleChoice" || questionType == "MultipleChoiceQuestion")
                {
                    return this.EvaluateMultipleChoiceAnswer(body, sessionId);
                }
                else if (questionType == "TrueFalse")
                {
                    // return this.EvaluatetrueFalseAnswer(body);
                }
            }
            throw new Exception("There is no questionType field or the value is not valid");
        }
        public AnswerDto EvaluateMultipleChoiceAnswer(JsonElement body, string sessionId)
        {
            if (body.TryGetProperty("questionId", out JsonElement questionIdElement) && body.TryGetProperty("answerIds", out JsonElement answerIdElements))
            {
                string questionId = questionIdElement.GetString();
                List<string> answerIds = answerIdElements.EnumerateArray()
                    .Select(answerId => answerId.ToString())
                    .ToList();

                MultipleChoiceQuestion multipleChoiceQuestion = multipleChoiceQuestionRepository.Read(questionId);
                List<string> correctAnswers = JsonSerializer.Deserialize<List<string>>(multipleChoiceQuestion.CorrectAnswerIds);

                int score = 0;
                foreach (string answerId in answerIds)
                {
                    if (correctAnswers.Contains(answerId))
                    {
                        score++;
                    }
                }

                var sessionQuestion = sessionQuestionRepository.Read(sessionId, questionId);
                if (sessionQuestion != null)
                {
                    sessionQuestion.Answered = true;
                    sessionQuestionRepository.SaveChanges();
                }
                AnswerDto answerDto = new AnswerDto();
                answerDto.IsCorrect = score == correctAnswers.Count && answerIds.Count == correctAnswers.Count;
                answerDto.Feedback = answerDto.IsCorrect ? "Correct!" : "Incorrect. Please try again.";
                answerDto.Score = score;
                answerDto.TotalQuestions = 1; // This seems to be used as "Total Correct Answers" in this context? Or just 1 question?
                answerDto.IsCompleted = false;
                answerDto.CurrentIndex = "";

                return answerDto;

            }

            throw new Exception("There is no questionId or answerIds field");
        }
    }
}
