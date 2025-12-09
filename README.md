# CodeLingo

- [Task Description](https://github.com/bprof-spec-codes/docs/blob/master/BPROF-2024/%C3%96LAB-2025-26-1/codelingo.md)
- [Code of Conduct](https://github.com/bprof-spec-codes/docs/blob/master/BPROF-2024/ÖLAB-2025-26-1/coc.md)
- [Requirements](https://github.com/bprof-spec-codes/docs/blob/master/BPROF-2024/ÖLAB-2025-26-1/requirements.md)

---

## 📌 Team
| Name                        | Role                | GitHub Profile |
|-----------------------------|---------------------|----------------|
| Tamás Tisza                 | Manager             | [TiszaTamas](https://github.com/TiszaTamas) |
| Bendegúz András Szczuka     | Architect           | [szczukabendeguz](https://github.com/szczukabendeguz) |
| Olivér Tolnai               | Frontend Developer  | [oli-tolnai](https://github.com/oli-tolnai) |
| Ádám József Prohászka       | Frontend Developer  | [adamprohaszka](https://github.com/adamprohaszka) |
| Bence Kóbori                | Frontend Developer  | [koboribence](https://github.com/koboribence) |
| Mihály Homonnai             | Backend Developer   | [misih26](https://github.com/misih26) |
| Máté Zsebeházi              | Backend Developer   | [MateZsebehazi](https://github.com/MateZsebehazi) |

---

## 📖 Developer Guide

- Tech stack: ASP.NET 8 backend, Angular frontend, Bootstrap UI.
- Branching: GitFlow (master, develop, feature/*, hotfix/*).
- Tasks: GitHub Projects board per sprint columns.
- Meetings: Weekly per coc.md.

### Local setup
- Prerequisites: .NET 8 SDK, Node.js LTS, Angular CLI.
- Backend:
  - Open solution: CodeLingo.sln
  - Run API: `dotnet run --launch-profile https`
- Frontend:
  - Open CodeLingo.Frontend
  - Install: `npm install`
  - Run: `ng serve -o`

---

## 🖥️ Usage

1. Start backend and frontend.
2. Backend default URL: http://localhost:7107 (Swagger enabled)
3. Frontend URL: http://localhost:4200

### User Features
- Register/login
- Practice answering questions
- Collect points and levels
- Profile page
- Admin panel

### Default Users
- Admin user
    - username: `admin` password: `Codelingo123!`

---

## 🔌 API Function List (excerpt)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/register` | POST | Register a new user |
| `/api/login` | POST | User login |
| `/api/logout` | POST | User logout |
| `/api/questions` | GET | Fetch list of questions |
| `/api/answer` | POST | Submit an answer |
| `/api/leaderboard` | GET | Fetch leaderboard |

---

## 🖼️ UI Screens (overview)
- **Login / Register** – user authentication  
- **Dashboard** – overview, shows level and score  
- **Practice mode** – solve questions and get feedback  
- **Leaderboard** – view ranking  

> **TODO:** add screenshots during the semester.

---

## 📝 Problem Log
This is where we track encountered problems and their solutions.  
The full list will be maintained in [Problems Log](./docs/PROBLEMS.md).  

### Example format
| Problem | Solution | Affected Area |
|---------|----------|---------------|
| Issue template was hard to understand | Created examples and filled-in templates | Scrum process |
| TODO 2 | TODO | Frontend |
| TODO 3 | TODO | Backend |
| TODO 4 | TODO | Architecture |
| TODO 5 | TODO | Mixed |
