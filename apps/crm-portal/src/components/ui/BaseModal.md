# BaseModal Component

A foundational modal component that provides consistent styling, behavior, and accessibility features for all modals in the CRM application.

## Features

- **Consistent Design**: Matches the Dashboard theme with glass effects and proper styling
- **Accessibility**: Full keyboard navigation, focus management, and screen reader support
- **Responsive**: Adapts to different screen sizes with proper overflow handling
- **Flexible Sizing**: Two size options for different use cases
- **Smooth Transitions**: Fade-in/out animations with backdrop blur
- **Click Outside to Close**: Intuitive user experience
- **Escape Key Support**: Standard keyboard interaction

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isOpen` | boolean | ✅ | - | Controls modal visibility |
| `onClose` | function | ✅ | - | Callback when modal should close |
| `size` | string | ❌ | 'small' | Modal size ('small' or 'big') |
| `children` | ReactNode | ✅ | - | Content to display inside modal |
| `className` | string | ❌ | '' | Additional CSS classes |

## Size Options

### Small Modal (`size="small"`)
- **Width**: `max-w-md` (28rem / 448px)
- **Use Cases**: Simple confirmations, basic forms, filter dialogs
- **Examples**: Filter modals, confirmation dialogs, simple forms

### Big Modal (`size="big"`)
- **Width**: `max-w-2xl` (42rem / 672px)
- **Use Cases**: Complex forms, detailed views, multi-step processes
- **Examples**: Add/edit forms, detailed views, multi-section forms

## Usage Examples

### Basic Modal
```jsx
import { BaseModal } from '@/components/ui';

function ConfirmModal({ isOpen, onClose }) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="small">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Confirm Action</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to proceed?</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </div>
      </div>
    </BaseModal>
  );
}
```

### Form Modal
```jsx
function AddProjectModal({ isOpen, onClose }) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="big">
      <div className="p-6">
        <h2 id="modal-title" className="text-xl font-semibold mb-4">
          Add New Project
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields */}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Project</Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
}
```

### Filter Modal
```jsx
function FilterModal({ isOpen, onClose, onApply }) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} size="small">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 id="modal-title" className="text-lg font-semibold">Filter Options</h2>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Filter form */}
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onApply}>Apply Filters</Button>
        </div>
      </div>
    </BaseModal>
  );
}
```

## Accessibility Features

### Keyboard Navigation
- **Escape Key**: Closes the modal
- **Tab Navigation**: Proper focus management within modal
- **Focus Trap**: Focus stays within modal when open

### Screen Reader Support
- **ARIA Attributes**: `role="dialog"`, `aria-modal="true"`
- **Modal Title**: Use `id="modal-title"` for proper labeling
- **Close Button**: Include `aria-label="Close modal"`

### Focus Management
- **Auto Focus**: Modal receives focus when opened
- **Body Scroll**: Prevents background scrolling when modal is open
- **Focus Return**: Returns focus to trigger element when closed

## Styling & Theme

### Glass Effect
- **Background**: `bg-white/95 backdrop-blur-xl`
- **Border**: `border border-white/30`
- **Shadow**: `shadow-2xl`
- **Consistent**: Matches Dashboard KPI cards and other glass elements

### Responsive Design
- **Mobile**: Full width with padding on small screens
- **Desktop**: Centered with proper max-width constraints
- **Height**: `max-h-[90vh]` prevents overflow on small screens
- **Overflow**: Proper scrolling for content that exceeds modal height

## Best Practices

### Content Structure
```jsx
<BaseModal isOpen={isOpen} onClose={onClose} size="big">
  {/* Header Section */}
  <div className="p-4 border-b border-gray-200">
    <h2 id="modal-title" className="text-xl font-semibold">Modal Title</h2>
  </div>
  
  {/* Content Section */}
  <div className="flex-1 overflow-y-auto p-4">
    {/* Main content */}
  </div>
  
  {/* Footer Section */}
  <div className="p-4 border-t border-gray-200">
    {/* Action buttons */}
  </div>
</BaseModal>
```

### Form Modals
- Use `size="big"` for forms with multiple fields
- Include proper form validation and error handling
- Provide clear action buttons (Cancel/Save, etc.)
- Use proper form structure with labels and inputs

### Simple Modals
- Use `size="small"` for confirmations and simple interactions
- Keep content concise and focused
- Provide clear action options

## Integration

1. **Import the component**:
```jsx
import { BaseModal } from '@/components/ui';
```

2. **Wrap your content**:
```jsx
<BaseModal isOpen={isOpen} onClose={onClose} size="small">
  {/* Your modal content */}
</BaseModal>
```

3. **Handle state**:
```jsx
const [isModalOpen, setIsModalOpen] = useState(false);

const handleClose = () => setIsModalOpen(false);
```

## Benefits

- **Consistency**: All modals have identical styling and behavior
- **Accessibility**: Built-in keyboard navigation and screen reader support
- **Maintainability**: Single source of truth for modal functionality
- **Performance**: Optimized with proper focus management and cleanup
- **User Experience**: Smooth transitions and intuitive interactions
- **Developer Experience**: Simple API with flexible content rendering
