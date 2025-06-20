# Starcast App Setup Guide

Welcome to the **Starcast App**! This guide will help you set up the project from scratch.

---

## ✅ Prerequisites

### 1. Install Node.js (Recommended: **v22.16.0**)

- Download Node.js v22.16.0 (LTS or the specific version used in this project):

  [Download Node.js v22.16.0](https://nodejs.org/dist/v22.16.0/)

  > Choose: `node-v22.16.0-x64.msi` (for Windows 64-bit systems)

### 2. Install `pnpm`

```bash
npm install -g pnpm
```

### 3. Install Git

- [Download Git](https://git-scm.com/downloads)

---

## 🔧 Project Setup

### 4. Clone the Repository

```bash
git clone https://github.com/Varun-Puttagunta/starcast-private.git
cd starcast-private
```

### 5. Install Dependencies

```bash
pnpm install
```

---

## ⚙️ Environment Variables

### 6. Set up `.env` file

If you do not see a `.env` file in your project, you need to create one. The recommended way is to copy the provided `.env.example` file:

```bash
cp .env.example .env
```

If there is no `.env.example` file, you can create a new `.env` file manually in the project root and add the required environment variables as shown below.

Then, open `.env` and fill in your actual credentials:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# Google Auth (NextAuth)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Gemini AI API Key
GOOGLE_AI_API_KEY="your-google-ai-api-key"

# GeoDB Cities API
NEXT_PUBLIC_GEODB_API_KEY="your-geodb-api-key"
```

---

## 🔑 External API Setup

### 1. **Google Gemini AI API**
- Used for AI-powered event descriptions
- Set in: `GOOGLE_AI_API_KEY`

### 2. **Google Auth (NextAuth)**
- Set in: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

### 3. **GeoDB Cities API**
- Used for location autocomplete
- Set in: `NEXT_PUBLIC_GEODB_API_KEY`

---

## 🌍 Public APIs Used (No Key Needed)

- NASA EONET API – [https://eonet.gsfc.nasa.gov/api/v3/events](https://eonet.gsfc.nasa.gov/api/v3/events)
- ISS APIs – [http://api.open-notify.org/](http://api.open-notify.org/)
- Open-Meteo Weather – [https://api.open-meteo.com/v1](https://api.open-meteo.com/v1)
- Spaceflight News – [https://api.spaceflightnewsapi.net/v4/articles/](https://api.spaceflightnewsapi.net/v4/articles/)

---

## 🧱 Set Up the Database

### 7. Generate Prisma Client and Apply Migrations

```bash
pnpm exec prisma generate
pnpm exec prisma migrate deploy
```

---

### 8. Seed the Database

```bash
pnpm exec ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

> 💡 If there's a JSON error, make sure to wrap the argument **in double quotes**, and escape inner double quotes properly on Windows PowerShell:
```bash
pnpm exec ts-node --compiler-options "{\"module\":\"CommonJS\"}" prisma/seed.ts
```

---

## 🚀 Start the App

```bash
pnpm dev
```

Then open: [http://localhost:3000](http://localhost:3000)

---

## ✅ Done!

Your Starcast development environment is ready. Happy coding! 🚀
