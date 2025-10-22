# API Reference

Ez a dokumentum tartalmazza az összes API endpoint specifikációját a CodeLingo projekthez.

---

## Authentication APIs

### POST /auth/register
Új felhasználó regisztrálása a rendszerbe.

**Request Body:**
- `string`: username
- `string`: email
- `string`: password

**Responses:**

**201 Created:**
- `string`: message ("Registration successful")
- `string`: userId
- `string`: accessToken (JWT)
- `string`: refreshToken
- `integer`: expiresIn

**400 Bad Request:**
- `string`: error
  - "Missing required fields"
  - "Invalid email format"
  - "Password does not meet security requirements"
  - "Username already exists"
  - "Email already registered"

---

### POST /auth/login
Felhasználó bejelentkeztetése és JWT token generálása.

**Request Body:**
- `string`: username or email
- `string`: password

**Responses:**

**200 OK:**
- `string`: accessToken (JWT)
- `string`: refreshToken
- `integer`: expiresIn

**401 Unauthorized:**
- `string`: error ("Invalid credentials")

---

### POST /auth/token/refresh
JWT token frissítése refresh token segítségével.

**Request Body:**
- `string`: refreshToken

**Responses:**

**200 OK:**
- `string`: accessToken (JWT)
- `integer`: expiresIn

**401 Unauthorized:**
- `string`: error ("Invalid or expired refresh token")

---

## User Management APIs

### GET /users/me
Bejelentkezett felhasználó profiljának lekérése.

**Headers:**
- `string`: Authorization (Bearer token)

**Responses:**

**200 OK:**
- `string`: userId
- `string`: username
- `string`: email
- `string`: firstName
- `string`: lastName
- `string`: profilePictureUrl

**401 Unauthorized:**
- `string`: error ("Unauthorized")

---

### PUT /users/me
Felhasználói profil frissítése.

**Headers:**
- `string`: Authorization (Bearer token)

**Request Body:**
- `string`: username
- `string`: email
- `string`: firstName
- `string`: lastName
- `string`: profilePictureUrl

**Responses:**

**200 OK:**
- `string`: message ("Profile updated successfully")

**400 Bad Request:**
- `string`: error ("Invalid field value(s)")

**401 Unauthorized:**
- `string`: error ("Unauthorized")

---

## Practice Mode APIs

### POST /sessions/start
Új gyakorló session indítása megadott paraméterekkel.

**Request Body:**
- `string`: userId
- `string`: language
- `string`: difficulty
- `integer`: requestedQuestionCount

**Responses:**

**201 Created:**
- `string`: sessionId
- `integer`: totalPlannedQuestions

**400 Bad Request:**
- `string`: error ("Invalid input parameters")

**404 Not Found:**
- `string`: error ("User not found or insufficient questions available")

---

### GET /sessions/{id}/next
Következő kérdés lekérése a session-ben.

**Path Parameters:**
- `string`: id (session ID)

**Responses:**

**200 OK:**
- `string`: questionId
- `string`: questionType (pl. "multiple_choice", "code_completion")
- `object`: questionData (kérdés szöveg, válaszopciók, vagy kód snippet)
- `integer`: currentIndex (jelenlegi kérdés száma)
- `integer`: totalQuestions (összes kérdés a session-ben)
- `boolean`: isCompleted (true ha a session befejeződött)
- `object` (optional): metadata (további megjelenítési utasítások)

**404 Not Found:**
- `string`: error ("Session not found or no more questions")

---

### POST /sessions/{id}/answer
Válasz beküldése és kiértékelése.

**Path Parameters:**
- `string`: id (session ID)

**Request Body:**
- `string` (optional): requestId (egyedi kulcs duplikált feldolgozás megelőzésére)
- `object`: answerPayload (felhasználó válasza, struktúra a kérdés típusától függ)

**Responses:**

**200 OK:**
- `boolean`: isCorrect (helyes-e a válasz)
- `string`: feedback (felhasználóbarát visszajelzés)
- `integer`: score (kapott pontszám)
- `integer`: currentIndex (frissített kérdés index)
- `integer`: totalQuestions
- `boolean`: isCompleted (true ha a session befejeződött)

