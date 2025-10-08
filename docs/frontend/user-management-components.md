# User Management Components Architecture

**Document Version:** 1.0  
**Last Updated:** 2025-10-07  
**Status:** Draft

## Executive Summary

This document outlines the Angular component architecture for user management functionality including login, registration, and profile management. It specifies component hierarchy, state management patterns (with JWT integration), form validation and error handling strategies, and reusable form and display components. The architecture follows Angular best practices with clean separation between container (smart) and presentational (dumb) components, reactive form patterns, and robust authentication state handling.

---

## Component Hierarchy

### Overview Diagram

```mermaid
graph LR
App[AppComponent] --> UM_Routing[UserManagementRoutingModule]
UM_Routing --> Login[LoginComponent]
UM_Routing --> Register[RegistrationComponent]
UM_Routing --> Profile[ProfileComponent]
UM_Routing --> EditProfile[EditProfileComponent]
Profile --> UserAvatar[UserAvatarComponent]
Profile --> UserDetailsCard[UserDetailsCardComponent]
EditProfile --> ProfileForm[ProfileFormComponent]
Register --> RegistrationForm[RegistrationFormComponent]
Login --> AuthForm[AuthFormComponent]
AuthForm --> TextInput[TextInputComponent]
AuthForm --> PasswordInput[PasswordInputComponent]
ProfileForm --> AvatarUploader[AvatarUploaderComponent]
ProfileForm --> AddressForm[AddressFormComponent]
style App fill:#e1f5ff
style UM_Routing fill:#fff3e0
style Login fill:#f3e5f5
style Register fill:#f3e5f5
style Profile fill:#f3e5f5
style EditProfile fill:#f3e5f5
style AuthForm fill:#fff9c4
style ProfileForm fill:#fff9c4
style TextInput fill:#e8f5e9
style PasswordInput fill:#e8f5e9
style UserDetailsCard fill:#ffe0b2
```

### Components Categorization and Responsibilities

| Category                  | Components                                                                                                                                                       | Responsibility                                                                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Container (Smart)**     | `LoginComponent`, `RegistrationComponent`, `ProfileComponent`, `EditProfileComponent`                                                                            | Handle routing, call services (AuthApi, UserApi), manage high-level state, orchestrate flows (e.g., on success navigate to dashboard) |
| **Feature**               | `AuthFormComponent`, `RegistrationFormComponent`, `ProfileFormComponent`                                                                                         | Compose reusable form fields, orchestrate validators, emit final payloads to parent                                                   |
| **Presentational (Dumb)** | `TextInputComponent`, `PasswordInputComponent`, `CheckboxComponent`, `SelectComponent`, `FormErrorsComponent`, `UserDetailsCardComponent`, `UserAvatarComponent`, `AvatarUploaderComponent` | Display data, emit events, no business logic                                                                                          |
| **Utility**               | `AuthService`, `AuthStateService`, `UserService`, `TokenService`, `ApiErrorInterceptor`, `AuthInterceptor`, `NotificationService`                                | API wrappers, token management, global error handling, notifications, auth guards                                                     |

---

## Form Validation Patterns

- All forms use **Angular Reactive Forms**.
- **Validation rules:**
  - **Login**: Required email and password, email format validation.
  - **Registration**: Required fields (username, email, password), password strength, confirm password match.
  - **Profile Edit**: Required fields validation with custom validators as needed.
- **Error feedback:**
  - Inline validation messages displayed via `FormErrorsComponent`.
  - Async validators show loading or uniqueness feedback dynamically.

---

## Error Handling

- Centralized error handling strategy via `ApiErrorInterceptor` and `NotificationService`.
- **Form errors:** Map server-side validation errors to corresponding form controls.
- **Global errors:** Network errors, authentication failures, or token issues surfaced through notifications.

---

## Authentication State Management & JWT Integration

```mermaid
stateDiagram-v2
[*] --> LoggedOut
LoggedOut --> LoggingIn : Submit credentials
LoggingIn --> LoggedIn : JWT issued
LoggingIn --> LoginError : Invalid credentials

LoggedIn --> RefreshingToken : Token nearing expiry
RefreshingToken --> LoggedIn : Token refreshed
RefreshingToken --> LoggedOut : Refresh failed

LoggedIn --> LoggedOut : User logout or token expired
LoginError --> LoggedOut : Retry login
```

- JWT stored securely in-memory or via HttpOnly cookies (avoid localStorage).
- `AuthStateService` exposes observables for authentication state and current user.
- **Route guards** enforce access control based on auth state.
- Token refresh occurs automatically before expiration, subscribers are updated on state changes.

---

## Reusable Form Components and User Data Display

### TextInputComponent / PasswordInputComponent

- Encapsulates input fields with labels, validation feedback, and event emission.
- Supports type-specific attributes (e.g., password show/hide toggle).

### CheckboxComponent / SelectComponent

- Standardized styling and accessibility.
- Emits value changes to parent form.

### FormErrorsComponent

- Displays validation messages for a given FormControl.
- Can show multiple messages contextually (sync and async errors).

### UserDetailsCardComponent / UserAvatarComponent

- Displays user profile information consistently.
- Supports integration with `ProfileFormComponent` for editing workflows.

---

## Data Flow and Component Communication Patterns

```mermaid
sequenceDiagram
participant LoginComp as LoginComponent
participant AuthForm as AuthFormComponent
participant AuthSvc as AuthService
participant TokenSvc as TokenService
participant Backend as BackendAPI

LoginComp ->> AuthForm: pass form submit event
AuthForm ->> AuthSvc: submitLogin(credentials)
AuthSvc ->> Backend: send login request
Backend -->> AuthSvc: return JWT + user data
AuthSvc ->> TokenSvc: save JWT
AuthSvc -->> LoginComp: emit auth success
LoginComp ->> Router: navigate to dashboard
```

- **Parent-child communication:**
  - Forms emit validated payloads to container components.
  - Containers handle orchestration, call services, and navigate on success.
- **Services** mediate API calls, token management, and authentication state.
- **Observables** propagate authentication and error states to interested components (e.g., navigation bar, profile header).
