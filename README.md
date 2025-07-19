# Dayframe

A full-stack productivity app for managing tasks. Built with React, Express, and PostgreSQL for a responsive and efficient experience.

## Features:
- **Authentication**: Secure registration and login with JWT and Bcrypt.
- **Task Management**: Create and manage custom tasks
- **Task Categories**: Organize tasks into custom categories for better focus and structure
- **Recurring Tasks**: Set repeat schedules with optional end datasets
- **PostgreSQL Backend**: Efficient relational data storage for tasks, categories, and user data.

## Why I Made It:
I made this primarily as an exercise in creating a full-stack application from the ground up, covering everything from database design to UI components. Though I've previously worked on several websites, I'd either be developing their frontend, or taking a focus on updating the backend. With this project, i set out to challenge myself, owning the entire stack, and understanding how each layer connects. This project allowed me to experiment with RESTful API design, along with authentication flows and how that relates to security, within a real-world context.

## How It's Made:
**Frontend:** React.js, Tailwind,   
**Backend:** Node.js, Express.js, PostgreSQL, JWT, bcrypt   

I designed the frontend with a component-first mindset, breaking the UI into reusable pieces such as custom buttons, modals, select fields, and even calendars. Every component I tried to design for clarity and reusability, to avoid rewriting the same logic. I used React Hooks (useState, useEffect, useContext) to make local and global state predictable and efficient. 

On the backend, I structured the API using RESTful principles, separating routes, controllers, and database queries for maintainability. JWT-based authentication ensures secure user sessions, while bcrypt is used to hash and store passwords safely. I designed the PostgreSQL schema to handle tasks, logic to make them recurring, along with categories to hold these tasks. 

## Lessons Learned
- **Authentication is much tricker than it looks.** I initially set out, with a **very** weak understanding of how authentication works, and setting up token handling (access vs refresh) took me a much longer amount of time than I initially estimated.
- **Frontend State can get messy fast.** Early on, I let too many components handle their own state, which made debugging a nightmare. Refactoring to a global useContext approach was a lightbulb moment for cleaner and simpler data flow.
- **Feature creep is real.**. Wanting to personalize this task manager for my own use, I initially set out with a long list of features, baffled that most popular todo apps didn’t have them. I quickly learned why those features are often left out, for they add not only code complexity, but also complicate the user experience. As much as I wanted to pack in every idea, I had to prioritize the features most central to the solution.

## Setup Instructions
PostgreSQL must be running locally (or remotely)

### 1. Clone the Repository

```bash
  git clone https://github.com/yourusername/dayframe.git
  cd dayframe
```
### 2. Install dependencies  
Install dependencies for both the frontend (client) and backend (server):

```bash
  # In the client directory
  npm install

  # In the server directory
  npm install
```

### 3. Set up the Database  
#### 3.1 Create the Database
Make sure PostgreSQL is running, then create the database:

```bash
  createdb dayframe
```
If `createdb` isn’t available, use `psql`
```bash
  psql -U postgres -c "CREATE DATABASE dayframe;"
```
#### 3.2 Create the Tables
Run the SQL scripts located in the `server/db/` directory:
```bash
  psql -U postgres -d dayframe -f server/db/create_users.sql
  psql -U postgres -d dayframe -f server/db/create_categories.sql
  psql -U postgres -d dayframe -f server/db/create_tasks.sql
```

### 4. Configure environment variables  
Create a `.env` file in the `server/` directory and add the required variables:

```bash
  DB_USER=your_postgres_user
  DB_PASSWORD=_your_postgres_password
  DB_HOST=localhost
  PORT=5432
  DB_NAME=your_db_name
  JWT_SECRET=your_jwt_secret
  JWT_REFRESH_SECRET=your_jwt_refresh_secret
```
### 5. Start the Development Servers
Run backend and frontend in **two seperate terminals**
#### Backend
```bash
  cd server
  npm run dev
```

#### Frontend
```bash
  cd client
  npm run dev
```

## What Is Left?
- Add scrollable and virtualized task lists for large datasets
- Refine UI and responsive layouts for a more polished experience
- Implement drag-and-drop task reordering
- Integrate notifications/reminders for upcoming tasks