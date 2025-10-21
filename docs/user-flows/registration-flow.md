# User Registration Flow

**Document Version:** 1.0
**Last Updated:** 2025-10-12
**Status:** Draft


## Description
This document outlines the complete user registration and onboarding journey for **CodeLingo**.  
It maps the step-by-step process from initial signup to profile setup completion.
## Class Diagram
The diagram below shows the registration process including validation, submission, and auto-login:

```mermaid
flowchart TD
    A[User opens Registration Page] --> B[User fills in the form]
    B --> C{Is input valid?}
    C -- No --> D[Show error messages]
    D --> B
    C -- Yes --> E[Submit registration]
    E --> F{Registration successful?}
    F -- No --> G[Show submission error]
    G --> B
    F -- Yes --> H[Generate authentication token & userId & auto-login]
    H --> I[Redirect to welcome page]
```
## Performance & Security requirements
- Validation should be fast and smooth
- Password should be hashed
- Token based authentication with autologin (as we learned before)
- Defend against SQL injection 
- HTTPS
- Defend against bots (rate limiting? captcha?)
## Onboarding Experience
- later