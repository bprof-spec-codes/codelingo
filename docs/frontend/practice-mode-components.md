# Practice Mode Components Architecture

**Document Version:** 1.0  
**Last Updated:** 2025-10-04  
**Status:** Draft - Pending Approval

## Executive Summary

This document defines the complete component architecture for CodeLingo's practice mode functionality in Angular. It establishes component hierarchy, state management patterns using RxJS, data flow between components, and integration with backend APIs. The architecture follows Angular best practices including standalone components, smart/dumb component patterns, and reactive state management.

---

## Component Hierarchy

### Overview Diagram
```mermaid
graph TD
A[AppComponent] --> B[PracticeModeRoutingModule]
B --> C[PracticeStarterComponent]
B --> D[PracticeSessionComponent]
B --> E[PracticeResultsComponent]


C --> F[LanguageSelectorComponent]
C --> G[DifficultySelectorComponent]
C --> H[QuestionCountSelectorComponent]

D --> I[QuestionContainerComponent]
D --> J[SessionProgressComponent]

I --> K[MultipleChoiceQuestionComponent]
I --> L[CodeCompletionQuestionComponent]
I --> M[AnswerFeedbackComponent]

style A fill:#e1f5ff
style B fill:#fff3e0
style C fill:#f3e5f5
style D fill:#f3e5f5
style E fill:#f3e5f5
style F fill:#e8f5e9
style G fill:#e8f5e9
style H fill:#e8f5e9
style I fill:#fff9c4
style J fill:#fff9c4
style K fill:#ffe0b2
style L fill:#ffe0b2
style M fill:#ffe0b2
```

### Component Categories

| Category | Components | Responsibility |
|----------|-----------|----------------|
| **Container (Smart)** | PracticeStarterComponent, PracticeSessionComponent, PracticeResultsComponent | API integration, state management, routing |
| **Feature** | QuestionContainerComponent | Question cycle orchestration, answer submission |
| **Presentational (Dumb)** | LanguageSelectorComponent, DifficultySelectorComponent, QuestionCountSelectorComponent, MultipleChoiceQuestionComponent, CodeCompletionQuestionComponent | Display data, emit events, no business logic |
| **Utility** | SessionProgressComponent, AnswerFeedbackComponent | Progress display, feedback presentation |





### State Flow Diagram
```mermaid
stateDiagram-v2
[*] --> ConfiguringSession: User navigates to /practice/start


ConfiguringSession --> LoadingSession: Submit configuration
LoadingSession --> ActiveSession: StartSession API success
LoadingSession --> ConfiguringSession: API error

ActiveSession --> LoadingQuestion: Request next question
LoadingQuestion --> DisplayingQuestion: NextQuestion API success
LoadingQuestion --> SessionError: API error

DisplayingQuestion --> SubmittingAnswer: User submits answer
SubmittingAnswer --> DisplayingFeedback: SubmitAnswer API success
SubmittingAnswer --> DisplayingQuestion: API error

DisplayingFeedback --> LoadingQuestion: User clicks continue (hasMore = true)
DisplayingFeedback --> SessionCompleted: User clicks continue (hasMore = false)

SessionCompleted --> DisplayingResults: Navigate to results
DisplayingResults --> [*]: User exits or starts new session

SessionError --> [*]: User cancels
```

---

## Data Flow Patterns

### Component Communication Patterns

#### 1. Parent-Child Communication (Input/Output)

Used for presentational components communicating with containers:
```mermaid
sequenceDiagram
participant Parent as PracticeStarterComponent
participant Child as LanguageSelectorComponent


Parent->>Child: @Input() languages
Parent->>Child: @Input() selectedLanguage
Child->>Parent: @Output() languageChange
Parent->>Parent: Update configuration state
```

#### 2. Service-Mediated Communication (State Service)

Used for cross-component state sharing:
```mermaid
sequenceDiagram
participant Comp1 as QuestionContainerComponent
participant Service as PracticeSessionStateService
participant Comp2 as SessionProgressComponent


Comp1->>Service: setFeedback(feedback)
Service->>Service: Update BehaviorSubject
Service->>Comp2: questionState$ emits
Comp2->>Comp2: Update progress display
```

#### 3. API Service Pattern

Used for backend communication:
```mermaid
sequenceDiagram
participant Component as PracticeSessionComponent
participant APIService as PracticeSessionApiService
participant StateService as PracticeSessionStateService
participant Backend as Backend API


Component->>APIService: getNextQuestion(sessionId)
APIService->>Backend: GET /sessions/{id}/next
Backend-->>APIService: Question data
APIService->>StateService: updateQuestion(question)
StateService-->>Component: questionState$ emits
Component->>Component: Render question
```