**400 Bad Request:**
- `string`: error ("Invalid answer format or missing data")

**404 Not Found:**
- `string`: error ("Session not found or already completed")

---

### POST /sessions/{id}/close
Session explicit lezárása.

**Headers:**
- `string`: Authorization (Bearer token, required)

**Path Parameters:**
- `string`: id (session ID)

**Request Body (optional):**
- `boolean` (optional): forceClose (default: false) - lehetővé teszi a lezárást megválaszolatlan kérdések esetén is

**Responses:**

**200 OK:**
- `object`: sessionSummary
  - `string`: sessionId
  - `string`: userId
  - `string`: language
  - `string`: difficulty
  - `string`: status ("completed", "terminated")
  - `integer`: totalQuestions
  - `integer`: answeredQuestions
  - `integer`: correctAnswers
  - `integer`: totalScore
  - `float`: accuracyPercentage
  - `date`: closedAt

**400 Bad Request:**
- `string`: error ("Session already closed or invalid state")

**401 Unauthorized:**
- `string`: error ("Missing or invalid authentication token")

**403 Forbidden:**
- `string`: error ("Not authorized to close this session")

**404 Not Found:**
- `string`: error ("Session not found")

**500 Internal Server Error:**
- `string`: error ("Internal server error")

---

### GET /sessions/{id}/results
Session eredményeinek részletes lekérése.

**Headers:**
- `string`: Authorization (Bearer token, required)

**Path Parameters:**
- `string`: id (session ID)

**Responses:**

**200 OK:**
- `object`: results
  - `string`: sessionId
  - `string`: userId
  - `string`: languageId
  - `string`: difficulty
  - `integer`: totalQuestions
  - `integer`: answeredQuestions
  - `integer`: correctAnswers
  - `integer`: totalScore
  - `float`: accuracyPercentage
  - `date`: createdAt
  - `array`: questions
    - `object`:
      - `string`: questionId
      - `string`: type
      - `string`: title
      - `string`: questionText
      - `string` (optional): explanation
      - `array` (optional): tags
      - `boolean`: answered
      - `boolean`: correct
      - `integer`: pointsEarned
  - `object`: performance
    - `integer`: streakMax
    - `integer`: streakCurrent
    - `object`: breakdown
      - `string`: byLanguage (object: { language: score, accuracy })
      - `string`: byDifficulty (object: { difficulty: score, accuracy })
  - `object` (optional): achievementsUnlocked
    - `array`:
      - `object`:
        - `string`: achievementId
        - `string`: name
        - `string`: description
        - `date`: unlockedAt

**401 Unauthorized:**
- `string`: error ("Missing or invalid authentication token")

**403 Forbidden:**
- `string`: error ("Not authorized to view this session")

**404 Not Found:**
- `string`: error ("Session not found")

**500 Internal Server Error:**
- `string`: error ("Internal server error")

---

## Progress & Stats APIs

### GET /users/{id}/stats
Felhasználó statisztikáinak és előrehaladásának lekérése.

**Headers:**
- `string`: Authorization (Bearer token, required)

**Path Parameters:**
- `string`: id (user ID)

**Responses:**

**200 OK:**
- `object`: userStats
  - `string`: userId
  - `integer`: totalScore
  - `float`: accuracyPercentage
  - `integer`: sessionCount
  - `object`: historicalProgress
    - `array`: sessions
      - `object`:
        - `string`: sessionId
        - `string`: date
        - `integer`: score
        - `float`: accuracy
        - `object`: language
        - `string`: difficulty
  - `object`: languageBreakdown
    - `array`: items
      - `object`:
        - `object`: language
        - `integer`: totalScore
        - `float`: accuracyPercentage
        - `integer`: sessionCount
  - `object`: difficultyBreakdown
    - `array`: items
      - `object`:
        - `string`: difficulty
        - `integer`: totalScore
        - `float`: accuracyPercentage
        - `integer`: sessionCount
  - `object`: timeBasedStats
    - `object`: daily
      - `integer`: score
    - `object`: weekly
      - `integer`: score
    - `object`: monthly
      - `integer`: score
  - `object`: achievements
    - `array`: items
      - `object`: userAchievement
        - `string`: name
        - `boolean`: unlocked
        - `string`: unlockedAt
        - `integer`: progress (0–100 %)
        - `string`: description

