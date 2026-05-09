# ResuMate Implementation Prompt for Claude

**Use this prompt when you've downloaded the Optimus template and want Claude to implement ResuMate features.**

---

## CONTEXT & PROJECT BRIEF

I'm building **ResuMate** - an AI-powered career & skill intelligence platform. It's a hybrid of LinkedIn, Indeed, resume analyzer, skill gap detector, and AI career assistant.

**Key Tech Stack:**
- Frontend: React.js, Redux Toolkit, React Router, Tailwind CSS, Material UI
- Backend: Node.js + Express (on Vercel)
- Database: MongoDB
- AI: Groq API (Llama 3 70B)
- Deployment: Vercel (entire stack)

**Base Template:** Optimus - The AI Platform to build and ship (v0)

---

## CORE FEATURE REQUIREMENTS

### 1. RESUME UPLOAD & PARSING
- Drag-and-drop file uploader (PDF/DOCX support)
- Parse resume using Groq API to extract:
  - Summary/Objective
  - Work Experience (job title, company, dates, description)
  - Education (institution, degree, field, graduation date)
  - Skills (name, category, proficiency level)
  - Certifications
- Show parsing progress/status indicator
- Store extracted data in MongoDB with original file
- Display extracted data clearly for user review/editing

### 2. SKILL ANALYSIS & GAP DETECTION
- Show all extracted skills with:
  - Skill name
  - Category (Technical, Soft Skills, Languages, etc.)
  - Proficiency level (Beginner, Intermediate, Advanced, Expert)
  - Years of experience (if available)
- Create skill radar chart (Recharts) showing skill distribution
- Skill endorsements counter (derived from job matches)
- Skill trending/demand insights
- Export skill profile as JSON/PDF

### 3. INTELLIGENT JOB MATCHER
- **Job Search Interface:**
  - Search by job title, location, industry, experience level
  - Option to paste job description directly
  - Filter by salary range, job type, company size
  
- **Matching Algorithm (via Groq):**
  - Extract job requirements from description
  - Compare with user's resume skills
  - Calculate match score (0-100%)
  - Identify matched, partial, and missing skills
  - Prioritize missing skills by importance
  - Generate actionable improvement recommendations
  
- **Match Results Display:**
  - Match percentage with visual indicator (circular progress)
  - Matched skills (green badges)
  - Missing skills (red badges with learning time)
  - Skill gap analysis with priority levels
  - 3-5 specific resume optimization tips
  - Recommended learning path with resources
  - Option to save match for later

### 4. SMART RESUME OPTIMIZER
- Select target job to optimize resume for
- AI-powered suggestions for:
  - Summary/objective rewrite (with keywords from job)
  - Experience descriptions improvement (highlighting relevant achievements)
  - Skills section optimization (reorder by job relevance)
  - ATS keyword optimization
  - Formatting best practices
- Side-by-side comparison view (original vs optimized)
- Accept/reject individual suggestions
- Download optimized resume (PDF/DOCX)
- Version history (keep track of all optimized versions)

### 5. AI CAREER ASSISTANT CHAT
- Real-time chat interface with Groq Llama 3 70B
- Context-aware responses based on:
  - User's uploaded resume
  - Currently viewed job match (if applicable)
  - Chat history
- Chat features:
  - Message history with timestamps
  - Clear chat button
  - Export conversation as PDF/TXT
  - Copy response button
  - Typing indicator
- Available topics:
  - Career advice & guidance
  - Resume writing tips
  - Interview preparation
  - Skill development strategies
  - Industry insights
  - Salary negotiation advice
  - Career transition guidance

### 6. COMPREHENSIVE DASHBOARD
- **Key Stats Cards:**
  - Profile completion percentage
  - Total skills extracted
  - Job matches found (this month)
  - Chat messages used (if freemium)
  - Last resume update date

- **Skill Distribution:**
  - Radar chart showing skill categories
  - Top 5 skills by proficiency
  - Trending skills (industry demand)

- **Recent Activity:**
  - Last job matches
  - Recent resume updates
  - Latest chat conversations

- **Quick Actions:**
  - Upload new resume
  - Start job search
  - Open chat assistant
  - View all matches

### 7. USER AUTHENTICATION & PROFILE
- Sign up / Sign in (email + password)
- Email verification
- JWT token-based authentication
- Password hashing with bcrypt
- User profile page:
  - Profile photo upload
  - Bio/about section
  - Location
  - LinkedIn/portfolio URLs
  - Education history
  - Work experience timeline
- Settings page:
  - Privacy controls
  - Notification preferences
  - Download account data
  - Delete account
- Dashboard overview (accessible after login)

---

## IMPLEMENTATION DETAILS

### Frontend Component Structure (React)

