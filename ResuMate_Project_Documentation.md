# ResuMate - AI-Powered Career & Skill Intelligence Platform
## Complete Project Documentation

---

## 📋 Project Overview

**ResuMate** is an intelligent career development platform that combines LinkedIn functionality, resume analysis, skill gap detection, and AI-powered job matching. Users upload their resumes and receive personalized career insights, skill recommendations, and tailored job suggestions.

**Core Tagline:** "Resume Elevated" - Empowering professionals with AI-driven career intelligence.

---

## 🎯 Key Features

### 1. **Resume Upload & Analysis**
- Drag-and-drop resume uploader (PDF/DOCX)
- Intelligent parsing using AI
- Skill extraction and categorization
- Experience timeline visualization
- Education and certification tracking

### 2. **Skill Gap Analysis**
- Compare user skills with job requirements
- Visual skill radar charts
- Proficiency level assessment
- Personalized learning recommendations
- Skill trending insights

### 3. **AI Job Matcher**
- Search jobs by title, industry, location, experience level
- Match resumes against job descriptions
- Match score percentage with breakdown
- Detailed recommendations to improve match
- Job description analysis

### 4. **Resume Optimizer**
- Section-by-section improvement suggestions
- AI-powered rewriting for each job role
- Keyword optimization for ATS
- Formatting best practices
- Download optimized resume versions

### 5. **AI Career Assistant Chat**
- Real-time chat with Llama 3 70B via Groq
- Career advice and guidance
- Resume improvement tips
- Interview preparation
- Skill development strategies
- Context-aware responses based on uploaded resume

### 6. **Dashboard & Analytics**
- Profile completion percentage
- Skill distribution charts
- Job match history
- Resume improvement progress
- Career statistics

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                         │
│  React.js + React Router + Redux + Tailwind + Material UI   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Dashboard   │  │   Analyzer   │  │  Job Matcher │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Resume      │  │  Chat        │  │  Profile     │       │
│  │  Optimizer   │  │  Assistant   │  │  Settings    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                    API Layer (Axios)                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│              BACKEND (Node.js + Express)                     │
│                  (Can be deployed on Vercel)                │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Auth Routes │  │  Resume API  │  │  Job API     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Chat Routes │  │  Analysis    │  │  Groq API    │       │
│  │              │  │  Engine      │  │  Integration │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  DATABASE: MongoDB (Cloud - Atlas)                           │
│  ├─ Users Collection                                         │
│  ├─ Resumes Collection                                       │
│  ├─ Job Matches Collection                                   │
│  ├─ Chat History Collection                                  │
│  └─ Skills Library Collection                                │
│                                                               │
│  CACHE: Redis (Optional - for performance)                   │
│  EXTERNAL APIs:                                              │
│  ├─ Groq API (Llama 3 70B)                                    │
│  └─ File Storage (AWS S3 or Vercel Blob)                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 User Flow Diagram

```
1. LANDING PAGE
   └─> CTA: "Upload Resume & Get Started"

2. AUTHENTICATION
   ├─> Sign Up / Sign In
   └─> Create Account (Email, Password, Basic Info)

3. RESUME UPLOAD
   ├─> Drag & Drop or File Browser
   ├─> Parse & Extract Data (Groq API)
   ├─> Show Parsing Status
   └─> Display Extracted Information

4. PROFILE SETUP
   ├─> Review Extracted Data
   ├─> Manual Corrections
   ├─> Add Additional Information
   └─> Save to Database

5. MAIN DASHBOARD
   ├─> Profile Completion Score
   ├─> Skills Overview (Radar Chart)
   ├─> Quick Stats
   ├─> Recent Activity
   └─> Navigation Menu

6. SKILL ANALYSIS
   ├─> Display All Skills (Categorized)
   ├─> Proficiency Levels
   ├─> Skill Gap Analysis
   ├─> Learning Recommendations
   └─> Trending Skills

7. JOB MATCHING
   ├─> Search Jobs (by keyword, location, etc.)
   ├─> Upload/Paste Job Description
   ├─> AI Analysis:
   │   ├─ Extract Requirements
   │   ├─ Compare with Resume
   │   ├─ Calculate Match Score
   │   ├─ Identify Skill Gaps
   │   └─ Generate Recommendations
   ├─> Display Results with:
   │   ├─ Match Percentage
   │   ├─ Matching Skills
   │   ├─ Missing Skills
   │   ├─ Resume Optimization Tips
   │   └─ Learning Path Suggestions
   └─> Save to Job Matches

8. RESUME OPTIMIZER
   ├─> Select Target Job
   ├─> AI Rewrites:
   │   ├─ Summary/Objective
   │   ├─ Experience Descriptions
   │   ├─ Skills Section
   │   └─ Keywords for ATS
   ├─> Preview Changes
   ├─> Accept/Reject Suggestions
   ├─> Download Optimized Resume
   └─> Compare Versions

9. CAREER ASSISTANT CHAT
   ├─> Real-time Chat Interface
   ├─> Context-aware Responses:
   │   ├─ Based on User's Resume
   │   ├─ Based on Target Job
   │   └─ Based on Conversation History
   ├─> Chat Features:
   │   ├─ Message History
   │   ├─ Clear Chat
   │   ├─ Export Conversation
   │   └─ Copy Responses
   └─> Chat Topics:
       ├─ Career Advice
       ├─ Resume Tips
       ├─ Interview Prep
       ├─ Skill Development
       └─ Industry Insights

10. PROFILE & SETTINGS
    ├─> View Profile
    ├─> Manage Resumes
    ├─> Privacy Settings
    ├─> Notification Preferences
    ├─> Account Management
    └─> Logout

```

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React.js 18+
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **Styling:** Tailwind CSS + Material UI
- **Form Handling:** React Hook Form
- **HTTP Client:** Axios
- **Charts:** Recharts
- **UI Components:** Shadcn/ui (optional for advanced components)
- **File Upload:** React Dropzone
- **PDF Parsing:** PDF.js or pdfparse
- **Icons:** React Icons / Heroicons

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose ODM
- **Authentication:** JWT + bcrypt
- **File Upload:** Multer + Vercel Blob Storage
- **Validation:** Zod
- **Logging:** Morgan
- **CORS:** cors middleware
- **Environment:** dotenv

