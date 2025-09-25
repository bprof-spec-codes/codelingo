---
name: Backend Task
about: Create a backend development task
title: "[BACKEND] "
labels: ["type::backend", "area::api"]
assignees: ''
---

# [Backend Task Name]

## Description
[Detailed description of the API endpoints, business logic, or data structures to implement]

## Parent Feature
[Link to parent feature issue]

## Epic Label
[One of: epic::user-management, epic::practice-mode, epic::progression, epic::admin, epic::design]

## API Requirements
- [ ] Proper HTTP status codes returned
- [ ] Request/response models defined
- [ ] Input validation implemented
- [ ] Authentication/authorization implemented (if required)
- [ ] Error handling implemented
- [ ] Logging implemented
- [ ] API documentation updated

## Implementation Checklist
- [ ] Data models/entities created
- [ ] Database migrations written (if needed)
- [ ] Repository/service layer implemented
- [ ] Business logic implemented
- [ ] API controllers/endpoints created
- [ ] Request/response DTOs defined
- [ ] Validation attributes added
- [ ] Unit tests written
- [ ] Integration tests written

## Database Changes
- [ ] Entity models updated
- [ ] Database migration created
- [ ] Seed data updated (if needed)
- [ ] Foreign key relationships properly defined
- [ ] Indexes created for performance (if needed)

## Definition of Done
- [ ] All API endpoints implemented and working
- [ ] Business logic implemented and tested
- [ ] Database changes applied and tested
- [ ] Input validation working correctly
- [ ] Error handling implemented
- [ ] Authentication/authorization working (if applicable)
- [ ] Unit tests written and passing (>90% coverage)
- [ ] Integration tests written and passing
- [ ] Code follows C# coding standards
- [ ] Code reviewed by backend lead
- [ ] API documented (Swagger/OpenAPI)
- [ ] Manual testing via Postman/Swagger completed
- [ ] Performance testing completed (if applicable)

## API Endpoints
- [ ] `GET /api/[endpoint]` - [Description]
- [ ] `POST /api/[endpoint]` - [Description]
- [ ] `PUT /api/[endpoint]` - [Description]
- [ ] `DELETE /api/[endpoint]` - [Description]

## Data Model Changes
[Describe any new entities or changes to existing entities]

## Frontend Dependencies
[List which frontend components will consume these APIs]
