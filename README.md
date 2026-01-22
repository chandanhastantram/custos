# CUSTOS 1.0 - School Management System

A comprehensive school management system with five user roles, AI-powered features, and white-label customization.

## 🚀 Features

### User Roles

- **Super Admin**: Complete system control, analytics, and user management
- **Sub-Admin**: Daily operations management (limited permissions)
- **Teacher**: Lesson planning, assignment management, and student tracking
- **Student**: Homework completion, CUSTOS AI assistant, and progress tracking
- **Parent**: Monitor children's performance and communicate with teachers

### Key Capabilities

- 🤖 AI-powered lesson plan generation
- 📊 Adaptive question generation (60/40 weak/strong topic split)
- 📈 Pattern analysis for student performance
- 💬 CUSTOS AI - Intelligent educational assistant
- 🎨 White-label theming per school
- 📅 Calendar and timetable management
- 📢 Announcements and communication system
- 🏆 Gamification with points and rewards

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 📦 Installation

1. **Clone and install dependencies**:

```bash
npm install
```

2. **Set up environment variables**:
   Copy `.env.example` to `.env.local` and update values:

```env
MONGODB_URI=mongodb://localhost:27017/custos
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

3. **Start MongoDB** (if running locally):

```bash
# Make sure MongoDB is running on port 27017
```

4. **Initialize the database**:

```bash
# Start the dev server first
npm run dev

# Then visit this URL in your browser:
# http://localhost:3000/api/setup
```

This will create:

- A demo school
- Test users for all 5 roles

## 🔑 Demo Credentials

After running the setup, use these credentials to login:

| Role        | Email               | Password    |
| ----------- | ------------------- | ----------- |
| Super Admin | superadmin@demo.com | password123 |
| Sub-Admin   | subadmin@demo.com   | password123 |
| Teacher     | teacher@demo.com    | password123 |
| Student     | student@demo.com    | password123 |
| Parent      | parent@demo.com     | password123 |

## 🚀 Running the Application

```bash
npm run dev
```

Visit `http://localhost:3000` and you'll be redirected to the login page.

## 📁 Project Structure

```
custos/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   ├── super-admin/         # Super Admin dashboard
│   ├── sub-admin/           # Sub-Admin dashboard
│   ├── teacher/             # Teacher dashboard
│   ├── student/             # Student dashboard
│   ├── parent/              # Parent dashboard
│   └── api/                 # API routes
├── components/              # Reusable components
├── lib/                     # Utilities
│   ├── db.ts               # MongoDB connection
│   ├── auth.ts             # NextAuth config
│   └── ai.ts               # AI service (placeholders)
├── models/                  # Mongoose schemas
└── types/                   # TypeScript definitions
```

## 🎯 Next Steps

### Immediate Tasks

1. **Build module pages** for each role (Manage, Reports, Calendar, etc.)
2. **Implement API routes** for CRUD operations
3. **Add real AI integration** (replace placeholders in `lib/ai.ts`)
4. **Create forms** for user management, class creation, etc.
5. **Build the question pattern system** for adaptive learning

### AI Integration

Replace placeholder functions in `lib/ai.ts` with real API calls:

- OpenAI GPT-4 for lesson plans and question generation
- Google Gemini for doubt solver
- Add your API keys to `.env.local`

### White-label Customization

- Add school settings page for Super Admin
- Implement dynamic theming based on school colors
- Add logo upload functionality

## 📚 Database Models

- **School**: White-label settings
- **User**: All 5 roles with role-specific fields
- **Class**: Classes and sections
- **Subject**: Subjects with syllabus content
- **LessonPlan**: AI-generated daily plans
- **Question**: Questions with pattern metadata
- **Test**: Daily/Weekly/Lesson-wise tests
- **Submission**: Student answers and scores
- **Post**: Announcements
- **Event**: Calendar events and schedules
- **Feedback**: Teacher-student communication
- **Message**: Parent-teacher messaging
- **Notification**: Alerts and reminders

## 🔒 Security

- Password hashing with bcrypt
- JWT-based sessions
- Role-based route protection
- Middleware authentication checks

## 📄 License

MIT License - feel free to use for your school!

## 🤝 Contributing

This is a foundational build. Contributions welcome for:

- Additional features
- UI improvements
- Performance optimizations
- Bug fixes

---

**Built with ❤️ for schools worldwide**