### External Services
- **LLM & AI:** Groq API (Llama 3 70B)
- **File Storage:** Vercel Blob or AWS S3
- **Database:** MongoDB Atlas (Cloud)
- **Deployment:** Vercel (Frontend + Backend)

### Optional Enhancements
- **Caching:** Redis (for job matches, analyzed resumes)
- **Rate Limiting:** express-rate-limit
- **Security:** helmet, express-validator
- **Real-time Updates:** Socket.io (for future features)

---

## 📁 Project Structure

```
ResuMate/
├── .env.local                    # Environment variables
├── .gitignore
├── package.json
├── vercel.json                   # Vercel deployment config
│
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       ├── logo.svg
│       └── illustrations/
│
├── src/
│   ├── index.js
│   ├── App.jsx
│   ├── index.css
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Layout.jsx
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── forms/
│   │   │   ├── ResumeUploadForm.jsx
│   │   │   └── JobSearchForm.jsx
│   │   └── cards/
│   │       ├── SkillCard.jsx
│   │       ├── JobCard.jsx
│   │       └── StatsCard.jsx
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── AuthPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── AnalyzerPage.jsx
│   │   ├── JobMatcherPage.jsx
│   │   ├── ResumeOptimizerPage.jsx
│   │   ├── ChatPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── NotFoundPage.jsx
│   │
│   ├── redux/
│   │   ├── store.js
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── resumeSlice.js
│   │   │   ├── jobSlice.js
│   │   │   ├── chatSlice.js
│   │   │   └── uiSlice.js
│   │   └── middleware/
│   │
│   ├── services/
│   │   ├── api.js                # Axios instance & config
│   │   ├── auth.service.js
│   │   ├── resume.service.js
│   │   ├── job.service.js
│   │   ├── chat.service.js
│   │   └── groq.service.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── localStorage.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useResume.js
│   │   ├── useChat.js
│   │   └── useFetch.js
│   │
│   ├── styles/
│   │   ├── tailwind.config.js
│   │   └── globals.css
│   │
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── animations/
│
├── api/                          # Backend (Vercel Serverless)
│   ├── index.js                  # or app.js
│   ├── auth.js
│   ├── resume.js
│   ├── jobs.js
│   ├── chat.js
│   ├── analysis.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Resume.js
│   │   ├── JobMatch.js
│   │   ├── ChatMessage.js
│   │   └── Skill.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── resumeController.js
│   │   ├── jobController.js
│   │   ├── chatController.js
│   │   └── analysisController.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── validation.js
│   │   └── fileUpload.js
│   │
│   ├── services/
│   │   ├── groq.service.js       # Groq API integration
│   │   ├── resume.parser.js      # Resume parsing logic
│   │   ├── job.matcher.js        # Job matching logic
│   │   └── ai.analyzer.js        # AI analysis logic
│   │
│   ├── utils/
│   │   ├── db.js                 # MongoDB connection
│   │   ├── validators.js
│   │   └── helpers.js
│   │
│   └── config/
│       └── constants.js
│
└── docs/
    ├── API_DOCUMENTATION.md
    ├── SETUP_GUIDE.md
    └── DEPLOYMENT_GUIDE.md
```

