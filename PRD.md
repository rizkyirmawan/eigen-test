# Product Requirements Document (PRD)

## Project Overview

Build a library management system API and solve algorithmic challenges as part of a backend technical test.

---

## Test 1: Backend API — Library Management System

### Tech Stack

| Requirement | Choice |
|---|---|
| Framework | ExpressJS with TypeScript |
| API Documentation | Swagger (OpenAPI 3) via swagger-jsdoc |
| Database | MySQL via Prisma ORM |
| Validation | Zod |
| Testing | Vitest |
| Architecture | Domain-Driven Design (DDD) layered pattern |

### Entities

#### Member
- `code` (string, unique) — e.g. M001
- `name` (string)
- `penaltyUntil` (datetime, nullable) — penalty end date

#### Book
- `code` (string, unique) — e.g. JK-45
- `title` (string)
- `author` (string)
- `stock` (integer)
- `borrowedBy` (relation to Member, nullable)

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/books` | List all books with available quantities (excluding borrowed) |
| `GET` | `/members` | List all members with borrowed book count |
| `POST` | `/borrow` | Borrow a book |
| `POST` | `/return` | Return a borrowed book |

### Use Cases & Acceptance Criteria

#### UC-1: Borrow Book
- [ ] Member must exist
- [ ] Book must exist and have available stock
- [ ] Member must not have 2 or more borrowed books
- [ ] Member must not be currently penalized
- [ ] Book is marked as borrowed by the member

#### UC-2: Return Book
- [ ] The returned book must be borrowed by that member
- [ ] If returned after more than 7 days → apply 3-day penalty to member
- [ ] Book stock is restored

#### UC-3: Check Books
- [ ] Shows all existing books and quantities
- [ ] Books that are being borrowed are not counted

#### UC-4: Check Members
- [ ] Shows all existing members
- [ ] Shows the number of books being borrowed by each member

### Mock Data

#### Books
| Code | Title | Author | Stock |
|---|---|---|---|
| JK-45 | Harry Potter | J.K Rowling | 1 |
| SHR-1 | A Study in Scarlet | Arthur Conan Doyle | 1 |
| TW-11 | Twilight | Stephenie Meyer | 1 |
| HOB-83 | The Hobbit, or There and Back Again | J.R.R. Tolkien | 1 |
| NRN-7 | The Lion, the Witch and the Wardrobe | C.S. Lewis | 1 |

#### Members
| Code | Name |
|---|---|
| M001 | Angga |
| M002 | Ferry |
| M003 | Putri |

### Architecture (DDD Pattern)

```
test-1/src/
├── api/
│   ├── books/
│   │   ├── bookRouter.ts        # Route definitions
│   │   ├── bookController.ts    # Request/response handling
│   │   ├── bookService.ts       # Business logic
│   │   └── bookRepository.ts    # Data access (Prisma)
│   ├── members/
│   │   └── ... (same pattern)
│   └── borrow/
│       └── ... (same pattern)
├── api-docs/
│   └── swagger.ts               # OpenAPI setup
├── middleware/
│   ├── errorHandler.ts
│   └── requestLogger.ts
└── index.ts                     # Express app bootstrap
```

### Extras (Optional)
- [ ] Implement DDD Pattern
- [ ] Implement Unit Testing with Vitest

---

## Test 2: ALGORITMA

Solve 4 algorithm problems. Each solution is a standalone file in `test-2/`.

### Soal 1 — Reverse Alphabet with Number at End

**Problem:** Given string "NEGIE1", reverse the alphabet characters while keeping the number at the end.

**Example:**
```
Input:  "NEGIE1"
Output: "EIGEN1"
```

### Soal 2 — Longest Word in a Sentence

**Problem:** Find the longest word in a given sentence. If multiple words have the same length, pick any one.

**Example:**
```
Input:  "Saya sangat senang mengerjakan soal algoritma"
Output: "mengerjakan" (11 characters)
```

### Soal 3 — Count QUERY Occurrences in INPUT Array

**Problem:** Given an INPUT array and a QUERY array, count how many times each word in QUERY appears in INPUT.

**Example:**
```
INPUT  = ['xc', 'dz', 'bbb', 'dz']
QUERY  = ['bbb', 'ac', 'dz']
OUTPUT = [1, 0, 2]
```

### Soal 4 — Matrix Diagonal Difference

**Problem:** Calculate the difference between the sum of the primary diagonal and the sum of the secondary diagonal of an N×N matrix.

**Example:**
```
Matrix = [[1, 2, 0], [4, 5, 6], [7, 8, 9]]
Primary diagonal:   1 + 5 + 9 = 15
Secondary diagonal: 0 + 5 + 7 = 12
Result: 15 - 12 = 3
```

---

## Success Criteria

- [ ] PRD.md documents all requirements
- [ ] test-1/ contains a working ExpressJS + TypeScript API
- [ ] test-1/ includes Swagger documentation at `/api-docs`
- [ ] test-1/ uses Prisma with MySQL
- [ ] test-1/ implements all 4 use cases with correct logic
- [ ] test-1/ follows DDD layered architecture
- [ ] test-1/ includes unit tests
- [ ] test-2/ contains 4 correct algorithm solutions
- [ ] All code is open-sourced on GitHub
