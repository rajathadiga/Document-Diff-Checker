"Document Difference Checker With AI Summary"

A react + express web app that allows users to compare two documents (paste text or upload .txt files) and 
generate an AI-powered summary highlighting the differences.

1. How to Install the dependencies:
--git clone <your-repo-url>
--cd <your-repo-folder>

--cd ../backend
--npm install

--cd ../frontend
--npm install

Create a .env file in the backend folder
--OPENROUTER_API_KEY=your_openrouter_api_key_here
--PORT=5000

2. How to run the app:
Start backend
--cd backend
--node server.js

Start frontend
--cd frontend
--npm start

3. AI Provider:
--Provider: OpenRouter (meta-llama/llama-3.1-8b-instruct)
--API Call: Backend sends a chat completion request to OpenRouter using your API key.

4. API key generation:
--Go to the OpenRouter website
--Click Sign Up and create a free account (or log in if you already have one).
--After logging in, go to your Dashboard and open Keys section.
--Click Create API Key
--Give it a name (like DocumentDiffApp) and select any default permissions.
--Copy the generated API key.

5. Environmental Variable instructions:
--backend/
  .env
  server.js

--Add your api key
OPENROUTER_API_KEY=your_openrouter_api_key_here
PORT=5000


6. Explaination of Technical Choices:
Frontend-
--React – Chosen for its component-based architecture, easy state management, and fast development for interactive UIs.
--Framer Motion – Provides smooth, professional animations for UI elements (buttons, cards, headers) without heavy custom CSS/JS.
--Axios – Simplifies HTTP requests to the backend API and handles JSON data easily.
--useState, useRef, useEffect – For managing form inputs, file uploads, and auto-scrolling to results.
--File Upload + Textarea – Allows both pasting text and uploading .txt files for flexibility.

Backend-
Express.js – Lightweight and fast backend framework, easy to set up REST API routes.
CORS – Enables frontend and backend to run on different ports during development.
dotenv – Safely stores sensitive API keys and configuration in environment variables.
diff library – Generates textual differences between Document A and Document B.
OpenRouter AI (LLaMA 3.1-8b) – Generates professional summaries using AI with instructions to highlight differences, grammar issues, and provide suggestions.
Async/Await + try/catch – Ensures reliable API calls with proper error handling.


8. Optional Features Added:
--Downloadable summary
--More advanced prompt structure
--Colored Difference