**Pages to Create:**
- `LandingPage.jsx` - Hero section with CTA, feature highlights
- `AuthPage.jsx` - Login/Sign-up forms
- `DashboardPage.jsx` - Main dashboard with stats
- `AnalyzerPage.jsx` - Skill analysis & gap detection
- `JobMatcherPage.jsx` - Job search & matching interface
- `ResumeOptimizerPage.jsx` - Resume improvement tool
- `ChatPage.jsx` - AI career assistant chat
- `ProfilePage.jsx` - User profile management
- `NotFoundPage.jsx` - 404 page

**Reusable Components:**
```
components/
├── forms/
│   ├── ResumeUploadForm.jsx (drag-drop, file handling)
│   ├── JobSearchForm.jsx (search filters)
│   └── LoginForm.jsx
├── charts/
│   ├── SkillRadarChart.jsx (Recharts radar)
│   ├── MatchScoreCircle.jsx (circular progress)
│   └── TrendChart.jsx
├── cards/
│   ├── SkillCard.jsx
│   ├── JobMatchCard.jsx
│   ├── StatCard.jsx
│   └── RecommendationCard.jsx
├── common/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── LoadingSpinner.jsx
│   ├── ErrorBoundary.jsx
│   └── Toast.jsx
└── chat/
    ├── ChatBox.jsx
    ├── ChatMessage.jsx
    └── ChatInput.jsx
```

### Backend API Routes (Express)

**Authentication:**
```javascript
POST /api/auth/register - Register user
POST /api/auth/login - Login user
POST /api/auth/logout - Logout
GET /api/auth/me - Get current user
POST /api/auth/refresh-token - Refresh JWT
```

**Resume Management:**
```javascript
POST /api/resume/upload - Upload resume file
GET /api/resume/list - Get user's resumes
GET /api/resume/:id - Get resume details
PUT /api/resume/:id - Update resume
DELETE /api/resume/:id - Delete resume
POST /api/resume/:id/parse - Parse resume with Groq
POST /api/resume/:id/optimize/:jobId - Generate optimized version
```

**Job Matching:**
```javascript
POST /api/jobs/analyze - Analyze job description
POST /api/jobs/match - Get match analysis
GET /api/jobs/matches - Get user's saved matches
GET /api/jobs/matches/:id - Get specific match
DELETE /api/jobs/matches/:id - Delete saved match
```

**Chat:**
```javascript
POST /api/chat/message - Send message to assistant
GET /api/chat/history - Get chat history
DELETE /api/chat/history - Clear chat
POST /api/chat/export - Export conversation
```

**User Profile:**
```javascript
GET /api/user/profile - Get user profile
PUT /api/user/profile - Update profile
GET /api/user/settings - Get settings
PUT /api/user/settings - Update settings
```

### Groq API Integration

**Three Main Prompts to Implement:**

**1. Resume Parsing Prompt:**
```
Analyze the following resume text and extract structured information.
Return ONLY valid JSON with: summary, experience[], education[], skills[], certifications[]
For skills include: name, category, proficiency level.
Do NOT include any text outside the JSON object.
```

**2. Job Matching Prompt:**
```
You are an expert career advisor. Analyze the provided resume and job description.
Calculate match score (0-100%), identify matched/partial/missing skills.
Return JSON with: matchScore, matchedSkills[], missingSkills[], keyRecommendations[], 
resumeOptimizations[], learningPath[], summary.
Focus on actionable insights and specific improvements.
Return ONLY valid JSON.
```

**3. Career Assistant Prompt:**
```
You are an expert career coach and AI assistant. Use the user's resume context
and conversation history to provide helpful, specific career advice.
Topics: resume writing, interview prep, skill development, career guidance, salary negotiation.
Keep responses concise but comprehensive. Use markdown formatting.
If discussing a specific job, reference relevant skills from their resume.
Maintain conversational tone while being professional and insightful.
```

---

## UI/UX REQUIREMENTS

### Design System
- **Colors:** Use Optimus template's color scheme (extend with career/growth theme colors)
  - Primary: Professional blue or tech purple
  - Success: Green (for matched skills, positive matches)
  - Warning: Orange (for partial matches)
  - Danger: Red (for missing skills)
  - Neutral: Gray scale
  
- **Typography:** Clean, modern sans-serif (already in Optimus)
  - Headers: Bold, clear hierarchy
  - Body: Readable, proper contrast
  
- **Components:**
  - Smooth transitions between pages
  - Loading states with spinners
  - Success/error toast notifications
  - Modals for confirmations
  - Badges for skills/tags
  - Progress bars for completions
  - Tooltips for additional info

### Mobile Responsiveness
- Full responsive design (mobile-first)
- Touch-friendly buttons (48px minimum)
- Collapsible sidebars on mobile
- Stack layouts vertically on small screens
- Optimized forms for mobile input

### Animations & Microinteractions
- Fade-in animations on page load
- Smooth scrolling
- Button hover effects (subtle elevation/color change)
- Loading spinner animation
- Slide-in modals
- Bounce animations on important CTAs

---

## DATABASE SCHEMA (MongoDB)

