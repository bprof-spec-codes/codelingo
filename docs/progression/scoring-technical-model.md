## 2. Technikai Architektúra

### 2.1. Fő entitások és kapcsolatok

```mermaid
erDiagram
    USER ||--o{ SESSION : "has"
    SESSION ||--o{ SESSION_QUESTION : "includes"
    SESSION_QUESTION }o--|| QUESTION : "is"
    USER ||--|| USER_STATS : "aggregated in"
    USER ||--o{ ACHIEVEMENT : "earns"
```


### 2.2. Főtáblák

- **USER:** id, displayName, ...
- **SESSION:** id, userId, language, difficulty, createdAt
- **SESSION_QUESTION:** id, sessionId, questionId, answered, correct, pointsEarned, answeredAt
- **QUESTION:** id, type, language, difficulty, content
- **USER_STATS:** userId, totalScore, xp, currentLevel, streak, accuracy, lastSessionAt
- **ACHIEVEMENT:** id, name, type, description, points
- **USER_ACHIEVEMENT:** userId, achievementId, dateClaimed


### 2.3. Számítások, aggregációk

#### Pontszámítás menet

- Answer submission -> kiértékelés -> pontszámítás -> session/question update -> user_stats update -> achievement check

```mermaid
flowchart TD
    A[AnswerSubmitted] --> B[ValidateAnswer]
    B --> C[CalculatePoints]
    C --> D[StoreSessionQuestionResult]
    D --> E[UpdateSessionProgress]
    E --> F[UpdateUserStats]
    F --> G[CheckAchievements]
    G --> H[UpdateLeaderboard]
```


#### Aggregált statisztika frissítés

- Minden session/befejezett kérdés után recalculál:
    - **totalScore** += pontok
    - **accuracy** = helyes válaszok / összes válasz
    - **streak** = egymás után helyes válaszok száma
    - **currentLevel** = szint XP szerint
    - **lastSessionAt** = utolsó session időpontja


#### Példák lekérdezésekre

- Legjobb napi/heti/havi/top pontszám

```sql
SELECT userId, SUM(pointsEarned) as dailyScore
FROM session_question
WHERE answeredAt > CURRENT_DATE - INTERVAL 1 DAY
GROUP BY userId
ORDER BY dailyScore DESC
LIMIT 10;
```

- Felhasználó achievementjei lekérdezve

```sql
SELECT a.name, a.description, ua.dateClaimed
FROM USER_ACHIEVEMENT ua
JOIN ACHIEVEMENT a ON ua.achievementId = a.id
WHERE ua.userId = ?
```


### 2.4. API kapcsolatok, adatút

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant API as Practice API
    participant DB as Database

    FE->>API: POST /sessions/{id}/answer (answerPayload)
    API->>DB: validate answer, compute points
    DB-->>API: store points, update stats, check achievements
    API-->>FE: { correct, feedback, points, achievements, newLevel }
    FE->>API: GET /users/{id}/stats
    API->>DB: query stats
    DB-->>API: totalScore, accuracy, level, streak, ...
    API-->>FE: user stats data
```

