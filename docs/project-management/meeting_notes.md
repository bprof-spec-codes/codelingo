# Meeting Notes – Week 1, Meeting 1

**Dátum:** [első meeting időpontja]  
**Résztvevők:** Tisza Tamás, Tolnai Olivér, Homonnai Mihály, Kóbori Bence, Zsebeházi Máté, Szczuka Bendegúz András, Prohászka Ádám József  

---

## Megbeszélt témák

### Meetingek időpontja
- Vita a meetingek időpontjáról (tanórák után, vs. este).  
- Végül: kéthetente szerda este 19:00-től, plusz heti vasárnapi meeting. Szept. 21.-i vasárnap 20:00-tól

### Repo és Git
- Bendegúz vasárnapra feltölt egy üres **Angular** és **.NET backend** projektet egy végponttal, hogy a kapcsolat látszódjon.  
- Következő szerda: alap API leírás demó verzióval.  

### API és architektúra
- Frontendnek meg kell határozni, milyen adatokat vár el.  
- Backend az alapján készíti el a végpontokat.  
- Cél: vasárnapra szöveges API leírás, szerdára működő demó API.  

### User Storyk és Epicek
- Tamás (PO) vasárnapra előkészíti az összes epicet és user storyt.  
- Ezeket közösen átnézik, majd szerdán szakosítás és sprint planning.  
- Scrum Poker: mindenki szavaz complexity pontra, közös nevezőre kell jutni.  

### Frontend feladatok
- Vasárnapra minden frontend fejlesztő hozzon **design ötleteket** (pl. mockup, wireframe).  
- Lehet Figma vagy más eszköz.  
- Színek, arculat, alap layout kitalálása.  
- Tamás dönt véglegesen, de csapat hozza az ötleteket.  

### Backend feladatok
- Backend csapat vasárnapra tervezze át gondolatban az architektúrát.  
- Írják össze, mi könnyű, mi nehéz feladat lesz.  

### GitHub Board és PR folyamat
- Tamás kezeli a GitHub boardot és a Kanban-t.  
- Pull requestek kezelésénél:
  - Legalább 3 reviewer szükséges (Architect + PO + 1 csapattag).  
  - Automatizálás lehetőségeit Tamás megnézi.  

---

## Következő lépések / „házi feladat”
- **Mindenki:** alaposan olvassa át a feladatleírást.  
- **Frontend:** hozzon design- és layout ötleteket (mockup/wireframe).  
- **Backend:** gondolja át az architektúrát, könnyű/nehezebb részeket.  
- **Tamás (PO):** epic-ek és user story-k előkészítése vasárnapra.  
- **Bendegúz:** repo inicializálása Angular + .NET projekttel, alap végponttal.  
- **Következő meeting (vasárnap):**  
  - API igények átbeszélése  
  - Design irányok tisztázása  
  - User storyk közös review  


---

# Meeting Notes – Week 2, Meeting 2

**Dátum:** 2025-09-21 (Vasárnap)  
**Résztvevők:** Tisza Tamás, Szczuka Bendegúz András, Kóbori Bence, Tolnai Olivér, Prohászka Ádám József, Homonnai Mihály, Zsebeházi Máté  

---
## 1. Állapot összefoglaló
- Epicek: PO definiálta (User management, Practice mode, Leveling & Progression, Leaderboard, Administration).
- User Story-k: elkészültek, feltöltés a GitHub Project boardra meeting után.
- Repo inicializálás (Angular + .NET + egy demó endpoint): halasztva SZERDÁRA (Architect).
- Frontend: első design mockup (landing + profile) bemutatva (Bence) – tetszik, még nem végleges színek.
- API-spec (frontend oldalról váz): elkészült (Ádám), review folyamat elindul.
- Sprint 1 cél: nagyon alap működés (end-to-end “practice” flow minimalizmus), nem kell még teljes dizájn, nem kell auth.

