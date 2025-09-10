# Smart Student Hub - MVP

A centralized digital platform for comprehensive student activity record management in Higher Education Institutions.

## Features

### For Students
- **Dashboard**: View personal statistics and recent activities
- **Activity Management**: Submit and track academic/extracurricular activities
- **Digital Portfolio**: Auto-generated verified portfolio of achievements
- **Real-time Updates**: Track approval status of submitted activities

### For Faculty
- **Approval Panel**: Review and approve/reject student activities
- **Points Assignment**: Assign merit points to approved activities
- **Analytics Dashboard**: View institutional statistics and reports
- **Student Management**: Access comprehensive student profiles

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: React.js
- **Authentication**: JWT
- **Database**: MongoDB with Mongoose ODM

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
3. **npm** or **yarn** package manager

## Installation & Setup

### 1. Clone or Navigate to the Project

```bash
cd smart-student-hub
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Setup MongoDB

Make sure MongoDB is installed and running on your system:

```bash
# For Windows
mongod

# For Mac/Linux
sudo mongod
```

### 5. Configure Environment Variables

The backend `.env` file is already created with default values:
- MongoDB URI: `mongodb://localhost:27017/smart-student-hub`
- JWT Secret: Change this in production
- Port: 5000

## Running the Application

### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Start Backend Server:**
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

### Option 2: Using npm run dev (with nodemon)

For development with auto-reload:

**Backend:**
```bash
cd backend
npm run dev
```

## Default User Roles

When registering, you can choose between:
- **Student**: Can submit activities and view portfolio
- **Faculty**: Can approve/reject activities and view analytics

## Sample Login Credentials

After registering, you can use:
- **Student Account**: Register with role "student"
- **Faculty Account**: Register with role "faculty"

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Student Routes
- `GET /api/student/dashboard` - Get dashboard data
- `GET /api/student/profile` - Get student profile
- `GET /api/student/portfolio` - Get student portfolio

### Activity Routes
- `GET /api/activities/my-activities` - Get student's activities
- `POST /api/activities` - Create new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

### Faculty Routes
- `GET /api/faculty/pending-activities` - Get pending activities
- `PUT /api/faculty/approve/:id` - Approve activity
- `PUT /api/faculty/reject/:id` - Reject activity
- `GET /api/faculty/analytics` - Get analytics data

## Project Structure

```
smart-student-hub/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── public/          
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── App.js       # Main App component
│   │   └── index.js     # Entry point
│   └── package.json
└── README.md
```

## Features Implemented

✅ User Authentication (Student/Faculty)
✅ Student Dashboard with Statistics
✅ Activity Submission and Management
✅ Faculty Approval Workflow
✅ Points System for Activities
✅ Digital Portfolio Generation
✅ Analytics and Reporting
✅ Responsive Design
✅ Category-based Activity Classification

## Activity Categories

- Conference
- Workshop
- Certification
- Competition
- Internship
- Project
- Publication
- Volunteering
- Leadership
- Club Activity
- Community Service
- Other

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check if port 27017 is available
- Verify MongoDB URI in `.env` file

### Port Already in Use
- Backend: Change PORT in `.env` file
- Frontend: It will automatically ask for a different port

### Cannot Find Module Errors
- Run `npm install` in both backend and frontend directories
- Delete `node_modules` and reinstall if needed

## Future Enhancements

- [ ] File upload for certificates
- [ ] Email notifications
- [ ] Advanced search and filters
- [ ] Export reports in multiple formats
- [ ] Mobile application
- [ ] Integration with existing LMS
- [ ] NAAC/NIRF report generation
- [ ] Bulk activity approval
- [ ] Student achievements timeline
- [ ] Department-wise analytics

## License

This is an MVP project for educational purposes.

## Support

For issues or questions, please check the documentation or create an issue in the project repository.
