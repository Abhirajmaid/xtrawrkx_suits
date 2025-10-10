# ModernButton Component

A flexible, modern button component for the client portal with gradient styles, multiple variants, and consistent design patterns.

## Features

- **Multiple Types**: Primary, Secondary, Tertiary, Ghost, Gradient, Success, Warning, Danger
- **Size Variants**: xs, sm, md (default), lg, xl
- **Shape Options**: Pill (default), Rounded, Square
- **Icons**: Support for leading icons and trailing arrows
- **Link Support**: Can render as Next.js Link or button element
- **Accessibility**: Focus states, disabled states, and proper ARIA attributes

## Basic Usage

```jsx
import ModernButton from '@/components/ui/ModernButton';
// or
import { ModernButton, PrimaryButton, SecondaryButton } from '@/components/ui';

// Basic primary button
<ModernButton text="Click Me" />

// With icon
<ModernButton
  type="primary"
  icon={Calendar}
  text="Schedule Meeting"
/>

// As a link
<ModernButton
  type="secondary"
  text="Learn More"
  link="/about"
/>

// Hide arrow
<ModernButton
  type="primary"
  text="Save"
  hideArrow
/>
```

## Button Types

### Primary (Default)

Pink to red gradient with white text

```jsx
<ModernButton type="primary" text="Primary Action" />
```

### Secondary

White background with glassmorphism effect

```jsx
<ModernButton type="secondary" text="Secondary Action" />
```

### Gradient

Blue to purple gradient with special arrow animation

```jsx
<ModernButton type="gradient" text="Gradient Button" />
```

### Success

Green gradient for positive actions

```jsx
<ModernButton type="success" text="Save Changes" />
```

### Warning

Yellow to orange gradient for caution actions

```jsx
<ModernButton type="warning" text="Warning Action" />
```

### Danger

Red gradient for destructive actions

```jsx
<ModernButton type="danger" text="Delete Item" />
```

## Size Variants

```jsx
<ModernButton size="xs" text="Extra Small" />
<ModernButton size="sm" text="Small" />
<ModernButton size="md" text="Medium (Default)" />
<ModernButton size="lg" text="Large" />
<ModernButton size="xl" text="Extra Large" />
```

## Shape Variants

```jsx
<ModernButton variant="pill" text="Pill Shape (Default)" />
<ModernButton variant="rounded" text="Rounded Corners" />
<ModernButton variant="square" text="Square Corners" />
```

## Convenience Components

```jsx
import {
  PrimaryButton,
  SecondaryButton,
  GradientButton,
  SuccessButton,
  WarningButton,
  DangerButton
} from '@/components/ui';

<PrimaryButton text="Primary" />
<SecondaryButton text="Secondary" />
<GradientButton text="Gradient" />
<SuccessButton text="Success" />
<WarningButton text="Warning" />
<DangerButton text="Danger" />
```

## Props

| Prop        | Type      | Default   | Description                                                                           |
| ----------- | --------- | --------- | ------------------------------------------------------------------------------------- |
| `text`      | string    | -         | Button text content                                                                   |
| `children`  | ReactNode | -         | Alternative to text prop                                                              |
| `type`      | string    | 'primary' | Button type (primary, secondary, tertiary, ghost, gradient, success, warning, danger) |
| `size`      | string    | 'md'      | Button size (xs, sm, md, lg, xl)                                                      |
| `variant`   | string    | 'pill'    | Button shape (pill, rounded, square)                                                  |
| `icon`      | Component | -         | Leading icon component                                                                |
| `hideArrow` | boolean   | false     | Hide the trailing arrow icon                                                          |
| `link`      | string    | -         | If provided, renders as Next.js Link                                                  |
| `onClick`   | function  | -         | Click handler                                                                         |
| `disabled`  | boolean   | false     | Disabled state                                                                        |
| `className` | string    | ''        | Additional CSS classes                                                                |

## Examples in Dashboard

The ModernButton is used throughout the dashboard:

```jsx
// Header actions
<ModernButton type="secondary" icon={Calendar} text="Calendar" hideArrow />
<ModernButton type="primary" text="New Project" />

// Community section
<ModernButton type="primary" text="Join Community" />

// Project actions
<ModernButton type="secondary" icon={Folder} text="View All" hideArrow />
<ModernButton type="primary" size="sm" text="View Details" />
```

## Styling

The component uses Tailwind CSS classes and includes:

- Gradient backgrounds for primary actions
- Glassmorphism effects for secondary buttons
- Smooth hover transitions
- Focus states for accessibility
- Responsive sizing
- Icon animations on hover


