# Practice Session User Flow

**Document Version:** 1.0
**Last Updated:** 2025-10-05
**Status:** Draft

## 1. Overview

Ez a dokumentum végigköveti a felhasználó útját egy CodeLingo Practice Session során:

- Session setup
- Kérdés prezentáció
- Válaszadás
- Azonnali feedback
- Előrehaladás mutatása
- Eredmény megjelenítése
- Hiba/leállás/újraindítás forgatókönyvek

***

## 2. High-Level Journey

```mermaid
flowchart TD
    A[Session indítás] --> B[Konfiguráció kiválasztása]
    B --> C[Session elindítása]
    C --> D[Kérdés megjelenítése]
    D --> E[Válaszadás]
    E --> F[Kiértékelés és feedback]
    F --> G{Vannak még kérdések}
    G -- igen --> D
    G -- nem --> H[Eredmények összegzése]
    H --> Z[Session lezárás, vissza a főoldalra]
```


***

## 3. Detailed Step-by-Step Flow

### 3.1. Session Setup

- **Konfiguráció:** nyelv, nehézség, kérdésszám beállítása
- **Session indítása**: API hívás, session azonosító visszakapása
- **Hiba:** helytelen beállítások – azonnali validáció, értesítés a felhasználónak

```mermaid
flowchart TD
    AA[Konfigurációs oldal]
    AA --> BB[Nyelv választás]
    BB --> CC[Nehézség választás]
    CC --> DD[Kérdésszám választás]
    DD --> EE[Session indító gomb]
    EE --> FF{Validáció sikeres}
    FF -- igen --> GG[Session indítása API]
    FF -- nem --> HH[Hibaüzenet megjelenítése]
```


### 3.2. Kérdés prezentáció \& válaszadás ciklus

- **Kérdés betöltése:** backend-ből, session állapot alapján
- **Kérdés típus:** MC vagy code completion
- **Válaszadás:** kliens validáció, submit
- **Azonnali feedback:** helyes vagy helytelen, magyarázat, pont
- **Továbblépés:** feedback után folytatás vagy session vége

```mermaid
flowchart TD
    A1[Kérdés betöltése]
    A1 --> A2[Típus szerinti megjelenítés]
    A2 --> A3[Válaszadás]
    A3 --> A4[Válasz validálás + submit]
    A4 --> A5[Backend kiértékel]
    A5 --> A6[Feedback mutatása]
    A6 --> B1{Session vége}
    B1 -- nem --> A1
    B1 -- igen --> C1[Eredmény oldal]
```


### 3.3. Eredmény és session lezárás

- **Eredmény aggregáció:** összpont, helyes válaszok, accuracy, új szint/achievement
- **Summary:** felhasználói chart, fejlesztési tippek
- **Navigáció:** új session/ főoldal felé visszairányítás lehetősége

```mermaid
flowchart TD
    X[Utolsó kérdés feedback]
    X --> Y[Eredmény összegzése]
    Y --> Y2[Statisztika megjelenítése]
    Y2 --> Z[Újra próbálkozás vagy vissza főoldalra]
```


***
