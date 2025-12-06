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
        IQuestionRepository questionRepository;

        public AnswerEvaluationLogic(IMultipleChoiceQuestionRepository multipleChoiceQuestionRepository, SessionQuestionRepository sessionQuestionRepository, IQuestionRepository questionRepository)
        {
            this.multipleChoiceQuestionRepository = multipleChoiceQuestionRepository;
            this.sessionQuestionRepository = sessionQuestionRepository;
            this.questionRepository = questionRepository;
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
                else if (questionType == "CodeCompletion")
                {
                    return this.EvaluateCodeCompletionAnswer(body, sessionId);
                }
                else if (questionType == "TrueFalse")
                {
                    // return this.EvaluatetrueFalseAnswer(body);
                }
            }
            throw new Exception("There is no questionType field or the value is not valid");
        }

        public AnswerDto EvaluateCodeCompletionAnswer(JsonElement body, string sessionId)
        {
            if (body.TryGetProperty("questionId", out JsonElement questionIdElement) && body.TryGetProperty("code", out JsonElement codeElement))
            {
                string questionId = questionIdElement.GetString();
                string userCode = codeElement.GetString();

                var question = questionRepository.Read(questionId);
                if (question == null || question.CodeCompletionQuestion == null)
                {
                    throw new Exception("Question not found");
                }

                List<string> acceptedAnswers = JsonSerializer.Deserialize<List<string>>(question.CodeCompletionQuestion.AcceptedAnswers ?? "[]");

                bool isCorrect = acceptedAnswers.Any(a => a.Trim().Equals(userCode.Trim(), StringComparison.OrdinalIgnoreCase));

                var sessionQuestion = sessionQuestionRepository.Read(sessionId, questionId);
                if (sessionQuestion != null)
                {
                    sessionQuestion.Answered = true;
                    sessionQuestion.Correct = isCorrect;
                    sessionQuestion.PointsEarned = isCorrect ? 1 : 0;
                    sessionQuestionRepository.SaveChanges();
                }

                AnswerDto answerDto = new AnswerDto();
                answerDto.IsCorrect = isCorrect;
                answerDto.Feedback = isCorrect ? "Correct!" : "Incorrect. Please try again.";
                answerDto.Score = isCorrect ? 1 : 0;
                answerDto.TotalQuestions = 1;
                answerDto.IsCompleted = false;
                answerDto.CurrentIndex = "";

                return answerDto;
            }

            throw new Exception("There is no questionId or code field");
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

                bool isCorrect = score == correctAnswers.Count && answerIds.Count == correctAnswers.Count;

                var sessionQuestion = sessionQuestionRepository.Read(sessionId, questionId);
                if (sessionQuestion != null)
                {
                    sessionQuestion.Answered = true;
                    sessionQuestion.Correct = isCorrect;
                    sessionQuestion.PointsEarned = score;
                    sessionQuestionRepository.SaveChanges();
                }
                AnswerDto answerDto = new AnswerDto();
                answerDto.IsCorrect = isCorrect;
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
