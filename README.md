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

## 6. ⚙️ Environment Variables

## 🔐 `.env` File Setup

Create a `.env` file in the root of your project and paste the following:

```env
# Database (using SQLite for local development)
DATABASE_URL="file:./prisma/dev.db"

# Google Authentication (NextAuth)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Gemini AI API (for event descriptions)
GOOGLE_AI_API_KEY="your-google-ai-api-key"

# GeoDB Cities API (for location autocomplete)
NEXT_PUBLIC_GEODB_API_KEY="your-geodb-api-key"
```

✅ You can use **free temporary keys** from this shared doc:  
📄 [API Key Reference – Google Doc](https://docs.google.com/document/d/19UkUfK3J0V_GbnQpnZdpSNCMAIAAvhT-9VJ2mW-ml2E/edit?usp=sharing)

⚠️ Make sure your `.env` file is **not committed** to Git (add it to `.gitignore`).

---

## 🌐 Public APIs Used

| API                    | Purpose                            | Environment Variable(s)                        |
|------------------------|------------------------------------|------------------------------------------------|
| **Google Gemini AI**   | AI-generated content (descriptions) | `GOOGLE_AI_API_KEY`                            |
| **Google Auth**        | User login with OAuth              | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`     |
| **GeoDB Cities API**   | Location autocomplete              | `NEXT_PUBLIC_GEODB_API_KEY`                    |

---

## 🔑 (Optional) Generate Your Own API Keys

If you prefer not to use the temporary keys, here’s how you can create your own:

### 1. **Google Gemini AI API Key**
- Go to: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- Sign in with a Google account
- Click “Create API Key”
- Copy it into your `.env` as:
  ```env
  GOOGLE_AI_API_KEY="your-api-key"
  ```

### 2. **Google OAuth Credentials (NextAuth)**
- Go to: [https://console.cloud.google.com/](https://console.cloud.google.com/)
- Create a new project or select an existing one
- Navigate to **APIs & Services → Credentials**
- Click **"Create Credentials" → OAuth Client ID**
- Choose **"Web Application"**
- Add `http://localhost:3000` to Authorized Redirect URIs (for local dev)
- Copy the `Client ID` and `Client Secret`:
  ```env
  GOOGLE_CLIENT_ID="your-client-id"
  GOOGLE_CLIENT_SECRET="your-client-secret"
  ```

### 3. **GeoDB Cities API Key**
- Go to: [https://rapidapi.com/wirefreethought/api/geodb-cities](https://rapidapi.com/wirefreethought/api/geodb-cities)
- Click “Subscribe” (free tier is fine)
- Copy your API key from the “X-RapidAPI-Key” header
- Paste it into `.env` as:
  ```env
  NEXT_PUBLIC_GEODB_API_KEY="your-api-key"
  ```



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

Note: You might see error at bottem left saying "window not defined" ignore this as I was in the process of adding other features but ran out of time.