---

## 🔐 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  profilePhoto: String,
  bio: String,
  location: String,
  linkedinUrl: String,
  portfolioUrl: String,
  createdAt: Date,
  updatedAt: Date,
  isVerified: Boolean,
  subscriptionTier: String (free/pro/enterprise)
}
```

### Resumes Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  fileName: String,
  fileUrl: String,
  fileType: String (pdf/docx),
  isPrimary: Boolean,
  
  extractedData: {
    summary: String,
    experience: [{
      jobTitle: String,
      company: String,
      startDate: Date,
      endDate: Date,
      description: String,
      responsibilities: [String]
    }],
    education: [{
      institution: String,
      degree: String,
      field: String,
      graduationDate: Date
    }],
    skills: [{
      name: String,
      category: String,
      proficiency: String (beginner/intermediate/advanced/expert),
      yearsOfExperience: Number,
      endorsements: Number
    }],
    certifications: [{
      name: String,
      issuingOrganization: String,
      issueDate: Date,
      expiryDate: Date
    }]
  },
  
  parsedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Job Matches Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  resumeId: ObjectId (ref: Resume),
  jobTitle: String,
  jobDescription: String,
  jobSource: String (manual/api),
  
  analysis: {
    matchScore: Number (0-100),
    matchPercentage: Number,
    
    matchedSkills: [{
      skill: String,
      userLevel: String,
      requiredLevel: String,
      match: Boolean
    }],
    
    missingSkills: [{
      skill: String,
      category: String,
      priority: String (high/medium/low)
    }],
    
    recommendations: [String],
    resumeOptimizationTips: [String],
    learningPath: [{
      skill: String,
      resources: [String],
      estimatedTime: String
    }],
    
    analysis: String // Groq API response
  },
  
  savedAt: Date,
  matchedAt: Date,
  createdAt: Date
}
```

