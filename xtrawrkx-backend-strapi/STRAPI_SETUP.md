# Xtrawrkx Strapi Backend

This is a Strapi CMS backend that mirrors the Prisma schema structure from the main backend. It provides a complete content management system with all the same entities and relationships.

## Database Structure

The Strapi backend includes the following content types that mirror your Prisma schema:

### Core Entities

- **XtrawrkxUser**: Internal company users with roles and departments
- **Account**: Client companies and business accounts
- **Contact**: Contact persons within client companies
- **Lead**: Potential customers and prospects

### Project Management

- **Deal**: Sales deals and opportunities
- **Project**: Client projects and deliverables
- **Task**: Project tasks and work items
- **Subtask**: Sub-tasks within main tasks
- **Activity**: Activities and interactions across all entities

### Communication & Documentation

- **EmailTemplate**: Reusable email templates
- **EmailCampaign**: Email marketing campaigns
- **EmailLog**: Email delivery and engagement tracking
- **Proposal**: Business proposals and quotes
- **Contract**: Legal contracts and agreements

### Supporting Systems

- **TimeEntry**: Time tracking entries for projects and tasks
- **Invoice**: Client invoices and billing
- **InvoiceItem**: Individual line items within invoices
- **Notification**: User notifications and alerts
- **Report**: Business reports and analytics
- **UserSession**: User authentication sessions
- **ClientPortalAccess**: Client portal access credentials and permissions
- **File**: File attachments and documents
- **AuditLog**: System audit trail and user actions
- **TaskComment**: Comments and discussions on tasks

### Additional Features

- **UserRole**: User roles and permissions
- **LeadImport**: Lead import operations and tracking
- **Community**: Client communities and groups
- **CommunityMembership**: Contact memberships in communities

## Setup Instructions

### 1. Environment Configuration

Copy `env.template` to `.env` and update the values:

```bash
cp env.template .env
```

Update the database connection details in `.env`:

- Set your PostgreSQL connection details
- Generate new APP_KEYS for security
- Set JWT secrets

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Make sure you have PostgreSQL running and create the database:

```sql
CREATE DATABASE xtrawrkx_strapi;
```

### 4. Run Database Migration

```bash
npm run develop
```

This will:

- Create all the database tables based on the content types
- Set up the admin panel
- Start the development server

### 5. Access the Admin Panel

Once running, access the Strapi admin panel at:

```
http://localhost:1337/admin
```

Create your first admin user when prompted.

## Key Features

### Content Management

- Full CRUD operations for all entities
- Rich text editor for proposals, contracts, and content
- File upload and management
- Media library integration

### API Endpoints

All content types are automatically exposed as REST and GraphQL APIs:

- REST: `http://localhost:1337/api/{content-type}`
- GraphQL: `http://localhost:1337/graphql`

### Relations

All relationships from the Prisma schema are preserved:

- One-to-many relations (e.g., Account → Contacts)
- Many-to-many relations (e.g., Users ↔ UserRoles)
- One-to-one relations (e.g., Contact ↔ ClientPortalAccess)

### Authentication & Permissions

- Built-in user authentication
- Role-based access control
- JWT token authentication
- API key authentication

## Development

### Start Development Server

```bash
npm run develop
```

### Build for Production

```bash
npm run build
npm start
```

### Generate Types (if using TypeScript)

```bash
npm run strapi ts:generate-types
```

## Integration with Existing Backend

This Strapi backend can work alongside your existing Prisma-based backend:

1. **Data Synchronization**: Set up webhooks or scheduled jobs to sync data between systems
2. **API Gateway**: Use an API gateway to route requests to appropriate backends
3. **Microservices**: Use Strapi for content management while keeping business logic in the main backend

## Database Migration from Prisma

If you want to migrate existing data from your Prisma database:

1. Export data from your PostgreSQL database
2. Transform the data to match Strapi's structure (mainly ID formats)
3. Import using Strapi's import/export functionality or direct database insertion

## Customization

### Adding Custom Fields

Edit the schema.json files in each content type's directory to add new fields.

### Custom Controllers

Add custom business logic in the controllers directory for each content type.

### Plugins

Install Strapi plugins for additional functionality like email, search, etc.

## Production Deployment

### Environment Variables

Set production environment variables:

- Use strong, unique APP_KEYS
- Set NODE_ENV=production
- Use production database credentials
- Configure proper HOST and PORT

### Database

- Use a production PostgreSQL instance
- Enable SSL if required
- Set up database backups

### Security

- Enable CORS properly
- Set up rate limiting
- Use HTTPS
- Configure proper authentication

This Strapi backend provides a powerful, flexible content management system that mirrors your existing database structure while adding the benefits of a modern headless CMS.



