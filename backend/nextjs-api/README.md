# Xtrawrkx Backend API

This is the backend API for the Xtrawrkx platform, built with Next.js, Prisma, and PostgreSQL.

## Features

- **User Management**: Internal Xtrawrkx users with role-based permissions
- **CRM**: Accounts, contacts, leads, and deals management
- **Project Management**: Projects, tasks, and time tracking
- **Client Portal**: Community memberships and portal access
- **Email System**: Templates, campaigns, and tracking
- **File Management**: Document storage and organization
- **Reporting**: Analytics and custom reports
- **Audit Trail**: Complete activity logging

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Validation**: Zod schemas
- **File Upload**: Multer + Sharp
- **Email**: Nodemailer
- **Payments**: Stripe integration

## Database Schema

The database includes comprehensive models for:

### Core Entities

- `XtrawrkxUser` - Internal team members
- `Account` - Client companies
- `Contact` - Individual contacts
- `Lead` - Potential customers
- `Deal` - Sales opportunities
- `Project` - Client projects
- `Task` - Project tasks and subtasks

### Supporting Entities

- `Activity` - All system activities
- `Community` - Client communities (XEN, XEVFIN, etc.)
- `EmailTemplate` - Email templates
- `EmailCampaign` - Marketing campaigns
- `File` - Document storage
- `TimeEntry` - Time tracking
- `Invoice` - Billing and invoicing

## Setup Instructions

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
DATABASE_URL="postgresql://username:password@localhost:5432/xtrawrkx_db"
NEXTAUTH_SECRET="your-secret-key"
JWT_SECRET="your-jwt-secret"
```

### 2. Database Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed

# (Optional) Open Prisma Studio
npm run db:studio
```

### 3. Development

```bash
# Start development server
npm run dev

# The API will be available at http://localhost:3004
```

## API Endpoints

### Authentication

- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User sign up
- `POST /api/auth/signout` - User sign out

### Users

- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/[id]` - Get user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Accounts

- `GET /api/accounts` - List accounts
- `POST /api/accounts` - Create account
- `GET /api/accounts/[id]` - Get account
- `PUT /api/accounts/[id]` - Update account
- `DELETE /api/accounts/[id]` - Delete account

### Contacts

- `GET /api/contacts` - List contacts
- `POST /api/contacts` - Create contact
- `GET /api/contacts/[id]` - Get contact
- `PUT /api/contacts/[id]` - Update contact
- `DELETE /api/contacts/[id]` - Delete contact

### Leads

- `GET /api/leads` - List leads
- `POST /api/leads` - Create lead
- `GET /api/leads/[id]` - Get lead
- `PUT /api/leads/[id]` - Update lead
- `DELETE /api/leads/[id]` - Delete lead
- `POST /api/leads/convert` - Convert lead to account/contact

### Deals

- `GET /api/deals` - List deals
- `POST /api/deals` - Create deal
- `GET /api/deals/[id]` - Get deal
- `PUT /api/deals/[id]` - Update deal
- `DELETE /api/deals/[id]` - Delete deal

### Projects

- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Tasks

- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/[id]` - Get task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### Activities

- `GET /api/activities` - List activities
- `POST /api/activities` - Create activity
- `GET /api/activities/[id]` - Get activity

### Files

- `POST /api/files/upload` - Upload file
- `GET /api/files/[id]` - Get file
- `DELETE /api/files/[id]` - Delete file

### Reports

- `GET /api/reports` - List reports
- `POST /api/reports` - Create report
- `GET /api/reports/[id]` - Get report

## Database Models

### XtrawrkxUser

Internal team members with role-based access control.

```typescript
{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: UserDepartment;
  isActive: boolean;
  permissions: Json;
  hiredDate: DateTime;
}
```

### Account

Client companies and organizations.

```typescript
{
  id: string
  companyName: string
  industry: string
  type: AccountType
  website: string
  phone: string
  email: string
  ownerId: string
  source: AccountSource
  tags: string[]
}
```

### Contact

Individual contacts within accounts.

```typescript
{
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  role: ContactRole;
  status: ContactStatus;
  assignedToId: string;
}
```

### Lead

Potential customers from various sources.

```typescript
{
  id: string;
  leadName: string;
  companyName: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  estimatedValue: Decimal;
  score: number;
  assignedToId: string;
}
```

### Deal

Sales opportunities linked to accounts and contacts.

```typescript
{
  id: string;
  accountId: string;
  contactId: string;
  name: string;
  stage: DealStage;
  value: Decimal;
  probability: number;
  ownerId: string;
}
```

### Project

Client projects with tasks and team members.

```typescript
{
  id: string;
  dealId: string;
  accountId: string;
  name: string;
  status: ProjectStatus;
  startDate: DateTime;
  endDate: DateTime;
  progress: number;
  projectManagerId: string;
}
```

### Task

Project tasks with assignees and subtasks.

```typescript
{
  id: string;
  projectId: string;
  name: string;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number;
  dueDate: DateTime;
  assigneeId: string;
}
```

## Lead Conversion Flow

1. **Lead Creation**: Leads can be created via:

   - Chrome Extension (LinkedIn extraction)
   - Manual entry
   - CSV import

2. **Lead Qualification**: Leads are scored and qualified by sales team

3. **Conversion**: Qualified leads are converted to:
   - Account (company record)
   - Contact (individual person)
   - Deal (sales opportunity)

## Community Management

The system supports multiple client communities:

- **XEN** (Xtrawrkx Entrepreneur Network) - Free tier
- **XEVFIN** (Xtrawrkx Event Finance) - Paid tier
- **XEVTG** (Xtrawrkx Event Technology) - Paid tier
- **XDD** (Xtrawrkx Digital Design) - Free tier

## File Management

Files can be attached to any entity (projects, tasks, deals, contacts, etc.) with metadata tracking.

## Time Tracking

Time entries are linked to tasks and projects for billing and project management.

## Email System

- **Templates**: Reusable email templates
- **Campaigns**: Bulk email campaigns
- **Tracking**: Open rates, clicks, bounces

## Reporting

Custom reports can be generated for:

- Sales performance
- Project progress
- Time tracking
- Revenue analysis

## Security

- Role-based access control
- JWT authentication
- Audit logging
- Rate limiting
- CORS protection

## Development

### Adding New Models

1. Update `prisma/schema.prisma`
2. Run `npm run db:push`
3. Generate Prisma client: `npm run db:generate`
4. Create API endpoints in `src/app/api/`

### Database Migrations

```bash
# Create migration
npm run db:migrate

# Reset database
npm run db:reset

# View database
npm run db:studio
```

### Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## Deployment

### Environment Variables

Set the following environment variables in production:

```bash
DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret"
JWT_SECRET="your-jwt-secret"
```

### Build and Deploy

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

Private - Xtrawrkx Internal Use Only