**401 Unauthorized:**
- `string`: error ("Missing or invalid authentication token")

**403 Forbidden:**
- `string`: error ("Not authorized to access this user's stats")

**404 Not Found:**
- `string`: error ("User not found")

**500 Internal Server Error:**
- `string`: error ("Internal server error")

---

### GET /leaderboard
Globális vagy szűrt ranglista lekérése.

**Headers:**
- `string`: Authorization (Bearer token, required)

**Query Parameters (optional):**
- `string` (optional): language - szűrés programozási nyelv szerint
- `string` (optional): difficulty - szűrés nehézségi szint szerint
- `integer` (optional): page (default: 1) - lapozáshoz
- `integer` (optional): pageSize (default: 20, max: 100) - rekordok száma laponként

**Responses:**

**200 OK:**
- `object`: leaderboard
  - `integer`: page
  - `integer`: pageSize
  - `integer`: totalEntries
  - `integer`: totalPages
  - `array`: entries
    - `object`:
      - `string`: userId
      - `string`: username
      - `integer`: rank
      - `integer`: score
      - `float`: accuracyPercentage
      - `integer`: sessionCount
      - `string` (optional): language
      - `string` (optional): difficulty
      - `boolean`: isCurrentUser
  - `object`: currentUserContext
    - `integer`: rank
    - `integer`: score
    - `float`: accuracyPercentage
    - `integer`: sessionCount
    - `string`: language (optional if filtered)
    - `string`: difficulty (optional if filtered)
  - `object`: rankingRules
    - `string`: primary ("score")
    - `string`: secondary ("accuracy")
    - `string`: tieBreak ("earliest achievement / first to reach score")

**400 Bad Request:**
- `string`: error ("Invalid query parameters")

**401 Unauthorized:**
- `string`: error ("Missing or invalid authentication token")

**500 Internal Server Error:**
- `string`: error ("Internal server error")

---

## Admin - Language Management APIs

### GET /admin/languages
Összes támogatott programozási nyelv listázása.

**Headers:**
- `string`: Authorization (Bearer token, admin required)

**Responses:**

**200 OK:**
- `array`: languages
  - `object` (Language schema)

**400 Bad Request:**
- `string`: error ("Invalid query parameters")

**401 Unauthorized:**
- `string`: error ("Missing or invalid authentication token")

**403 Forbidden:**
- `string`: error ("Admin privileges required")

**500 Internal Server Error:**
- `string`: error ("Internal server error")

---

### POST /admin/languages
Új programozási nyelv támogatás hozzáadása.

**Headers:**
- `string`: Authorization (Bearer token, admin required)

**Request Body:**
- `string`: name
- `string`: version

**Responses:**

**201 Created:**
- `object`: created language (Language schema)

**400 Bad Request:**
- `string`: error ("Missing required fields")

**401 Unauthorized:**
- `string`: error ("Missing or invalid authentication token")

**403 Forbidden:**
- `string`: error ("Admin privileges required")

**409 Conflict:**
- `string`: error ("Language already exists")

**500 Internal Server Error:**
- `string`: error ("Internal server error")

---

### PUT /admin/languages/{id}
Meglévő nyelv konfigurációjának frissítése.

**Headers:**
- `string`: Authorization (Bearer token, admin required)

**Path Parameters:**
- `string`: id (language ID)

**Request Body:**
- `string`: name
- `string`: version

**Responses:**

**200 OK:**
- `object`: updated language (Language schema)

**400 Bad Request:**
- `string`: error ("Invalid request body")

**401 Unauthorized:**
- `string`: error ("Missing or invalid authentication token")

**403 Forbidden:**
- `string`: error ("Admin privileges required")

**404 Not Found:**
- `string`: error ("Language not found")

**409 Conflict:**
- `string`: error ("Language name/version already exists")

**500 Internal Server Error:**
- `string`: error ("Internal server error")

---

### DELETE /admin/languages/{id}
Nyelv támogatás eltávolítása.

**Headers:**
- `string`: Authorization (Bearer token, admin required)