**Collections to Create:**
1. `users` - User accounts with profiles
2. `resumes` - Uploaded resumes with extracted data
3. `job_matches` - Saved job matches with analysis
4. `chat_messages` - Chat history with context
5. `skills_library` - Reference data for skills

**Detailed Schema Examples:**
```javascript
// User
{
  _id, email, password(hashed), firstName, lastName, 
  profilePhoto, bio, location, skills[], createdAt, updatedAt
}

// Resume
{
  _id, userId(ref), fileName, fileUrl, extractedData{
    summary, experience[], education[], skills[{name, category, proficiency}],
    certifications[]
  }, parsedAt, createdAt
}

// JobMatch
{
  _id, userId(ref), resumeId(ref), jobTitle, jobDescription,
  analysis{ matchScore, matchedSkills[], missingSkills[], 
  recommendations[], learningPath[] }, savedAt, createdAt
}

// ChatMessage
{
  _id, userId(ref), resumeId(ref), jobMatchId(ref),
  messages[{ role, content, timestamp }], context{}, createdAt, updatedAt
}
```

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Setup & Auth
- [ ] Configure project structure
- [ ] Set up MongoDB connection
- [ ] Implement JWT authentication
- [ ] Create Login/Sign-up pages
- [ ] Create basic navigation

### Phase 2: Resume Features
- [ ] Build resume upload component
- [ ] Integrate Groq for parsing
- [ ] Display extracted data
- [ ] Create dashboard with stats
- [ ] Store resumes in MongoDB

### Phase 3: Analysis & Matching
- [ ] Build skill analyzer (radar chart)
- [ ] Create job search interface
- [ ] Implement job matching algorithm (Groq)
- [ ] Display match results with recommendations
- [ ] Create skill gap analysis

### Phase 4: Optimizer & Chat
- [ ] Build resume optimizer interface
- [ ] Create side-by-side comparison
- [ ] Implement download functionality
- [ ] Build chat interface
- [ ] Integrate Groq for chat responses

### Phase 5: Polish & Deploy
- [ ] UI/UX refinements
- [ ] Mobile responsiveness check
- [ ] Performance optimization
- [ ] Error handling & validation
- [ ] Deploy to Vercel

---

## INSTRUCTIONS FOR CLAUDE

When you provide this prompt to Claude for implementation:

1. **Start with the template structure** - Don't replace everything, extend the Optimus template
2. **Create page by page** - Start with Dashboard, then build out other pages
3. **Component reusability** - Build components that can be reused across pages
4. **State management** - Use Redux Toolkit for global state
5. **Error handling** - Implement proper error boundaries and user feedback
6. **API integration** - Create service files for all API calls
7. **Styling** - Use Tailwind CSS classes, maintain consistency
8. **Responsive design** - Test on multiple screen sizes
9. **User experience** - Smooth transitions, loading states, clear feedback
10. **Comments & documentation** - Comment complex logic

### Sample Follow-up Prompts:

**For specific features:**
```
"Create the ResumeUploadForm component with drag-drop functionality. 
Use React Dropzone, show upload progress, and validate file types."
```

```
"Build the SkillRadarChart component using Recharts. Display skills by 
category with different colors. Make it interactive with hover details."
```

```
"Implement the job matching API endpoint. Take job description as input, 
use Groq API with the job matching prompt, and return structured analysis."
```

```
"Create the ChatPage component with real-time messaging. 
Integrate Groq API for responses, maintain chat history, 
add export and clear chat features."
```

---

## DEPLOYMENT ON VERCEL

**Key Configuration:**

1. **Vercel Config (vercel.json):**
```json
{
  "buildCommand": "npm run build",
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

2. **Environment Variables on Vercel:**
```
MONGODB_URI
JWT_SECRET
GROQ_API_KEY
NODE_ENV=production
```

3. **Deployment Steps:**
   - Push to GitHub
   - Connect repo to Vercel
   - Set environment variables
   - Deploy (automatic on push to main)

---

## GROQ API INTEGRATION NOTES

- **Model:** llama-3-70b-versatile
- **Max tokens:** Set based on use case (resume parsing: 1000, chat: 2000)
- **Temperature:** 0.7 (balanced creativity and consistency)
- **Rate limiting:** Implement on backend to avoid quota issues
- **Error handling:** Retry failed requests, fallback to cached responses
- **Caching:** Cache similar job analyses to save API calls

---

## FINAL NOTES

- This is a **full-stack project** - requires both frontend and backend work
- **Security first** - Never expose API keys in frontend
- **User experience** - Focus on smooth, intuitive interactions
- **Performance** - Optimize for fast loading, snappy UI
- **Scalability** - Design for multiple users, efficient database queries
- **Iterative development** - Build features incrementally, test often

Good luck with ResuMate! This is an ambitious but achievable project. Start with the foundation (auth + dashboard), then layer in the core features.

---

**Project Name:** ResuMate (Resume Elevated)
**Status:** Ready for Implementation
**Estimated Timeline:** 8-10 weeks
**Base Template:** Optimus - The AI Platform to build and ship (v0)

