using CodeLingo.API.Models;
using CodeLingo.API.Repositories;
using System.Text.Json;
using static CodeLingo.API.DTOs.Question.QuestionDtos;

namespace CodeLingo.API.Logics
{
    public class AnswerEvaluationLogic
    {
        IMultipleChoiceQuestionRepository multipleChoiceQuestionRepository;

        public AnswerEvaluationLogic(IMultipleChoiceQuestionRepository multipleChoiceQuestionRepository)
        {
            this.multipleChoiceQuestionRepository = multipleChoiceQuestionRepository;  
        }

        public AnswerDto EvaluateAnswer(JsonElement body)
        {
            if (body.TryGetProperty("questionType", out JsonElement questionTypeElement))
            {
                string questionType = questionTypeElement.GetString();

                if (questionType == "MultipleChoiceQuestion")
                {
                    return this.EvaluateMultipleChoiceAnswer(body);
                }
                else if (questionType == "TrueFalse")
                {
                    // return this.EvaluatetrueFalseAnswer(body);
                }
            }
            throw new Exception("There is no questionType field or the value is not valid");
        }
        public AnswerDto EvaluateMultipleChoiceAnswer(JsonElement body)
        {
            if (body.TryGetProperty("questionId", out JsonElement questionIdElement) && body.TryGetProperty("answerIds", out JsonElement answerIdElements))
            {
                string questionId = questionIdElement.GetString();
                List<int> answerIds = answerIdElements.EnumerateArray()
                    .Select(answerId => answerId.GetInt32())
                    .ToList();

                MultipleChoiceQuestion multipleChoiceQuestion = multipleChoiceQuestionRepository.Read(questionId);
                List<int> correctAnswers = JsonSerializer.Deserialize<List<int>>(multipleChoiceQuestion.CorrectAnswerIds);

                int score = 0;
                foreach (int answerId in answerIds)
                {
                    if (correctAnswers.Contains(answerId))
                    {
                        score++;
                    }
                }
                AnswerDto answerDto = new AnswerDto();
                answerDto.IsCorrect = score == correctAnswers.Count;
                answerDto.Feedback = answerDto.IsCorrect ? "All given answers are corret" : "Not all gives answers are corret";
                answerDto.Score = score;
                answerDto.TotalQuestions = correctAnswers.Count;
                answerDto.IsCompleted = false;
                answerDto.CurrentIndex = "";

                return answerDto;

            }

            throw new Exception("There is no questionId or answerIds field");
        }
    }
}