## 2. Board / Workflow döntések
- GitHub Project státuszok első verzió: Backlog → (Sprint 1) → In Progress → (opcionális: Testing) → Done.
- Testing oszlop: még kérdéses; valószínűleg elhagyható az első sprintben.
- Sub-issue / breakdown szabály igény: PO készít egy rövid “belső policy” leírást:
  - Mikor hozzunk létre külön issue-t?
    - Ha több ember érintett VAGY több kérdés felmerült VAGY önállóan review-zható.
  - Epic → User Story → Issue (feladat) → (opcionális) Sub-issue.
- Automatizálások (workflow) későbbre: backlog-ba automatikus besorolás új issue-nál (nem “No status”-ba).

## 3. Technikai irányok
- Architektúra első demó: egy egyszerű GET (feladat lekérés) + POST (megoldás beküldés) endpoint (Practice Mode proof-of-concept).
- Branch stratégia (terv):
  - main (stabil)  
  - develop (sprint fejlesztési integráció)  
  - feature/#xy-short-branch-name-with-dashes
  - bugfix/#xy-short-branch-name-with-dashes
  - Pull Request: develop-ba, min. 3 review (Architect + PO + 1 fejlesztő).
- Sprint végén: develop → main merge (jóváhagyással).

## 4. Frontend design irány
- Desktop-first megközelítés (könnyebb fejlesztés + célcsoport gépen tanul).
- Reszponzivitás: biztosítani kell működőképességet mobilon (áttekinthető, nem széteső), de nem “pixel-perfect” mobil optimalizáció.
- Javaslat: landing page-en jelzés: “Best experience on desktop”.
- Duolingo mint referencia: egyszerű, tiszta layout – animációk későbbi sprintekben.

## 5. Nyelvi döntés
- Projekt artefaktumok (issue-k, epicek, kód, dokumentáció): ANGOL (bemutathatóság, CV érték).
- Meeting jegyzőkönyvek maradhatnak magyarul (belső használat).

## 6. Következő mérföldkő: Szerda (Sprint Planning / Refinement)
Tervezett témák:
1. Epicek + User Story-k final review.
2. Breakdown: első sprint issue-k létrehozása (Practice Mode fókusz).
3. Story Point becslés (Scrum Poker).
4. Branch policy + PR template (ha szükséges).
5. API demó (ha elkészül addigra).
6. Belső “issue creation / breakdown guideline” jóváhagyása.

## 7. Akciópontok (Owner / Határidő: Szerda)
- PO (Tamás): User Story-k publikálása Project boardra.
- PO: “Issue / Sub-issue létrehozási szabályok” rövid markdown (policy).
- Architect (Bendegúz): Repo inicializálás + minimal backend (GET/POST demo).
- Architect: Javaslat a PR / branch naming konvencióra.
- Ádám: API-spec finomítás Bendegúz visszajelzése alapján (ha szükséges).
- Frontend (Bence + többiek): Mockup(ok) finomítása – navigáció, színpaletta alternatívák.
- Mindenki: Handout (user story / workflow) link átolvasása (Bendegúz által küldött anyag).
- Mindenki: Git branching modell megértése (kérdések szerdára).
- Mindenki: Első sprint scope ötletek feljegyzése (Practice Mode minimál end-to-end).

## 8. Kockázatok / Figyelendő
- Auth csúsztatása: figyelni, hogy később ne blokkoljon más funkciót.
- Túl sok apró issue ne keverje a boardot (policy sürgős).
- Design ne vigye el az időt működő flow elől (Sprint 1 fókusz: működés > esztétika).

## 9. Rövid összefoglaló
Alap backlog és epicek készülnek, sprint előkészítés szerdán. Technikai gerinc: egyszerű practice feladat lekérés + válasz beküldés. Frontend desktop-first. Folyamatok (branch, issue policy) formalizálása most indul.

## 10. Hivatkozások
- https://szfmv2024-tavasz.github.io/handout/workflow.html
