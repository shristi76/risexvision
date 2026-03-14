
---
# RISEXVISION – AI Powered Resume Analysis Platform

RISEXVISION is an AI-powered resume analysis platform that helps students and professionals improve their resumes and discover relevant career opportunities.

The platform analyzes uploaded resumes using AI, provides improvement suggestions, generates professional summaries, and recommends job, freelance, and open-source opportunities based on extracted skills.

---

## Features

* **AI Resume Analysis**
  Extracts skills, projects, and key information from uploaded resumes.

* **Resume Score**
  Provides a rating out of 10 with actionable suggestions for improvement.

* **Professional Summary Generator**
  Generates a concise 2-line professional summary for the top of the resume.

* **Skill Gap Analysis**
  Identifies missing skills compared to a target job description.

* **Live Job Recommendations**
  Suggests relevant job or internship opportunities based on resume skills.

* **Freelance Opportunities**
  Recommends freelance platforms where users can find relevant projects.

* **Open Source Contributions**
  Suggests open source repositories suitable for the user's skillset.

* **User Dashboard**
  Tracks resume analysis history and improvements.

---

## Tech Stack

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB Atlas

**Frontend**

* HTML
* CSS
* JavaScript

**AI Integration**

* Google Gemini API

**File Processing**

* Multer
* pdf-parse

**Authentication**

* Express Session
* bcryptjs

---

## Project Structure

```
risexvision
│
├── public
│   ├── css
│   │   └── style.css
│   ├── js
│   │   └── main.js
│   └── uploads
│
├── views
│   ├── index.html
│   ├── dashboard.html
│   └── results.html
│
├── models
│   ├── User.js
│   └── Resume.js
│
├── routes
│   ├── auth.js
│   └── resume.js
│
├── utils
│   ├── pdfParser.js
│   └── geminiHelper.js
│
├── .env
├── package.json
└── server.js
```

---
## DEMO
https://drive.google.com/file/d/19PCcnhIH5KmuxBlESU-QxhY6VBM_jGvm/view?usp=sharing

https://drive.google.com/file/d/1fov-bHHJK499JNHnXedFiGDukDCwU3Ga/view?usp=sharing

---

## TRY IN YOUR SYSTEM
## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/risexvision.git
cd risexvision
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory.

```
PORT=3000
MONGODB_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_gemini_api_key
SESSION_SECRET=your_session_secret
```

### 4. Start the Server

```bash
npm start
```

For development mode:

```bash
npm run dev
```

---

## Usage

1. Create an account or login.
2. Upload your resume in PDF format.
3. The platform analyzes your resume using AI.
4. View your resume score, suggestions, and generated summary.
5. Explore job opportunities, freelance platforms, and open-source projects based on your skills.

---

## Dependencies

```
express
mongoose
multer
pdf-parse
dotenv
express-session
axios
bcryptjs
connect-mongo
express-handlebars
nodemon
```

---

## Future Improvements

* ATS compatibility scoring
* Resume rewriting with AI
* Portfolio generator
* Advanced job matching system