**Path Parameters:**
- `string`: id (language ID)

**Responses:**

**204 No Content:**
- no content

**401 Unauthorized:**
- `string`: error ("Missing or invalid authentication token")

**403 Forbidden:**
- `string`: error ("Admin privileges required")

**404 Not Found:**
- `string`: error ("Language not found")

**409 Conflict:**
- `string`: error ("Language cannot be deleted because it is in use")

**500 Internal Server Error:**
- `string`: error ("Internal server error")

**Language Schema:**
- `object`: Language
  - `string`: id
  - `string`: name
  - `string`: version
  - `string`: createdAt
  - `string`: updatedAt

---

## Admin - Question Management APIs

### GET /admin/questions
Kérdések listázása szűréssel és lapozással.

**Headers:**
- `string`: Authorization (Bearer admin token, required)

**Query Parameters (optional):**
- `string` (optional): language - szűrés programozási nyelv szerint
- `string` (optional): difficulty - szűrés nehézségi szint szerint
- `string` (optional): type - szűrés kérdés típus szerint
- `boolean` (optional): isActive - inaktív kérdések be/kizárása
- `integer` (optional): page (default: 1)
- `integer` (optional): pageSize (default: 20, max: 100)
- `string` (optional): sortBy (pl. "createdAt", "updatedAt", "difficulty")
- `string` (optional): order ("asc" | "desc")

**Responses:**

**200 OK:**
- `object`: questions
  - `integer`: page
  - `integer`: pageSize
  - `integer`: totalItems
  - `integer`: totalPages
  - `array`: items
    - `object`: Question

**400 Bad Request:**
- `string`: error ("Invalid query parameters")

**401 Unauthorized:**
- `string`: error ("Missing or invalid authentication token")

**403 Forbidden:**
- `string`: error ("Admin privileges required")

**500 Internal Server Error:**
- `string`: error ("Internal server error")

---

### GET /admin/questions/{id}
Egy adott kérdés részletes lekérése.

**Headers:**
- `string`: Authorization (Bearer admin token, required)

**Path Parameters:**
- `string`: id (question ID)

**Responses:**

**200 OK:**
- `object`: Question

**401 Unauthorized:**
- `string`: error ("Missing or invalid authentication token")

**403 Forbidden:**
- `string`: error ("Admin privileges required")

**404 Not Found:**
- `string`: error ("Question not found")

**500 Internal Server Error:**
- `string`: error ("Internal server error")

---

### POST /admin/questions
Új kérdés létrehozása.

**Headers:**
- `string`: Authorization (Bearer admin token, required)

**Request Body:**
- `object`:
  - `string`: type
  - `string`: language
  - `string`: difficulty
  - `string`: title
  - `string`: questionText
  - `string` (optional): explanation
  - `array` (optional): tags
  - `object` (optional): metadata
    - `string` (optional): category
    - `string` (optional): topic
    - `string` (optional): source
  - `object` (optional): options (feleletválasztós kérdésekhez)
    - `array`:
      - `object`:
        - `string`: text
        - `boolean`: isCorrect

**Responses:**

**201 Created:**
- `object`: created Question

**400 Bad Request:**
- `string`: error ("Missing required fields or invalid structure")

**401 Unauthorized:**
- `string`: error ("Missing or invalid authentication token")

**403 Forbidden:**
- `string`: error ("Admin privileges required")

**409 Conflict:**
- `string`: error ("Duplicate question detected")

**500 Internal Server Error:**
- `string`: error ("Internal server error")

---

### PUT /admin/questions/{id}
Meglévő kérdés frissítése.

**Headers:**
- `string`: Authorization (Bearer admin token, required)

**Path Parameters:**
- `string`: id (question ID)

**Request Body (partial or full):**
- `object`:
  - `string` (optional): type
  - `string` (optional): language
  - `string` (optional): difficulty
  - `string` (optional): title
  - `string` (optional): questionText
  - `string` (optional): explanation
  - `array` (optional): tags
  - `object` (optional): metadata
  - `object` (optional): options

**Responses:**

**200 OK:**
- `object`: updated Question

**400 Bad Request:**
- `string`: error ("Invalid request body")

**401 Unauthorized:**
- `string`: error ("Missing or invalid authentication token")

