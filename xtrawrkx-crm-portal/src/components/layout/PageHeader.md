# PageHeader Component

A reusable header component that provides a consistent layout and styling across all main pages in the CRM application.

## Features

- **Consistent Design**: Matches the Dashboard header design exactly
- **Flexible Actions**: Configurable action buttons (filter, export, new)
- **Dynamic Breadcrumbs**: Automatically generates breadcrumb navigation
- **Search Integration**: Built-in search functionality with customizable placeholder
- **User Profile**: Integrated user profile dropdown
- **Glass Effects**: Modern glass morphism design with backdrop blur

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | string | ✅ | - | Main page heading |
| `subtitle` | string | ✅ | - | Descriptive text below title |
| `breadcrumbs` | string[] | ✅ | [] | Array of breadcrumb items |
| `actions` | string[] | ❌ | [] | Action buttons to display ('filter', 'export', 'new') |
| `searchPlaceholder` | string | ❌ | "Search..." | Placeholder text for search input |
| `onSearch` | function | ❌ | - | Callback when search query changes |
| `onFilter` | function | ❌ | - | Callback when filter button is clicked |
| `onExport` | function | ❌ | - | Callback when export button is clicked |
| `onNew` | function | ❌ | - | Callback when new button is clicked |

## Usage Examples

### Basic Usage
```jsx
import { PageHeader } from '@/components/layout';

<PageHeader
  title="Projects"
  subtitle="Manage and track all your projects"
  breadcrumbs={['Dashboard', 'Delivery', 'Projects']}
/>
```

### With Actions
```jsx
<PageHeader
  title="Leads"
  subtitle="Track and manage your sales leads"
  breadcrumbs={['Dashboard', 'Sales', 'Leads']}
  actions={['filter', 'export', 'new']}
  onFilter={() => setIsFilterModalOpen(true)}
  onExport={() => handleExport()}
  onNew={() => setIsModalOpen(true)}
/>
```

### With Search
```jsx
<PageHeader
  title="Clients"
  subtitle="Manage your client relationships"
  breadcrumbs={['Dashboard', 'Clients']}
  actions={['filter', 'new']}
  searchPlaceholder="Search clients..."
  onSearch={(query) => setSearchQuery(query)}
  onFilter={() => setIsFilterModalOpen(true)}
  onNew={() => setIsModalOpen(true)}
/>
```

### Sales Page Example
```jsx
<PageHeader
  title="Deals"
  subtitle="Manage your sales pipeline"
  breadcrumbs={['Dashboard', 'Sales', 'Deals']}
  actions={['filter', 'export', 'new']}
  searchPlaceholder="Search deals..."
  onSearch={setSearchQuery}
  onFilter={() => setIsFilterModalOpen(true)}
  onExport={() => handleExport()}
  onNew={() => setIsModalOpen(true)}
/>
```

## Action Types

The `actions` prop accepts an array of strings:

- **`'filter'`**: Shows a filter icon button
- **`'export'`**: Shows an export/download icon button  
- **`'new'`**: Shows a plus icon button (styled with brand primary color)

## Styling

The component uses the application's design system:

- **Glass Effect**: `Card glass={true}` with backdrop blur
- **Typography**: `text-5xl font-light` for title, `text-brand-text-light` for subtitle
- **Colors**: Brand colors for primary elements, glass effects for backgrounds
- **Responsive**: Hidden search bar on mobile, responsive user profile
- **Animations**: Smooth transitions and hover effects

## Integration

1. Import the component:
```jsx
import { PageHeader } from '@/components/layout';
```

2. Replace existing header code with the PageHeader component
3. Configure props based on your page requirements
4. Handle action callbacks in your page component

## Benefits

- **Consistency**: All pages have identical header styling and behavior
- **Maintainability**: Single source of truth for header design
- **Flexibility**: Configurable actions and search functionality
- **Performance**: Optimized component with proper state management
- **Accessibility**: Proper keyboard navigation and screen reader support
