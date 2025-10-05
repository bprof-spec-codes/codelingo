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
    class User {
      +string id
      +string username
      +string email
      +string passwordHash
      +Date createdAt
      +Date updatedAt
      +bool isActive
    }
    class Question {
      +string id
      +string type
      +string language
      +string difficulty
      +string title
      +string questionText
      +string explanation
      +string[] tags
      +object metadata
      +Date createdAt
      +Date updatedAt
      +bool isActive
    }
    class MultipleChoiceQuestion {
      +string[] options
      +string[] correctAnswerIds
      +bool allowMultipleSelection
    }
    class CodeCompletionQuestion {
      +string starterCode
      +string correctAnswer
      +string[] hints
      +object constraints
    }
    class Session {
      +string id
      +string userId
      +string language
      +string difficulty
      +int desiredCount
      +string status
      +Date createdAt
      +Date updatedAt
    }
    class SessionQuestion {
      +string id
      +string sessionId
      +string questionId
      +bool answered
      +bool correct
      +int pointsEarned
      +Date answeredAt
    }
    class Progress {
      +string userId
      +int totalScore
      +int xp
      +int currentLevel
      +int streak
      +float accuracy
      +Date lastSessionAt
    }
    class Achievement {
      +string id
      +string name
      +string description
      +int points
    }
    class UserAchievement {
      +string userId
      +string achievementId
      +Date dateClaimed
    }

    User "1" -- "0..*" Session : owns
    Session "1" -- "0..*" SessionQuestion : includes
    SessionQuestion "*" -- "1" Question : represents
    User "1" -- "1" Progress : has
    User "1" -- "0..*" UserAchievement : earns
    UserAchievement "*" -- "1" Achievement : links
    Question <|-- MultipleChoiceQuestion
    Question <|-- CodeCompletionQuestion
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
