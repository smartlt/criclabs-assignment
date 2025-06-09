# 🚀 Data Mapping Dashboard

A full-stack web application for managing data mapping records with authentication, CRUD operations, and advanced filtering capabilities.

## 📋 **Tech Stack**

- **Backend**: NestJS + Mongoose (MongoDB)
- **Frontend**: Next.js + React + TypeScript
- **Database**: MongoDB
- **Authentication**: JWT
- **Styling**: Tailwind CSS
- **Architecture**: Monorepo

## 🏗️ **Project Structure**

```
data-mapping-dashboard/
├── apps/
│   ├── backend/          # NestJS API server
│   └── frontend/         # Next.js web application
├── package.json          # Root package.json (monorepo)
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- MongoDB (local or MongoDB Atlas)

### **Installation**

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd data-mapping-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   **Backend** (`apps/backend/.env`):

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/data-mapping-dashboard

   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=24h

   # Server
   PORT=3001
   NODE_ENV=development
   ```

   **Frontend** (`apps/frontend/.env.local`):

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Start development servers**

   ```bash
   # Start both backend and frontend concurrently
   npm run dev

   # Or start individually
   npm run dev:backend    # Backend on http://localhost:3001
   npm run dev:frontend   # Frontend on http://localhost:3000
   ```

## 📝 **Available Scripts**

### **Root Level (Monorepo)**

- `npm run dev` - Start both backend and frontend in development mode
- `npm run build` - Build both applications
- `npm run start` - Start both applications in production mode
- `npm run test` - Run tests for both applications
- `npm run lint` - Lint both applications
- `npm run clean` - Clean all node_modules and build files

### **Backend Specific**

- `npm run dev:backend` - Start backend in development mode
- `npm run build:backend` - Build backend
- `npm run start:backend` - Start backend in production mode
- `npm run test:backend` - Run backend tests

### **Frontend Specific**

- `npm run dev:frontend` - Start frontend in development mode
- `npm run build:frontend` - Build frontend
- `npm run start:frontend` - Start frontend in production mode
- `npm run test:frontend` - Run frontend tests

## 🌟 **Features**

### **Authentication**

- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Protected routes
- ✅ Auto token refresh

### **Data Management**

- ✅ Create, read, update, delete data records
- ✅ Form validation
- ✅ Real-time updates

### **Filtering & Search**

- ✅ Filter by title (partial match)
- ✅ Filter by department (dropdown)
- ✅ Filter by data subject type (multi-select)
- ✅ Filter by description (partial match)
- ✅ Combined filters

### **UI/UX**

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern interface with Tailwind CSS
- ✅ Loading states and error handling
- ✅ Form validation feedback

## 🗄️ **Database Schema**

### **User Collection**

```typescript
{
  _id: ObjectId,
  email: string (unique),
  password: string (hashed),
  name: string,
  createdAt: Date,
  updatedAt: Date
}
```

### **DataRecord Collection**

```typescript
{
  _id: ObjectId,
  title: string (required),
  description?: string,
  department: 'Human Resources' | 'IT/IS' | 'Admission' | 'Marketing',
  dataSubjectTypes: Array<'Employees' | 'Faculty Staff' | 'Students'>,
  createdBy: ObjectId (User reference),
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ **API Endpoints**

### **Authentication**

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

### **Data Records**

- `GET /data-records` - Get all records (with filtering)
- `POST /data-records` - Create new record
- `GET /data-records/:id` - Get single record
- `PUT /data-records/:id` - Update record
- `DELETE /data-records/:id` - Delete record

### **Filter Examples**

```bash
# Filter by title
GET /data-records?title=employee

# Filter by department
GET /data-records?department=IT/IS

# Filter by data subject type
GET /data-records?dataSubjectType=Employees

# Combined filters
GET /data-records?title=data&department=HR&dataSubjectType=Employees
```

## 🧪 **Testing**

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:backend -- --coverage
npm run test:frontend -- --coverage

# Watch mode for development
npm run test:backend -- --watch
npm run test:frontend -- --watch
```

## 🚀 **Deployment**

### **Backend Deployment** (Railway/Heroku)

1. Set environment variables in deployment platform
2. Deploy from main branch
3. Run database migrations if needed

### **Frontend Deployment** (Vercel)

1. Connect repository to Vercel
2. Set `NEXT_PUBLIC_API_URL` environment variable
3. Deploy from main branch

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Commit Convention**

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

## 📊 **Development Progress**

Track the development progress in our [GitHub Issues](link-to-github-issues).

## 🔗 **Useful Links**

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ for the Data Mapping Challenge
