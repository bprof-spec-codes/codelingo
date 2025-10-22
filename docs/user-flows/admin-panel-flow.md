# Admin Panel User Flow

**Document Version:** 1.0
**Last Updated:** 2025-10-07
**Status:** Draft

---

## 1. Overview

This document outlines the user workflows within the Admin Panel, covering:

- Question Bank CRUD operations
- Bulk import with validation feedback
- Export functionality with filtering options

---

## 2. High-Level Journey

```mermaid
flowchart TD
    A["User Logged In (Admin Role)"] --> B["Home / Dashboard"]
    B --> C["Click 'Admin' in Navbar"]
    C --> D["/admin Page (Admin Panel Home)"]

    D --> E["Question Bank Management"]
    D --> F["Bulk Import / Export"]

    E --> E1["Create / Edit / Delete Questions"]
    F --> F1["Upload Import File + Validation"]
    F --> F2["Export with Filters + Download"]

```

## 3. Detailed Step-by-Step Flow

### 3.1. Question Bank CRUD Operations

- **List view with filters** (type, difficulty, category)
- **Create new question:** fill out form, perform validation
- **Edit:** modify existing question, save version
- **Delete:** confirmation prompt before deletion
- **Errors:** missing required fields, duplicate question, API error

```mermaid
flowchart TD
    QA[Question List Page] --> QB[Create New Question Button]
    QA --> QC[Edit Button]
    QA --> QD[Delete Button]

    QB --> QE[Fill Out Form]
    QC --> QE
    QE --> QF{Validation Successful?}
    QF -- no --> QG[Show Error Message]
    QF -- yes --> QH[Save Question via API]
    QH --> QI[Refresh List]
```

### 3.2. Import/Export

**Import:**

- Upload CSV or Aiken file
- Backend validation (fields, format, duplicates)
- Feedback report (successful / failed rows)

**Export:**

- Apply filters (e.g., category, difficulty, date)
- Start export (CSV or Aiken format)
- Generate downloadable file

```mermaid
flowchart TD
    IM[Import Page] --> UP[Select and Upload File]
    UP --> VAL{Validation Successful?}
    VAL -- no --> ERR[Display List of Invalid Rows]
    VAL -- yes --> OK[Save Data to Database]
    OK --> DONE[Show Success Message]

    EX[Export Page] --> FILT[Set Filters]
    FILT --> GEN[Start Export]
    GEN --> DL[Download File]
```