# Starcast App

Welcome to the Starcast App! This guide will walk you through setting up the project from scratch, even if you've never installed Node.js or pnpm before.

---

## Prerequisites: Install Required Tools

### 1. Install Node.js (v18 or higher recommended)

Visit the [Node.js downloads page](https://nodejs.org/) and install the **LTS** version for your system.

Alternatively, using a terminal:

- **macOS (Homebrew):**
  ```sh
  brew install node
  ```

- **Ubuntu/Debian:**
  ```sh
  sudo apt update
  sudo apt install nodejs npm
  ```

- **Windows:**
  Download the installer from [nodejs.org](https://nodejs.org/) and run it.

---

### 2. Install pnpm

pnpm is a faster, more efficient alternative to npm.

```sh
npm install -g pnpm
```

> If you're using yarn instead, you can skip this and use yarn throughout instead of pnpm.

---

### 3. Install Git

Git is required to clone the project repository.

- **macOS (Homebrew):**
  ```sh
  brew install git
  ```

- **Ubuntu/Debian:**
  ```sh
  sudo apt update
  sudo apt install git
  ```

- **Windows:**
  Download from [git-scm.com](https://git-scm.com/) and follow the installer.

---

## Project Setup

### 4. Clone the Repository

```sh
git clone https://github.com/Varun-Puttagunta/starcast-private.git
cd starcast-private
```

---

### 5. Install Project Dependencies

```sh
pnpm install
# or
npm install
# or
yarn install
```

---

### 6. Set Up Environment Variables

Copy the `.env.example` file and fill in your keys and secrets.

```sh
cp .env.example .env
```

Example `.env` file:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# Google Auth (NextAuth)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Gemini AI API Key
GOOGLE_AI_API_KEY="your-google-ai-api-key"

# GeoDB Cities API (for location autocomplete)
NEXT_PUBLIC_GEODB_API_KEY="your-geodb-api-key"
```

---

### 🔑 API Keys & External Services Setup

Your project uses several external APIs. You'll need to set up the following keys in your `.env` file:

#### 1. **Google Gemini AI API**
- **Purpose:** Used for generating AI-powered event descriptions.
- **Env Variable:** `GOOGLE_AI_API_KEY`
- **Where Used:** `/app/api/generate-description/route.ts`
- **How to get:** [Google AI API documentation](https://ai.google.dev/)

#### 2. **Google Auth (NextAuth)**
- **Purpose:** Enables Google login for users.
- **Env Variables:**  
  - `GOOGLE_CLIENT_ID`  
  - `GOOGLE_CLIENT_SECRET`
- **Where Used:** `/lib/auth.ts`
- **How to get:** [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

#### 3. **GeoDB Cities API**
- **Purpose:** Location autocomplete and city data.
- **Env Variable:** `NEXT_PUBLIC_GEODB_API_KEY`
- **Where Used:** `/lib/api-config.ts`
- **How to get:** [RapidAPI GeoDB Cities](https://rapidapi.com/wirefreethought/api/geodb-cities/)

---

### 🌐 Public APIs (No Key Required)

These APIs are used but do **not** require a key:
- **NASA EONET API**: For natural event data (`https://eonet.gsfc.nasa.gov/api/v3/events`)
- **Open Notify ISS API**: For ISS position and crew (`http://api.open-notify.org/iss-now.json`, `http://api.open-notify.org/astros.json`)
- **Open-Meteo Weather API**: For weather data (`https://api.open-meteo.com/v1`)
- **Spaceflight News API**: For space news (`https://api.spaceflightnewsapi.net/v4/articles/`)

---

### 7. Set Up the Database

Run the following commands to generate the Prisma client and apply migrations:

```sh
pnpm exec prisma generate
pnpm exec prisma migrate deploy
```

---

### 8. Seed the Database

Run the seed script using a compatible `ts-node` setup:

```sh
pnpm exec ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

You should see:

```plaintext
Database has been seeded!
```

---

### 9. Start the Development Server

```sh
pnpm dev
# or
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✅ You're All Set!

Your development environment is now fully configured. No extra steps or manual fixes required.

---

Happy building! 🚀