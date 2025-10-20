# Entity Relationships Documentation

**Document Version:** 1.0
**Last Updated:** 2025-10-05
**Status:** Draft

> ⚠️ **Living Document!**  
> This file is **continuously updated** on the *dev* branch.  
> It must be **kept in sync** with both the latest API contracts and the actual implementation.  
> The document must always reflects the **current state of the development environment**.

***

## 1. Class Diagram (Angular / Domain Model)

```mermaid
classDiagram
    %% Enums
    class QuestionType {
        <<enumeration>>
        MultipleChoice
        CodeCompletion
        TrueFalse
        FillInBlank
        CodeReview
    }
    
    class DifficultyLevel {
        <<enumeration>>
        Easy
        Medium
        Hard
    }
    
    class SessionStatus {
        <<enumeration>>
        Active
        Completed
        Terminated
    }
    
    %% Core Entities
    class User {
        +string Id
        +string Username
        +string PasswordHash
        +DateTime CreatedAt
        +DateTime UpdatedAt
        +bool IsActive
    }
    
    class Question {
        +string Id
        +QuestionType Type
        +string Language
        +DifficultyLevel Difficulty
        +string Title
        +string QuestionText
        +string Explanation
        +string Tags
        +string Metadata
        +DateTime CreatedAt
        +DateTime UpdatedAt
        +string CreatedBy
        +bool IsActive
    }
    
    class MultipleChoiceQuestion {
        +string QuestionId
        +string Options
        +string CorrectAnswerIds
        +bool AllowMultipleSelection
        +bool ShuffleOptions
    }
    
    class CodeCompletionQuestion {
        +string QuestionId
        +string StarterCode
        +string CorrectAnswer
        +string Hints
        +string Constraints
    }
    
    class Session {
        +string Id
        +string UserId
        +string Language
        +DifficultyLevel Difficulty
        +int DesiredCount
        +SessionStatus Status
        +DateTime CreatedAt
        +DateTime UpdatedAt
    }
    
    class SessionQuestion {
        +string Id
        +string SessionId
        +string QuestionId
        +bool Answered
        +bool Correct
        +int PointsEarned
        +DateTime? AnsweredAt
    }
    
    class Progress {
        +string UserId
        +int TotalScore
        +int Xp
        +int CurrentLevel
        +int Streak
        +float Accuracy
        +DateTime? LastSessionAt
    }
    
    class Achievement {
        +string Id
        +string Name
        +string Description
        +int Points
    }
    
    class UserAchievement {
        +string Id
        +string UserId
        +string AchievementId
        +DateTime DateClaimed
    }
    
    %% Relationships
    User "1" --> "0..*" Session : has
    User "1" --> "1" Progress : has
    User "1" --> "0..*" UserAchievement : earns
    
    Session "1" --> "0..*" SessionQuestion : includes
    Session "*" --> "1" User : belongs to
    
    Question "1" --> "0..*" SessionQuestion : used in
    Question "1" --> "0..1" MultipleChoiceQuestion : extends
    Question "1" --> "0..1" CodeCompletionQuestion : extends
    Question --> QuestionType : uses
    Question --> DifficultyLevel : uses
    
    SessionQuestion "*" --> "1" Session : belongs to
    SessionQuestion "*" --> "1" Question : references
    
    Session --> SessionStatus : uses
    Session --> DifficultyLevel : uses
    
    Progress "1" --> "1" User : aggregates
    
    Achievement "1" --> "0..*" UserAchievement : granted as
    UserAchievement "*" --> "1" User : belongs to
    UserAchievement "*" --> "1" Achievement : represents
```


***

## 2. Database Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o{ SESSION : owns
    SESSION ||--o{ SESSION_QUESTION : includes
    SESSION_QUESTION }o--|| QUESTION : represents
    USER ||--|| PROGRESS : has
    USER ||--o{ USER_ACHIEVEMENT : earns
    USER_ACHIEVEMENT }o--|| ACHIEVEMENT : links
```


***

## 3. Entity Types and Fields

### User

| Field | Type | Notes |
| :-- | :-- | :-- |
| id | VARCHAR(36) | Primary Key |
| username | VARCHAR(50) | Unique |
| email | VARCHAR(255) | Unique, verified |
| passwordHash | VARCHAR(255) | Hashed password |
| createdAt | DATETIME | Timestamp |
| updatedAt | DATETIME | Timestamp |
| isActive | BOOLEAN | Account active status |

### Question

| Field | Type | Notes |
| :-- | :-- | :-- |
| id | VARCHAR(36) | Primary Key |
| type | ENUM | MC, CODE, TF, etc. |
| language | VARCHAR(20) | Programming language |
| difficulty | ENUM | easy, medium, hard |
| title | VARCHAR(255) | Short descriptive title |
| questionText | TEXT | Full question content |
| explanation | TEXT | Explanation/feedback text |
| tags | JSON | Tags array |
| metadata | JSON | Version, usage stats |
| createdAt | DATETIME | Timestamp |
| updatedAt | DATETIME | Timestamp |
| isActive | BOOLEAN | Active flag |

### MultipleChoiceQuestion

| Field | Type | Notes |
| :-- | :-- | :-- |
| questionId | VARCHAR(36) | FK to Question |
| options | JSON | Array of answer options |
| correctAnswerIds | JSON | Array of correct option IDs |
| allowMultipleSelection | BOOLEAN | Single or multiple correct answers |

### CodeCompletionQuestion

| Field | Type | Notes |
| :-- | :-- | :-- |
| questionId | VARCHAR(36) | FK to Question |
| starterCode | TEXT | Code template |
| correctAnswer | TEXT | Expected answer string |
| hints | JSON | Array of hint strings |
| constraints | JSON | Execution constraints |

### Session

| Field | Type | Notes |
| :-- | :-- | :-- |
| id | VARCHAR(36) | Primary Key |
| userId | VARCHAR(36) | FK to User |
| language | VARCHAR(20) | Session language |
| difficulty | ENUM | Session difficulty |
| desiredCount | INT | Number of questions requested |
| status | VARCHAR(20) | e.g. Active, Completed |
| createdAt | DATETIME | Timestamp |
| updatedAt | DATETIME | Timestamp |

### SessionQuestion

| Field | Type | Notes |
| :-- | :-- | :-- |
| id | VARCHAR(36) | Primary Key |
| sessionId | VARCHAR(36) | FK to Session |
| questionId | VARCHAR(36) | FK to Question |
| answered | BOOLEAN | Whether answered |
| correct | BOOLEAN | Whether answered correctly |
| pointsEarned | INT | Points earned |
| answeredAt | DATETIME | Timestamp of answer |

### Progress

| Field | Type | Notes |
| :-- | :-- | :-- |
| userId | VARCHAR(36) | FK to User |
| totalScore | INT | Aggregate score |
| xp | INT | Experience points |
| currentLevel | INT | User level |
| streak | INT | Consecutive correct answers |
| accuracy | FLOAT | Correct answers rate |
| lastSessionAt | DATETIME | Last session date |

### Achievement

| Field | Type | Notes |
| :-- | :-- | :-- |
| id | VARCHAR(36) | Primary Key |
| name | VARCHAR(100) | Achievement title |
| description | TEXT | Explanation |
| points | INT | Points awarded |

### UserAchievement

| Field | Type | Notes |
| :-- | :-- | :-- |
| userId | VARCHAR(36) | FK to User |
| achievementId | VARCHAR(36) | FK to Achievement |
| dateClaimed | DATETIME | Timestamp of achievement claim |


***