**403 Forbidden:**
- `string`: error ("Admin privileges required")

**404 Not Found:**
- `string`: error ("Question not found")

**500 Internal Server Error:**
- `string`: error ("Internal server error")

---

### DELETE /admin/questions/{id}
Kérdés törlése.

**Headers:**
- `string`: Authorization (Bearer admin token, required)

**Path Parameters:**
- `string`: id (question ID)

**Responses:**

**204 No Content:**
- no content

**401 Unauthorized:**
- `string`: error ("Missing or invalid authentication token")

**403 Forbidden:**
- `string`: error ("Admin privileges required")

**404 Not Found:**
- `string`: error ("Question not found")

**409 Conflict:**
- `string`: error ("Cannot delete question currently referenced in active sessions")

**500 Internal Server Error:**
- `string`: error ("Internal server error")

**Question Schema:**
- `object`: Question
  - `string`: id
  - `string`: type ("multiple_choice", "code_completion", "true_false", etc.)
  - `string`: language
  - `string`: difficulty
  - `string`: title
  - `string`: questionText
  - `string` (optional): explanation
  - `array` (optional): tags
  - `object` (optional): metadata
    - `string` (optional): category
    - `string` (optional): topic
    - `string` (optional): source
  - `array` (optional): options
    - `object`:
      - `string`: text
      - `boolean`: isCorrect
  - `date`: createdAt
  - `date`: updatedAt
  - `boolean`: isActive

---

## Admin - Import/Export APIs

### POST /admin/questions/import
Kérdések tömeges importálása CSV vagy Aiken formátumból.

**Headers:**
- `string`: Authorization (Bearer admin token, required)
- `string`: Content-Type (multipart/form-data, required)

**Request (multipart/form-data):**
- `file`: file (required) - feltöltött CSV vagy Aiken fájl
- `string` (optional): format ("csv" | "aiken") - automatikus detektálás ha nincs megadva
- `boolean` (optional): async (default: false) - aszinkron feldolgozás ha true
- `integer` (optional): batchSize - rekordok száma batch-enként (default: 100)
- `boolean` (optional): validateOnly (default: false) - csak validálás, mentés nélkül

**Responses:**

**200 OK (szinkron validálás/import befejezve):**
- `object`: importReport
  - `string`: status ("completed" | "completed_with_errors")
  - `integer`: totalRows
  - `integer`: importedCount
  - `integer`: failedCount
  - `array`: errors (optional, jelen van ha failedCount > 0)
    - `string`: rowNumber
    - `string`: message (validációs vagy parsing hiba üzenet)
    - `string` (optional): field (problémás oszlop)
  - `array`: warnings (optional)
    - `string`: rowNumber
    - `string`: message
  - `array`: importedQuestions (optional, első N előnézete)
    - `string`: id
    - `string`: title
    - `string`: language
    - `string`: difficulty
  - `string` (optional): summary (pl. "90 questions imported successfully, 10 skipped")

**202 Accepted (aszinkron import elindítva):**
- `object`: importJob
  - `string`: jobId
  - `string`: status ("processing")
  - `string`: format ("csv" | "aiken")
  - `string`: uploadedBy (admin ID)
  - `integer` (optional): totalRows (becsült az első parsing után)
  - `date`: createdAt

**400 Bad Request:**
- `string`: error ("Invalid file format or missing file field")
- `string` (optional): details ("Only CSV and Aiken formats are supported")

**401 Unauthorized:**
- `string`: error ("Missing or invalid authentication token")

**403 Forbidden:**
- `string`: error ("Admin privileges required")

**413 Payload Too Large:**
- `string`: error ("Uploaded file too large")

**422 Unprocessable Entity:**
- `object`: validationReport (ha validateOnly = true)
  - `string`: status ("validation_failed")
  - `array`: errors
    - `string`: rowNumber
    - `string`: message
    - `string` (optional): field

**500 Internal Server Error:**
- `string`: error ("Internal server error during import process")

---

### GET /admin/questions/import/{jobId}/status
Import job állapotának lekérése.

**Headers:**
- `string`: Authorization (Bearer admin token, required)

**Path Parameters:**
- `string`: jobId

