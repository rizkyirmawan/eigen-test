# Backend Test Case

## Project Structure

```
eigen-test/
├── test-1/             # Library Management API
│   ├── prisma/
│   ├── src/
│   │   ├── api/books/
│   │   ├── api/members/
│   │   ├── api/borrow/
│   │   ├── api-docs/
│   │   └── middleware/
│   ├── package.json
│   └── tsconfig.json
└── test-2/             # ALGORITMA solutions
    ├── soal-1.js       # Reverse alphabet
    ├── soal-2.js       # Longest word
    ├── soal-3.js       # Count occurrences
    └── soal-4.js       # Matrix diagonal difference
```

---

## test-1 — Library Management API

### Tech Stack

- ExpressJS + TypeScript
- Prisma ORM + MySQL
- Swagger (OpenAPI 3) via swagger-jsdoc
- Zod validation
- Vitest testing
- DDD layered architecture (Router → Controller → Service → Repository)

### Getting Started

```bash
cd test-1
cp .env .env.local        # configure DATABASE_URL
npm install
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
npm run dev
```

Server runs at `http://localhost:3000`. API docs at `http://localhost:3000/api-docs`.

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/books` | List all books with available quantities |
| GET | `/members` | List all members with borrowed book count |
| POST | `/borrow` | Borrow a book |
| POST | `/borrow/return` | Return a borrowed book |

### Use Cases

- **Borrow**: max 2 books per member, book must be available, member not penalized
- **Return**: book must be borrowed by member, >7 days → 3-day penalty
- **Check books**: shows available stock (excludes borrowed)
- **Check members**: shows borrowed book count per member

---

## test-2 — ALGORITMA

Run each solution:

```bash
cd test-2
node soal-1.js    # "NEGIE1" → "EIGEN1"
node soal-2.js    # Longest word in sentence
node soal-3.js    # Count QUERY in INPUT
node soal-4.js    # Matrix diagonal difference
```

### Problems

1. **Reverse alphabet** — Reverse alphabet chars, keep trailing digits: `"NEGIE1"` → `"EIGEN1"`
2. **Longest word** — Find longest word in a sentence
3. **Count occurrences** — Count how many times each QUERY word appears in INPUT
4. **Matrix diagonal difference** — Sum of primary diagonal minus sum of secondary diagonal
