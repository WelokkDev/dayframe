# Dayframe

**Intelligent Task Management with AI-Powered Natural Language Processing**

Transform your productivity with Dayframe — a sophisticated full-stack application that combines intelligent task parsing, advanced scheduling, and seamless user experience. Simply describe what you need to do in natural language, and watch as AI transforms your thoughts into structured, actionable tasks with smart scheduling and recurrence patterns.

![Dayframe Dashboard](./assets/dashboard-screenshot.png)

## ✨ Key Features

### 🤖 **AI-Powered Task Generation**
- **Natural Language Processing**: Describe tasks in plain English — "Buy groceries tomorrow" or "Go to gym 4 times a week"
- **Intelligent Parsing**: OpenAI integration automatically extracts deadlines, recurrence patterns, and task priorities
- **Smart Scheduling**: AI understands complex time expressions and converts them to precise scheduling rules
- **Interactive Confirmation**: Review and approve AI-generated tasks before they're added to your workflow

### 📅 **Advanced Recurrence Engine**
- **Flexible Patterns**: Daily, weekly, monthly schedules with custom intervals
- **Complex Rules**: "Every 3 weeks", "4 times per week", "First Monday of each month"
- **Time-Specific Tasks**: Set preferred times, time ranges, and end conditions
- **Smart Instance Generation**: Automatic creation of future task instances based on recurrence rules

### 🎨 **Custom Calendar Interface**
- **Interactive Calendar View**: Visual task management with drag-and-drop functionality
- **Category Organization**: Organize tasks into custom categories for better focus
- **Task Status Tracking**: Monitor completed, failed, and pending tasks
- **Responsive Design**: Seamless experience across desktop and mobile devices

### 🔐 **Enterprise-Grade Security**
- **JWT Authentication**: Secure token-based authentication with refresh token rotation
- **Password Hashing**: Bcrypt encryption for secure password storage
- **Protected Routes**: Middleware-protected API endpoints
- **Session Management**: Robust user session handling

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern component-based UI with hooks and context
- **Tailwind CSS** - Utility-first styling with custom design system
- **React Router** - Client-side routing and navigation
- **Date-fns** - Advanced date manipulation and formatting
- **Framer Motion** - Smooth animations and transitions

### Backend
- **Node.js & Express.js** - RESTful API architecture
- **PostgreSQL** - Relational database with optimized queries
- **OpenAI API** - GPT integration for natural language processing
- **JWT & Bcrypt** - Secure authentication and password hashing
- **CORS & Cookie Parser** - Cross-origin resource sharing and session management

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code quality and consistency
- **Nodemon** - Automatic server restarts during development

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dayframe.git
   cd dayframe
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   cd client && npm install
   
   # Backend dependencies
   cd ../server && npm install
   ```

3. **Database setup**
   ```bash
   # Create database
   createdb dayframe
   
   # Run SQL scripts
   psql -U postgres -d dayframe -f server/sql/create_users.sql
   psql -U postgres -d dayframe -f server/sql/create_categories.sql
   psql -U postgres -d dayframe -f server/sql/create_tasks.sql
   psql -U postgres -d dayframe -f server/sql/create_recurrence.sql
   psql -U postgres -d dayframe -f server/sql/create_task_instances.sql
   psql -U postgres -d dayframe -f server/sql/create_counter_instances.sql
   psql -U postgres -d dayframe -f server/sql/create_ai_conversations.sql
   ```

4. **Environment configuration**
   Create `server/.env`:
   ```env
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=dayframe
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

5. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev
   
   # Terminal 2 - Frontend
   cd client && npm run dev
   ```

## 🎯 Usage Examples

### Natural Language Task Creation
```
"Buy groceries tomorrow at 2pm"
→ Creates task: "Buy groceries" due tomorrow at 2:00 PM

"Go to gym every Monday, Wednesday, and Friday"
→ Creates recurring task with weekly pattern on specific days

"Submit quarterly report by the 15th of next month"
→ Creates task with calculated due date and importance flag

"Call mom 3 times a week"
→ Creates task with 3 occurrences per week pattern
```

### Advanced Recurrence Patterns
- **Daily**: "Every day", "Every 2 days"
- **Weekly**: "Every Monday", "Every 3 weeks on Tuesday"
- **Monthly**: "Every 15th", "First Monday of each month"
- **Custom**: "4 times per week", "Every other weekday"

## 🏗 Architecture Highlights

### Database Design
- **Normalized Schema**: Optimized relational structure for scalability
- **Recurrence Rules**: Flexible pattern storage supporting complex scheduling
- **Task Instances**: Efficient generation and management of recurring task occurrences
- **AI Conversations**: Persistent storage of user interactions for context

### API Design
- **RESTful Endpoints**: Clean, predictable API structure
- **Middleware Architecture**: Authentication, validation, and error handling
- **Error Handling**: Comprehensive error responses with proper HTTP status codes
- **Rate Limiting**: Protection against API abuse

### Frontend Architecture
- **Component-Based**: Reusable, maintainable UI components
- **Context Management**: Global state management with React Context
- **Custom Hooks**: Encapsulated business logic and API interactions
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🔮 Future Enhancements

- **Real-time Notifications**: Push notifications for upcoming tasks
- **Team Collaboration**: Multi-user workspaces and task sharing
- **Advanced Analytics**: Productivity insights and task completion metrics
- **Mobile App**: Native iOS and Android applications
- **Integration APIs**: Connect with calendar apps and productivity tools

## 📸 Screenshots

![AI Task Generation](./assets/ai-prompt-screenshot.png)
*Natural language task creation with AI-powered parsing*

![Calendar View](./assets/calendar-screenshot.png)
*Interactive calendar with drag-and-drop task management*

![Task Management](./assets/tasks-screenshot.png)
*Organized task lists with category filtering*

## 🤝 Contributing

This project demonstrates full-stack development capabilities including:
- **Frontend Development**: React, modern JavaScript, responsive design
- **Backend Development**: Node.js, Express, RESTful API design
- **Database Design**: PostgreSQL, query optimization, data modeling
- **AI Integration**: OpenAI API, natural language processing
- **Security**: Authentication, authorization, data protection
- **DevOps**: Environment configuration, deployment considerations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ to showcase modern full-stack development and AI integration capabilities.**