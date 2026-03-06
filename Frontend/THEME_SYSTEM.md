# Theme System Documentation

## Overview
This project uses a centralized CSS variable system with support for light and dark themes. All styling is responsive with a mobile-first approach.

## File Structure

```
src/
├── styles/
│   ├── theme.css          # Central theme variables (colors, spacing, fonts, etc.)
│   ├── globals.css        # Global styles and base setup
│   ├── Home.css           # Home page styles
│   └── Auth.css           # Login/Register page styles
├── context/
│   └── ThemeContext.jsx   # Theme provider and context
├── hooks/
│   └── useTheme.js        # Alternative hook for theme usage
└── App.jsx                # App component with ThemeProvider
```

## CSS Variables

### Colors
```css
/* Primary Colors */
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--primary-main: #667eea;
--primary-dark: #764ba2;
--primary-light: #7c8ff5;

/* Backgrounds */
--bg-primary: #ffffff;        /* Light theme */
--bg-secondary: #f5f7fa;
--bg-tertiary: #e8eef7;

/* Text */
--text-primary: #1a1a2e;
--text-secondary: #4a4a6a;
--text-tertiary: #9ca3af;

/* Status Colors */
--error: #ef4444;
--success: #10b981;
--warning: #f59e0b;
```

### Spacing Scale
```css
--spacing-xs: 0.25rem;    /* 4px */
--spacing-sm: 0.5rem;     /* 8px */
--spacing-md: 1rem;       /* 16px */
--spacing-lg: 1.5rem;     /* 24px */
--spacing-xl: 2rem;       /* 32px */
--spacing-2xl: 3rem;      /* 48px */
```

### Border Radius
```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
```

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.15);
--shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.2);
```

### Typography
```css
--font-xs: 0.75rem;       /* 12px */
--font-sm: 0.875rem;      /* 14px */
--font-base: 1rem;        /* 16px */
--font-lg: 1.125rem;      /* 18px */
--font-xl: 1.25rem;       /* 20px */
--font-2xl: 1.5rem;       /* 24px */
--font-3xl: 1.875rem;     /* 30px */
--font-4xl: 2.25rem;      /* 36px */
--font-5xl: 3rem;         /* 48px */

--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Transitions
```css
--transition-fast: 0.15s ease-in-out;
--transition-base: 0.3s ease-in-out;
--transition-slow: 0.5s ease-in-out;
```

## Dark Theme Support

Dark theme automatically applies when:
1. User saves preference to localStorage
2. System preference is set to dark mode
3. `data-theme="dark"` attribute is set on `<html>` element

### Customizing Theme Variables
All variables defined in `:root` have a dark theme counterpart in `[data-theme='dark']` selector.

## Using the Theme System

### Option 1: Using ThemeContext
```jsx
import { useThemeContext } from '@/context/ThemeContext'

function MyComponent() {
  const { theme, toggleTheme, isDark } = useThemeContext()

  return (
    <button onClick={toggleTheme}>
      Switch to {isDark ? 'Light' : 'Dark'} Theme
    </button>
  )
}
```

### Option 2: Using useTheme Hook
```jsx
import useTheme from '@/hooks/useTheme'

function MyComponent() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button onClick={toggleTheme}>
      Current: {theme}
    </button>
  )
}
```

### Using CSS Variables in Styles
```css
.my-component {
  color: var(--text-primary);
  background: var(--bg-secondary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}
```

## Responsive Design

The design follows a **mobile-first approach** with breakpoints:

| Breakpoint | Size | Usage |
|-----------|------|-------|
| Mobile | < 640px | Base styles |
| Tablet | 640px - 1023px | 2-column/enhanced spacing |
| Desktop | 1024px - 1279px | Full 3-column/max layouts |
| Large Desktop | 1280px+ | Extra refinements |

### Mobile-First Pattern
```css
/* Mobile (default) */
.container {
  grid-template-columns: 1fr;
  padding: var(--spacing-md);
}

/* Tablet and up */
@media (min-width: 640px) {
  .container {
    grid-template-columns: repeat(2, 1fr);
    padding: var(--spacing-xl);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## Accessibility Features

- **Reduced Motion Support**: Transitions disable for users with `prefers-reduced-motion`
- **High Contrast Support**: Enhanced shadows for high contrast mode
- **Semantic HTML**: All components use proper semantic elements
- **Color Contrast**: All text meets WCAG AA standards

## Best Practices

1. **Always use CSS variables** - No hardcoded colors/spacing
2. **Mobile-first styling** - Default to mobile, enhance for larger screens
3. **Consistent spacing** - Use the spacing scale (xs, sm, md, lg, xl, 2xl)
4. **Meaningful transitions** - Use `--transition-base` for most changes
5. **Shadows for depth** - Use shadow variables for consistent elevations
6. **Semantic colors** - Use `--error`, `--success`, `--warning` for feedback

## Example: Creating a New Component

```jsx
// Button.jsx
import './Button.css'

function Button({ variant = 'primary', children, ...props }) {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  )
}
```

```css
/* Button.css */
@import url('./theme.css');

.btn {
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-primary {
  background: var(--primary-gradient);
  color: white;
}

.btn-primary:hover {
  box-shadow: var(--shadow-lg);
}

@media (max-width: 640px) {
  .btn {
    width: 100%;
  }
}
```

## Testing Dark Theme

To test dark theme locally:
1. Open DevTools Console
2. Run: `document.documentElement.setAttribute('data-theme', 'dark')`
3. Or set `app-theme` in localStorage: `localStorage.setItem('app-theme', 'dark')`
