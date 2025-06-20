# Starcast App

This is your personal project. Use this guide to set up and run the app on a new computer.

## Prerequisites
- Node.js (v18 or higher recommended)
- pnpm (or npm/yarn)
- Git

## Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Varun-Puttagunta/starcast-private.git
   cd starcast-private
   ```

2. **Install dependencies:**
   ```sh
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values.
   - If `.env.example` does not exist, create a `.env` file with the necessary environment variables for your app (API keys, database URLs, etc).

   Example `.env` variables:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"  # SQLite example, replace with your actual DB URL if different

   # Google Auth (NextAuth)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Google Gemini AI API Key
   GOOGLE_AI_API_KEY="your-google-ai-api-key"

   # GeoDB Cities API (for location autocomplete)
   NEXT_PUBLIC_GEODB_API_KEY="your-geodb-api-key"

   # (Optional) Add any other API keys or secrets below as needed
   # ANOTHER_API_KEY="your-api-key-here"
   ```

4. **Set up the database:**
   ```sh
   pnpm prisma migrate deploy
   # or
   npx prisma migrate deploy
   ```
   - To seed the database (if you have a seed script):
   ```sh
   pnpm prisma db seed
   # or
   npx prisma db seed
   ```

5. **Run the development server:**
   ```sh
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

6. **Open the app:**
   - Visit `http://localhost:3000` in your browser.

## Notes
- Make sure you have the correct environment variables set up for authentication, database, and any APIs you use.
- If you encounter issues, check your Node.js version and dependency installation.

---

Happy coding! 