**Responses:**

**200 OK:**
- `object`: importJob
  - `string`: jobId
  - `string`: status ("queued" | "processing" | "completed" | "failed")
  - `integer` (optional): totalRows
  - `integer` (optional): processedRows
  - `float` (optional): progressPercentage
  - `string` (optional): format
  - `object` (optional): resultReport
    - `integer`: importedCount
    - `integer`: failedCount
    - `array`: errors (mint fent definiálva)
    - `string` (optional): summary
  - `date`: createdAt
  - `date`: updatedAt

**404 Not Found:**
- `string`: error ("Import job not found")

**500 Internal Server Error:**
- `string`: error ("Error retrieving import job status")

---

### GET /admin/questions/export
Kérdések exportálása különböző formátumokban.

**Headers:**
- `string`: Authorization (Bearer admin token, required)

**Query Parameters (optional):**
- `string` (optional): format ("csv" | "json" | "aiken") - default: "json"
- `string` (optional): language - szűrés nyelv szerint (pl. "Python")
- `string` (optional): difficulty - szűrés nehézség szerint ("easy", "medium", "hard")
- `string` (optional): type - szűrés kérdés típus szerint
- `date` (optional): fromDate - kérdések e dátum után létrehozva
- `date` (optional): toDate - kérdések e dátum előtt létrehozva
- `boolean` (optional): async (default: false) - ha true, export job létrehozása közvetlen letöltés helyett

**Responses:**

**200 OK (közvetlen letöltés):**
- binary file - inline letöltésként szolgálva (Content-Disposition: attachment)
- Header: Content-Type
  - application/json (JSON export)
  - text/csv (CSV export)
  - text/plain (Aiken formátum)

**202 Accepted (aszinkron export elindítva):**
- `object`: exportJob
  - `string`: jobId
  - `string`: status ("processing")
  - `string`: requestedBy (admin ID)
  - `string`: format
  - `integer`: totalItems (becsült, optional)
  - `string` (optional): downloadUrl (ha már generálva kisebb exportnál)
  - `date`: createdAt

**400 Bad Request:**
- `string`: error ("Invalid query parameters or unsupported export format")

**401 Unauthorized:**
- `string`: error ("Missing or invalid authentication token")

**403 Forbidden:**
- `string`: error ("Admin privileges required")

**500 Internal Server Error:**
- `string`: error ("Internal server error during export process")

---

### GET /admin/questions/export/{jobId}/status
Export job állapotának és letöltési link lekérése.

**Headers:**
- `string`: Authorization (Bearer admin token, required)

**Path Parameters:**
- `string`: jobId

**Responses:**

**200 OK:**
- `object`: exportJob
  - `string`: jobId
  - `string`: format
  - `string`: status ("queued" | "processing" | "completed" | "failed")
  - `integer` (optional): processedItems
  - `integer` (optional): totalItems
  - `float` (optional): progressPercentage
  - `string` (optional): downloadUrl (érvényes ha status = "completed")
  - `string` (optional): errorMessage (ha failed)
  - `date`: createdAt
  - `date`: updatedAt

**404 Not Found:**
- `string`: error ("Export job not found")

**401 Unauthorized:**
- `string`: error ("Missing or invalid authentication token")

**403 Forbidden:**
- `string`: error ("Admin privileges required")

**500 Internal Server Error:**
- `string`: error ("Internal server error")

---

## Megjegyzések

### Autentikáció
- Legtöbb endpoint JWT Bearer token autentikációt igényel
- Admin endpointok admin jogosultságot ellenőriznek
- Refresh token mechanizmus biztosított a token frissítéshez

### Hibakezelés
- Egységes hibaválasz formátum az összes endpointnál
- HTTP status kódok RESTful konvenciók szerint
- Részletes hibaüzenetek a debuggolás megkönnyítésére

### Lapozás
- Alapértelmezett lapméret: 20 elem
- Maximum lapméret: 100 elem
- Minden listázó endpoint támogatja a lapozást

### Aszinkron műveletek
- Nagy fájl import/export támogatás aszinkron feldolgozással
- Job ID alapú állapot lekérdezés
- Progress tracking az előrehaladás nyomon követésére