### Chat Messages Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  resumeId: ObjectId (ref: Resume), // context
  jobMatchId: ObjectId (ref: JobMatch), // optional context
  
  messages: [{
    role: String (user/assistant),
    content: String,
    timestamp: Date,
    tokens: {
      prompt: Number,
      completion: Number
    }
  }],
  
  context: {
    type: String (general/resume-focused/job-focused),
    relatedData: Object
  },
  
  createdAt: Date,
  updatedAt: Date,
  expiresAt: Date (TTL: 30 days)
}
```

### Skills Library Collection
```javascript
{
  _id: ObjectId,
  skillName: String (unique),
  category: String (technical/soft/languages/etc),
  description: String,
  relatedSkills: [String],
  industryTags: [String],
  difficulty: String (beginner/intermediate/advanced),
  resources: [{
    name: String,
    url: String,
    type: String (course/tutorial/documentation)
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
GET    /api/auth/me
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### Resume Management
```
POST   /api/resume/upload
GET    /api/resume/list
GET    /api/resume/:id
PUT    /api/resume/:id
DELETE /api/resume/:id
POST   /api/resume/:id/parse
POST   /api/resume/:id/optimize
GET    /api/resume/:id/analysis
```

### Job Matching
```
POST   /api/jobs/analyze
POST   /api/jobs/match
GET    /api/jobs/matches
GET    /api/jobs/matches/:id
DELETE /api/jobs/matches/:id
POST   /api/jobs/search
```

### Chat/Assistant
```
POST   /api/chat/message
GET    /api/chat/history
DELETE /api/chat/history
POST   /api/chat/export
```

### Analysis
```
POST   /api/analysis/skill-gap
GET    /api/analysis/recommendations
POST   /api/analysis/learning-path
```

### User Profile
```
GET    /api/user/profile
PUT    /api/user/profile
GET    /api/user/settings
PUT    /api/user/settings
DELETE /api/user/account
```

---

## 🤖 Groq API Integration Details

### Resume Parsing Prompt
```
Analyze the following resume text and extract structured information:

RESUME TEXT:
[resume_text]

Please extract and return ONLY valid JSON with the following structure:
{
  "summary": "Professional summary",
  "experience": [
    {
      "jobTitle": "...",
      "company": "...",
      "duration": "...",
      "description": "..."
    }
  ],
  "education": [
    {
      "institution": "...",
      "degree": "...",
      "field": "...",
      "year": "..."
    }
  ],
  "skills": [
    {
      "name": "...",
      "category": "...",
      "proficiency": "..."
    }
  ],
  "certifications": []
}

Return ONLY the JSON object, no other text.
```

### Job Matching Prompt
```
You are an expert career advisor and resume analyst. Analyze the resume and job description provided.

RESUME SUMMARY:
[resume_data]

JOB DESCRIPTION:
[job_description]

Provide a comprehensive analysis in JSON format with:
{
  "matchScore": 0-100,
  "matchedSkills": [
    {
      "skill": "...",
      "level": "match/partial/missing",
      "importance": "high/medium/low"
    }
  ],
  "missingSkills": ["..."],
  "keyRecommendations": [
    "Specific, actionable advice to improve match"
  ],
  "resumeOptimizations": [
    "Specific changes to make in the resume"
  ],
  "learningPath": [
    {
      "skill": "...",
      "estimatedWeeks": number,
      "resources": ["online course", "book", "tutorial"]
    }
  ],
  "summary": "Paragraph summary of analysis"
}

Return ONLY valid JSON.
```

### Career Assistant Prompt
```
You are an expert career coach and AI assistant. Help users with career advice, resume optimization, interview preparation, and skill development.

User Resume Context:
[resume_data]

Current Conversation:
[chat_history]

User Message: [user_message]

Provide helpful, specific, and actionable advice. If discussing a specific job, reference relevant skills and experience from their resume. Keep responses concise but comprehensive. Use markdown formatting for better readability.
```

---

## 🎨 UI/UX Enhancements & Free Features

### Premium Free Features
1. **Resume Upload & Parsing** (1 resume free, unlimited for premium)
2. **Basic Skill Analysis** (overview only, detailed gap analysis for premium)
3. **Limited Job Matches** (3 per month free)
4. **Chat Assistant** (100 messages/month free)
5. **Dashboard Overview** (key stats only)

### Design Enhancements
- **Glassmorphism Cards** for modern look
- **Gradient Backgrounds** (subtle, brand-colored)
- **Smooth Animations** on page transitions and interactions
- **Micro-interactions** (button hover effects, loading states)
- **Dark Mode Support** with Tailwind
- **Responsive Design** (mobile-first approach)
- **Accessibility** (WCAG 2.1 AA compliant)

### Smart Features
- **Resume Parsing Indicator** (shows which sections were successfully extracted)
- **Skill Endorsements** from matches (showing how many jobs require each skill)
- **Comparison View** (old vs optimized resume side-by-side)
- **Export Options** (PDF, Word, JSON)
- **Drag-and-drop Interface** for easy navigation
- **Smart Suggestions** based on user behavior
- **Real-time Validation** for forms

---

## 🚀 Development Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Set up React + Express project structure
- [ ] Configure MongoDB Atlas
- [ ] Implement Authentication (JWT + bcrypt)
- [ ] Create basic routing and layout

### Phase 2: Core Features (Week 3-4)
- [ ] Resume Upload & Parsing (Groq integration)
- [ ] Resume Data Display
- [ ] Dashboard with basic stats
- [ ] Profile Management

### Phase 3: Analysis Features (Week 5-6)
- [ ] Skill Gap Analysis
- [ ] Job Matching Algorithm
- [ ] Resume Optimizer
- [ ] Analytics Dashboard

### Phase 4: Chat & Polish (Week 7-8)
- [ ] Chat Assistant Integration (Groq)
- [ ] UI/UX Refinements
- [ ] Performance Optimization
- [ ] Testing & Bug Fixes

### Phase 5: Deployment (Week 9)
- [ ] Vercel Deployment
- [ ] Environment Configuration
- [ ] Security Audit
- [ ] Launch

---

## 📝 Important Notes

### API Keys & Environment Variables
```
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_GROQ_API_KEY=your_groq_key (frontend - safe to expose or use proxy)

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key (backend only)
FILE_STORAGE_URL=your_vercel_blob_url
NODE_ENV=production
```

### Security Considerations
- Never expose sensitive API keys in frontend (use backend proxy)
- Validate all file uploads (size, type)
- Implement rate limiting on API endpoints
- Use HTTPS only in production
- Sanitize user inputs
- Implement CORS properly
- Hash passwords with bcrypt (salt rounds: 10)
- Set proper JWT expiration times

### Performance Tips
- Use code splitting with React.lazy()
- Implement virtual scrolling for long lists
- Cache Groq API responses for similar jobs
- Use Redis for frequently accessed data
- Optimize images and assets
- Implement pagination for large datasets
- Lazy load components on routes

---

## 🎯 Success Metrics

- Resume parsing accuracy > 95%
- Job matching algorithm relevance feedback > 4/5
- Chat response time < 3 seconds
- Mobile responsiveness on all devices
- User retention rate > 40%
- API response time < 500ms
- Uptime > 99.5%

---

**Project Status:** Ready for Development
**Last Updated:** May 2026
**Version:** 1.0.0 (Planning)

---

