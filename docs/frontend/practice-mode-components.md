# Practice Mode Components Architecture

**Document Version:** 1.0  
**Last Updated:** 2025-10-04  
**Status:** Draft - Pending Approval

## Executive Summary

This document defines the complete component architecture for CodeLingo's practice mode functionality in Angular. It establishes component hierarchy, state management patterns using RxJS, data flow between components, and integration with backend APIs. The architecture follows Angular best practices including standalone components, smart/dumb component patterns, and reactive state management.

---

## Table of Contents

1. [Component Hierarchy](#component-hierarchy)
2. [Component Catalog](#component-catalog)
3. [State Management Architecture](#state-management-architecture)
4. [Data Flow Patterns](#data-flow-patterns)
5. [API Integration](#api-integration)
6. [Routing Strategy](#routing-strategy)
7. [Error Handling](#error-handling)
8. [Performance Optimization](#performance-optimization)
9. [Testing Strategy](#testing-strategy)
10. [Implementation Guidelines](#implementation-guidelines)

---

## Component Hierarchy

### Overview Diagram

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


### Component Categories

| Category | Components | Responsibility |
|----------|-----------|----------------|
| **Container (Smart)** | PracticeStarterComponent, PracticeSessionComponent, PracticeResultsComponent | API integration, state management, routing |
| **Feature** | QuestionContainerComponent | Question cycle orchestration, answer submission |
| **Presentational (Dumb)** | LanguageSelectorComponent, DifficultySelectorComponent, QuestionCountSelectorComponent, MultipleChoiceQuestionComponent, CodeCompletionQuestionComponent | Display data, emit events, no business logic |
| **Utility** | SessionProgressComponent, AnswerFeedbackComponent | Progress display, feedback presentation |

---

## Component Catalog

### 1. PracticeStarterComponent (Container)

**Type:** Smart Component (Container)  
**Purpose:** Session configuration and initialization  
**Selector:** `app-practice-starter`  
**Route:** `/practice/start`

#### Responsibilities
- Render session configuration form
- Validate user input for language, difficulty, and question count
- Call StartSession API with configuration parameters
- Handle API errors and display user feedback
- Navigate to session on successful creation

#### Inputs
None (top-level container)

#### Outputs
- `sessionStarted: EventEmitter<string>` - Emits sessionId on successful start

#### State Management
interface PracticeStarterState {
loading: boolean;
error: string | null;
configuration: SessionConfiguration | null;
}

interface SessionConfiguration {
language: string;
difficulty: 'easy' | 'medium' | 'hard';
desiredCount: number;
}



#### API Integration
- `POST /sessions/start` - Create new practice session

#### Child Components
- `LanguageSelectorComponent`
- `DifficultySelectorComponent`
- `QuestionCountSelectorComponent`

---

### 2. LanguageSelectorComponent (Presentational)

**Type:** Dumb Component  
**Purpose:** Programming language selection  
**Selector:** `app-language-selector`

#### Responsibilities
- Display available programming languages
- Emit selection changes to parent
- Handle disabled state
- Show validation errors

#### Inputs
@Input() languages: string[]; // Available languages
@Input() selectedLanguage: string | null;
@Input() disabled: boolean = false;
@Input() error: string | null = null;



#### Outputs
@Output() languageChange = new EventEmitter<string>();



#### UI Specification
- Dropdown select with search capability
- Visual indicators for selected state
- Error message display below selector
- Default placeholder: "Select a programming language"

---

### 3. DifficultySelectorComponent (Presentational)

**Type:** Dumb Component  
**Purpose:** Difficulty level selection  
**Selector:** `app-difficulty-selector`

#### Responsibilities
- Display difficulty options (easy, medium, hard)
- Emit selection changes to parent
- Show tooltips with difficulty descriptions
- Handle disabled state

#### Inputs
@Input() selectedDifficulty: 'easy' | 'medium' | 'hard' | null;
@Input() disabled: boolean = false;



#### Outputs
@Output() difficultyChange = new EventEmitter<'easy' | 'medium' | 'hard'>();



#### UI Specification
- Radio button group or segmented control
- Tooltips explaining each difficulty level
- Visual distinction for selected option
- Icons representing difficulty levels

---

### 4. QuestionCountSelectorComponent (Presentational)

**Type:** Dumb Component  
**Purpose:** Question count selection  
**Selector:** `app-question-count-selector`

#### Responsibilities
- Display preset question count options
- Allow custom numeric input
- Validate count within min/max range
- Emit count changes to parent

#### Inputs
@Input() selectedCount: number | null;
@Input() minCount: number = 5;
@Input() maxCount: number = 50;
@Input() presets: number[] = ;
@Input() disabled: boolean = false;
@Input() error: string | null = null;



#### Outputs
@Output() countChange = new EventEmitter<number>();



#### UI Specification
- Preset buttons for common counts
- Custom number input field
- Range validation with error messages
- Visual feedback for selection

---

### 5. PracticeSessionComponent (Container)

**Type:** Smart Component (Container)  
**Purpose:** Active practice session management  
**Selector:** `app-practice-session`  
**Route:** `/practice/session/:sessionId`

#### Responsibilities
- Load session data from route parameter
- Orchestrate question-answer cycle
- Manage session state (current question, progress, score)
- Handle session completion detection
- Navigate to results on completion

#### Inputs
None (retrieves sessionId from route)

#### State Management
interface PracticeSessionState {
sessionId: string;
currentQuestion: Question | null;
sessionProgress: SessionProgress;
loading: boolean;
error: string | null;
isCompleted: boolean;
}

interface SessionProgress {
currentIndex: number;
totalQuestions: number;
currentScore: number;
}



#### API Integration
- `GET /sessions/{id}/next` - Retrieve next question
- `POST /sessions/{id}/answer` - Submit answer

#### Child Components
- `QuestionContainerComponent`
- `SessionProgressComponent`

---

### 6. QuestionContainerComponent (Feature)

**Type:** Feature Component  
**Purpose:** Question display and answer submission orchestration  
**Selector:** `app-question-container`

#### Responsibilities
- Dynamically render question based on type (MC or Code)
- Handle answer submission
- Display feedback after submission
- Manage question state (unanswered, answered, feedback)

#### Inputs
@Input() question: Question;
@Input() sessionId: string;
@Input() canSubmit: boolean = true;



#### Outputs
@Output() answerSubmitted = new EventEmitter<SubmitAnswerPayload>();
@Output() nextQuestion = new EventEmitter<void>();



#### State Management
interface QuestionState {
questionData: Question;
userAnswer: string | string[] | null;
feedback: AnswerFeedback | null;
submitting: boolean;
answered: boolean;
}



#### Child Components
- `MultipleChoiceQuestionComponent` (conditional)
- `CodeCompletionQuestionComponent` (conditional)
- `AnswerFeedbackComponent` (conditional - shown after answer)

---

### 7. MultipleChoiceQuestionComponent (Presentational)

**Type:** Dumb Component  
**Purpose:** Multiple choice question display  
**Selector:** `app-multiple-choice-question`

#### Responsibilities
- Display question text and answer options
- Handle option selection
- Emit selected answer to parent
- Disable interaction after submission

#### Inputs
@Input() question: MultipleChoiceQuestion;
@Input() disabled: boolean = false;
@Input() selectedAnswer: string | null = null;



#### Outputs
@Output() answerSelected = new EventEmitter<string>();



#### UI Specification
- Radio buttons for single selection
- Clear visual hierarchy for question and options
- Disabled state styling after submission
- Keyboard navigation support

---

### 8. CodeCompletionQuestionComponent (Presentational)

**Type:** Dumb Component  
**Purpose:** Code completion question display  
**Selector:** `app-code-completion-question`

#### Responsibilities
- Display question text and code context
- Provide code editor for user input
- Syntax highlighting for programming language
- Emit code answer to parent

#### Inputs
@Input() question: CodeCompletionQuestion;
@Input() disabled: boolean = false;
@Input() userCode: string | null = null;



#### Outputs
@Output() codeChanged = new EventEmitter<string>();



#### UI Specification
- Code editor integration (Monaco Editor or CodeMirror)
- Syntax highlighting based on question language
- Line numbers and code formatting
- Disabled state for post-submission

#### Dependencies
- Monaco Editor or CodeMirror library
- Language-specific syntax definitions

---

### 9. SessionProgressComponent (Utility)

**Type:** Dumb Component  
**Purpose:** Session progress display  
**Selector:** `app-session-progress`

#### Responsibilities
- Display current question index and total
- Show current score
- Render progress bar
- Update in real-time

#### Inputs
@Input() currentIndex: number;
@Input() totalQuestions: number;
@Input() currentScore: number;



#### Outputs
None (display only)

#### UI Specification
- Progress bar showing completion percentage
- Question counter: "Question X of Y"
- Score display: "Score: XXX points"
- Responsive layout for mobile

---

### 10. AnswerFeedbackComponent (Utility)

**Type:** Dumb Component  
**Purpose:** Answer evaluation feedback display  
**Selector:** `app-answer-feedback`

#### Responsibilities
- Display correctness indicator (correct/incorrect)
- Show explanation text
- Display score change
- Provide "Continue" button

#### Inputs
@Input() feedback: AnswerFeedback;

interface AnswerFeedback {
correct: boolean;
explanation: string;
pointsEarned: number;
currentScore: number;
}



#### Outputs
@Output() continue = new EventEmitter<void>();



#### UI Specification
- Success/error color scheme based on correctness
- Clear explanation text with formatting
- Score animation on points change
- Prominent "Continue" button

---

### 11. PracticeResultsComponent (Container)

**Type:** Smart Component (Container)  
**Purpose:** Session results display  
**Selector:** `app-practice-results`  
**Route:** `/practice/results/:sessionId`

#### Responsibilities
- Retrieve session results from API
- Display comprehensive performance summary
- Show question-level breakdown
- Provide navigation to start new session or return to dashboard

#### Inputs
None (retrieves sessionId from route)

#### State Management
interface PracticeResultsState {
sessionId: string;
results: SessionResults | null;
loading: boolean;
error: string | null;
}

interface SessionResults {
totalScore: number;
totalQuestions: number;
correctAnswers: number;
accuracy: number;
breakdown: QuestionResult[];
}



#### API Integration
- `GET /sessions/{id}/results` - Retrieve session results

---

## State Management Architecture

### State Management Strategy

CodeLingo practice mode uses **Service-based state management with RxJS** following Angular best practices. This approach:
- Leverages Angular's built-in dependency injection
- Uses RxJS BehaviorSubjects for reactive state
- Avoids over-engineering with external state libraries (NgRx) for this scale
- Provides clear data flow and testability

### State Service: PracticeSessionStateService

@Injectable()
export class PracticeSessionStateService {
// Private state subjects
private sessionState = new BehaviorSubject<PracticeSessionState>(initialState);
private questionState = new BehaviorSubject<QuestionState | null>(null);

// Public observables
readonly sessionState$ = this.sessionState.asObservable();
readonly questionState$ = this.questionState.asObservable();

// Computed observables
readonly isSessionCompleted$ = this.sessionState$.pipe(
map(state => state.isCompleted)
);

readonly currentProgress$ = this.sessionState$.pipe(
map(state => state.sessionProgress)
);

// State update methods
updateSession(updates: Partial<PracticeSessionState>): void {
this.sessionState.next({
...this.sessionState.value,
...updates
});
}

updateQuestion(question: Question): void {
this.questionState.next({
questionData: question,
userAnswer: null,
feedback: null,
submitting: false,
answered: false
});
}

setFeedback(feedback: AnswerFeedback): void {
const current = this.questionState.value;
if (current) {
this.questionState.next({
...current,
feedback,
answered: true,
submitting: false
});
}
}

reset(): void {
this.sessionState.next(initialState);
this.questionState.next(null);
}
}



### State Flow Diagram

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


---

## Data Flow Patterns

### Component Communication Patterns

#### 1. Parent-Child Communication (Input/Output)

Used for presentational components communicating with containers:

sequenceDiagram
participant Parent as PracticeStarterComponent
participant Child as LanguageSelectorComponent


Parent->>Child: @Input() languages
Parent->>Child: @Input() selectedLanguage
Child->>Parent: @Output() languageChange
Parent->>Parent: Update configuration state


#### 2. Service-Mediated Communication (State Service)

Used for cross-component state sharing:

sequenceDiagram
participant Comp1 as QuestionContainerComponent
participant Service as PracticeSessionStateService
participant Comp2 as SessionProgressComponent


Comp1->>Service: setFeedback(feedback)
Service->>Service: Update BehaviorSubject
Service->>Comp2: questionState$ emits
Comp2->>Comp2: Update progress display


#### 3. API Service Pattern

Used for backend communication:

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


### Data Flow Principles

1. **Unidirectional Data Flow**: Data flows from parent to child via Inputs, events flow from child to parent via Outputs
2. **Immutable State Updates**: Always create new state objects, never mutate existing state
3. **Smart/Dumb Component Separation**: Smart components handle logic and API calls, dumb components handle presentation
4. **Reactive Subscriptions**: Use `async` pipe in templates to automatically manage subscriptions
5. **OnPush Change Detection**: Use OnPush strategy with immutable data for performance

---

## API Integration

### API Service: PracticeSessionApiService

@Injectable({
providedIn: 'root'
})
export class PracticeSessionApiService {
private readonly baseUrl = '/api/sessions';

constructor(
private http: HttpClient,
private errorHandler: ApiErrorHandlerService
) {}

startSession(config: SessionConfiguration): Observable<StartSessionResponse> {
return this.http.post<StartSessionResponse>(${this.baseUrl}/start, config).pipe(
catchError(this.errorHandler.handleError)
);
}

getNextQuestion(sessionId: string): Observable<NextQuestionResponse> {
return this.http.get<NextQuestionResponse>(${this.baseUrl}/${sessionId}/next).pipe(
catchError(this.errorHandler.handleError)
);
}

submitAnswer(sessionId: string, payload: SubmitAnswerPayload): Observable<SubmitAnswerResponse> {
return this.http.post<SubmitAnswerResponse>(
${this.baseUrl}/${sessionId}/answer,
payload
).pipe(
catchError(this.errorHandler.handleError)
);
}

getResults(sessionId: string): Observable<SessionResults> {
return this.http.get<SessionResults>(${this.baseUrl}/${sessionId}/results).pipe(
catchError(this.errorHandler.handleError)
);
}
}



### API Request/Response Interfaces

// StartSession
interface SessionConfiguration {
language: string;
difficulty: 'easy' | 'medium' | 'hard';
desiredCount: number;
}

interface StartSessionResponse {
sessionId: string;
totalPlanned: number;
}

// NextQuestion
interface NextQuestionResponse {
question?: Question;
completed: boolean;
progress: {
currentIndex: number;
totalQuestions: number;
};
}

// SubmitAnswer
interface SubmitAnswerPayload {
answer: string | string[];
idempotencyKey: string;
}

interface SubmitAnswerResponse {
correct: boolean;
explanation: string;
pointsEarned: number;
currentScore: number;
hasMore: boolean;
}

// Results
interface SessionResults {
totalScore: number;
totalQuestions: number;
correctAnswers: number;
accuracy: number;
breakdown: QuestionResult[];
}



---

## Routing Strategy

### Route Configuration

const routes: Routes = [
{
path: 'practice',
children: [
{
path: 'start',
component: PracticeStarterComponent,
canActivate: [AuthGuard],
title: 'Start Practice Session'
},
{
path: 'session/:sessionId',
component: PracticeSessionComponent,
canActivate: [AuthGuard, SessionGuard],
canDeactivate: [UnsavedChangesGuard],
title: 'Practice Session'
},
{
path: 'results/:sessionId',
component: PracticeResultsComponent,
canActivate: [AuthGuard],
title: 'Session Results'
},
{
path: '',
redirectTo: 'start',
pathMatch: 'full'
}
]
}
];



### Route Guards

#### SessionGuard
Validates session existence and ownership before allowing access:

@Injectable()
export class SessionGuard implements CanActivate {
canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
const sessionId = route.paramMap.get('sessionId');
return this.sessionService.validateSession(sessionId).pipe(
map(() => true),
catchError(() => {
this.router.navigate(['/practice/start']);
return of(false);
})
);
}
}



#### UnsavedChangesGuard
Prevents navigation away from active session without confirmation:

@Injectable()
export class UnsavedChangesGuard implements CanDeactivate<PracticeSessionComponent> {
canDeactivate(component: PracticeSessionComponent): Observable<boolean> | boolean {
if (component.hasUnsavedProgress()) {
return this.dialogService.confirm({
title: 'Leave Session?',
message: 'Your progress will be lost. Are you sure?'
});
}
return true;
}
}



---

## Error Handling

### Error Handling Strategy

graph LR
A[Component] -->|API Call| B[API Service]
B -->|HTTP Error| C[ErrorHandlerService]
C -->|User-Friendly Message| D[Component]
C -->|Log to Console| E[Logger]
C -->|Track Error| F[Analytics]
D -->|Display| G[User Interface]



### Error Handler Service

@Injectable({
providedIn: 'root'
})
export class ApiErrorHandlerService {
constructor(
private snackBar: MatSnackBar,
private logger: LoggerService
) {}

handleError = (error: HttpErrorResponse): Observable<never> => {
let userMessage = 'An unexpected error occurred. Please try again.';


if (error.status === 0) {
  userMessage = 'Network error. Please check your connection.';
} else if (error.status === 401) {
  userMessage = 'Session expired. Please log in again.';
} else if (error.status === 404) {
  userMessage = 'Session not found. Please start a new practice session.';
} else if (error.status >= 500) {
  userMessage = 'Server error. Please try again later.';
} else if (error.error?.message) {
  userMessage = error.error.message;
}

this.snackBar.open(userMessage, 'Close', { duration: 5000 });
this.logger.error('API Error', error);

return throwError(() => new Error(userMessage));
};
}



### Error States in Components

Each component should handle error states gracefully:

interface ComponentState {
loading: boolean;
error: string | null;
data: any | null;
}



---

## Performance Optimization

### Optimization Strategies

#### 1. OnPush Change Detection

Use `ChangeDetectionStrategy.OnPush` for all presentational components:

@Component({
selector: 'app-multiple-choice-question',
changeDetection: ChangeDetectionStrategy.OnPush,
template: ...
})
export class MultipleChoiceQuestionComponent {
// Component uses immutable inputs
}



#### 2. TrackBy Functions

Use trackBy for lists to optimize rendering:

trackByQuestionId(index: number, question: Question): string {
return question.id;
}



#### 3. Lazy Loading

Practice mode module is lazy loaded:

const routes: Routes = [
{
path: 'practice',
loadChildren: () => import('./practice-mode/practice-mode.module')
.then(m => m.PracticeModeModule)
}
];



#### 4. Async Pipe

Always use async pipe in templates to manage subscriptions:

<div *ngIf="sessionState$ | async as state"> <app-session-progress [currentIndex]="state.sessionProgress.currentIndex" [totalQuestions]="state.sessionProgress.totalQuestions"> </app-session-progress> </div> ```
5. Code Editor Lazy Loading
Load Monaco Editor only when code question is displayed:


async loadCodeEditor(): Promise<void> {
  if (!this.editorLoaded) {
    await import('monaco-editor');
    this.editorLoaded = true;
  }
}
Testing Strategy
Unit Testing
Smart Components
Mock API services and state services

Test component logic and state management

Verify navigation behavior


describe('PracticeSessionComponent', () => {
  let component: PracticeSessionComponent;
  let apiService: jasmine.SpyObj<PracticeSessionApiService>;
  let router: jasmine.SpyObj<Router>;
  
  beforeEach(() => {
    apiService = jasmine.createSpyObj('PracticeSessionApiService', ['getNextQuestion']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    
    component = new PracticeSessionComponent(apiService, router);
  });
  
  it('should navigate to results when session is completed', () => {
    // Test implementation
  });
});
Dumb Components
Test input/output behavior

Verify template rendering with different inputs

Test user interactions


describe('LanguageSelectorComponent', () => {
  it('should emit languageChange when selection changes', () => {
    const component = new LanguageSelectorComponent();
    let emittedLanguage: string;
    
    component.languageChange.subscribe(lang => emittedLanguage = lang);
    component.onSelectionChange('csharp');
    
    expect(emittedLanguage).toBe('csharp');
  });
});
Integration Testing
Test component interactions and data flow:


describe('Question Interaction Flow', () => {
  it('should submit answer and display feedback', fakeAsync(() => {
    // Test implementation with TestBed
  }));
});
E2E Testing
Test complete user journeys:


describe('Practice Session E2E', () => {
  it('should complete full practice session flow', () => {
    cy.visit('/practice/start');
    cy.get('[data-cy=language-selector]').select('csharp');
    cy.get('[data-cy=difficulty-easy]').click();
    cy.get('[data-cy=count-10]').click();
    cy.get('[data-cy=start-button]').click();
    
    // Continue with question answering flow
  });
});
Implementation Guidelines
Component Implementation Checklist
 Use standalone components (Angular 14+)

 Implement OnPush change detection for presentational components

 Use async pipe for observable subscriptions

 Define clear TypeScript interfaces for all data structures

 Add proper error handling for all API calls

 Implement loading states for async operations

 Add accessibility attributes (ARIA labels, keyboard navigation)

 Follow Angular style guide naming conventions

 Write unit tests with >80% coverage

 Document complex logic with code comments

File Structure

src/app/practice-mode/
├── components/
│   ├── practice-starter/
│   │   ├── practice-starter.component.ts
│   │   ├── practice-starter.component.html
│   │   ├── practice-starter.component.scss
│   │   └── practice-starter.component.spec.ts
│   ├── practice-session/
│   │   └── ...
│   ├── question-container/
│   │   └── ...
│   └── shared/
│       ├── language-selector/
│       ├── difficulty-selector/
│       └── question-count-selector/
├── services/
│   ├── practice-session-api.service.ts
│   ├── practice-session-state.service.ts
│   └── api-error-handler.service.ts
├── models/
│   ├── session-configuration.model.ts
│   ├── question.model.ts
│   └── session-results.model.ts
├── guards/
│   ├── session.guard.ts
│   └── unsaved-changes.guard.ts
└── practice-mode-routing.module.ts
Code Style Guidelines
Component Naming

// Container components
PracticeStarterComponent
PracticeSessionComponent
PracticeResultsComponent

// Presentational components
LanguageSelectorComponent
MultipleChoiceQuestionComponent
Service Naming

// API services
PracticeSessionApiService

// State services
PracticeSessionStateService

// Utility services
ApiErrorHandlerService
Interface Naming

// Request/Response interfaces
SessionConfiguration
StartSessionResponse
SubmitAnswerPayload

// State interfaces
PracticeSessionState
QuestionState
Accessibility Requirements
 Semantic HTML elements (<nav>, <main>, <section>)

 ARIA labels for interactive elements

 Keyboard navigation support (Tab, Enter, Space)

 Focus management for dynamic content

 Screen reader announcements for state changes

 Color contrast ratios meeting WCAG AA standards

 Form validation messages accessible to screen readers

Security Considerations
Client-Side Security
Input Sanitization: Sanitize all user inputs before display

XSS Prevention: Use Angular's built-in sanitization

Session Validation: Verify session ownership before operations

Token Management: Store JWT tokens securely in HttpOnly cookies

HTTPS Only: Ensure all API calls use HTTPS in production

API Security
Authentication: All API calls include JWT bearer token

Authorization: Verify user owns the session being accessed

Idempotency Keys: Use unique keys for answer submissions

Rate Limiting: Respect API rate limits on client side

Responsive Design Breakpoints
Follow spacing system breakpoints:

Breakpoint	Min Width	Layout Adjustments
Mobile	0-767px	Single column, stacked components
Tablet	768-1023px	Two column where appropriate
Desktop	1024px+	Full layout with sidebars
Component-Specific Responsive Behavior
PracticeStarterComponent: Form stacks vertically on mobile

QuestionContainerComponent: Code editor full-width on mobile

SessionProgressComponent: Compact mode on mobile with collapsed details

MultipleChoiceQuestionComponent: Options stack vertically on mobile

Dependencies
Required NPM Packages

{
  "dependencies": {
    "@angular/core": "^17.0.0",
    "@angular/common": "^17.0.0",
    "@angular/router": "^17.0.0",
    "@angular/forms": "^17.0.0",
    "rxjs": "^7.8.0",
    "monaco-editor": "^0.44.0"
  },
  "devDependencies": {
    "@angular/cli": "^17.0.0",
    "jasmine-core": "^5.0.0",
    "karma": "^6.4.0",
    "cypress": "^13.0.0"
  }
}
External Libraries
Monaco Editor: For code completion question editing

Angular Material (optional): For UI components if not using custom design system

Migration Path from Current State
If migrating from existing implementation:

Phase 1: Create new standalone components alongside existing

Phase 2: Implement state service and migrate one component at a time

Phase 3: Update routing to use new components

Phase 4: Remove old components and clean up

Future Enhancements
Planned Features
Real-time Collaboration: Multiple users practicing together

Hint System: Progressive hints for difficult questions

Bookmarking: Save questions for later review

Time Tracking: Track time spent on each question

Question Difficulty Adaptation: Adjust difficulty based on performance

Technical Debt to Address
Implement comprehensive error boundary component

Add offline support with service workers

Optimize bundle size with tree shaking

Add performance monitoring with Core Web Vitals

Implement A/B testing infrastructure

Stakeholder Sign-off
Required Approvals
 Tech Lead - Architecture Review

 Product Owner - Feature Completeness

 UX Designer - Component Specifications

 Frontend Lead - Code Standards Compliance

 Security Team - Security Requirements

Appendix A: Component Communication Matrix
From Component	To Component	Method	Data
PracticeStarterComponent	LanguageSelectorComponent	@Input	Available languages
LanguageSelectorComponent	PracticeStarterComponent	@Output	Selected language
PracticeSessionComponent	QuestionContainerComponent	@Input	Current question
QuestionContainerComponent	PracticeSessionComponent	@Output	Answer submission
QuestionContainerComponent	MultipleChoiceQuestionComponent	@Input	Question data
MultipleChoiceQuestionComponent	QuestionContainerComponent	@Output	Selected answer
Appendix B: State Transition Examples
Example 1: Starting a Session

// Initial state
{
  loading: false,
  error: null,
  configuration: null
}

// After API call
{
  loading: true,
  error: null,
  configuration: { language: 'csharp', difficulty: 'medium', desiredCount: 10 }
}

// After success
{
  loading: false,
  error: null,
  configuration: { language: 'csharp', difficulty: 'medium', desiredCount: 10 }
  // Navigate to session
}
Example 2: Submitting an Answer

// Before submission
{
  questionData: { id: 'q1', type: 'mc', ... },
  userAnswer: 'A',
  feedback: null,
  submitting: false,
  answered: false
}

// During submission
{
  questionData: { id: 'q1', type: 'mc', ... },
  userAnswer: 'A',
  feedback: null,
  submitting: true,
  answered: false
}

// After feedback received
{
  questionData: { id: 'q1', type: 'mc', ... },
  userAnswer: 'A',
  feedback: { correct: true, explanation: '...', pointsEarned: 10 },
  submitting: false,
  answered: true
}