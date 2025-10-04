
# Spacing & Layout Grid System

**Document Version:** 1.0  
**Last Updated:** 2025-10-04  

## Overview

This document defines the spacing and layout grid system for CodeLingo, establishing consistent spatial relationships and visual hierarchy across all interface elements. The system is built on an **8px base unit** following industry best practices for scalability and responsive design.

---
---
---
# TLDR.: Quick Reference
 
## Best Practices

### DO ✅

1. **Always use defined spacing tokens** - Never use arbitrary pixel values
2. **Maintain spacing hierarchy** - Larger spacing for less related elements
3. **Use internal ≤ external rule** - Padding should not exceed margin
4. **Test on multiple screen sizes** - Verify spacing scales appropriately
5. **Use rem units** - Better for accessibility and responsive scaling
6. **Follow component patterns** - Reuse established spacing patterns
7. **Document exceptions** - If you deviate from the system, explain why

### DON'T ❌

1. **Don't use random spacing values** - Stick to the spacing scale
2. **Don't use similar spacing values** - 20px and 24px are too close
3. **Don't forget mobile** - Test tight spacing on small screens
4. **Don't nest tight spacing** - Avoid multiple layers of 4px spacing
5. **Don't ignore context** - Adjust spacing based on content density
6. **Don't hardcode breakpoints** - Use defined breakpoint variables
7. **Don't split pixels** - Always use multiples of 4px minimum

---

### Most Common Spacing Values

| Use Case | Token | Value |
|----------|-------|-------|
| Icon-text gap | `$space-1` | 4px |
| List items | `$space-2` | 8px |
| Button padding | `$space-3` | 12px |
| Card padding (mobile) | `$space-4` | 16px |
| Card padding (desktop) | `$space-5` | 24px |
| Section spacing | `$space-6` | 32px |
| Page sections | `$space-8` | 48px |

### Responsive Container Padding

| Screen Size | Padding |
|-------------|---------|
| Mobile (< 768px) | `$space-4` (16px) |
| Tablet (768-1279px) | `$space-6` (32px) |
| Desktop (1280px+) | `$space-8` (48px) |
---
---
---

## Base Unit System

### Core Principle: 8px Grid

CodeLingo uses an **8px base unit** as the foundation for all spacing decisions. This system:
- Ensures visual consistency across all screen sizes
- Prevents sub-pixel rendering issues
- Scales cleanly at common display densities (1x, 1.5x, 2x)
- Aligns with most modern design systems (Material Design, Carbon, Atlassian)

### Why 8px?

- **Mathematical clarity**: Easy to calculate and multiply (8, 16, 24, 32...)
- **Visual distinction**: Differences between spacing values are immediately recognizable
- **Responsive scaling**: Divides evenly for common screen widths
- **Alignment**: Works seamlessly with typography line heights and component heights

---

## Spacing Scale

### Primary Spacing Tokens

All spacing values are multiples of the 8px base unit. Use these tokens consistently throughout the application.

| Token | Value (px) | Value (rem) | Use Case |
|-------|-----------|-------------|----------|
| `$space-0` | 0 | 0 | No spacing (reset) |
| `$space-1` | 4 | 0.25 | Smallest spacing, icon-text gaps |
| `$space-2` | 8 | 0.5 | Tight internal spacing, small padding |
| `$space-3` | 12 | 0.75 | Button padding, input padding |
| `$space-4` | 16 | 1 | Default component padding, list item spacing |
| `$space-5` | 24 | 1.5 | Card padding, section spacing within components |
| `$space-6` | 32 | 2 | Component separation, form field groups |
| `$space-7` | 40 | 2.5 | Section headers, large component spacing |
| `$space-8` | 48 | 3 | Major section separation |
| `$space-9` | 64 | 4 | Page section separation, layout gaps |
| `$space-10` | 80 | 5 | Extra-large section spacing |
| `$space-12` | 96 | 6 | Maximum spacing, hero section gaps |

### Half-Step Exception: 4px

A **4px half-step** (`$space-1`) is available for:
- Icon-to-text spacing in buttons
- Small inline elements
- Fine-tuning tight layouts

**Important:** Use sparingly and only when 8px increments are too large.

---

## Spacing Hierarchy Rules

### Internal ≤ External Principle

Follow this fundamental rule for balanced layouts:

**Internal spacing (padding) should be equal to or less than external spacing (margin)**

This creates clear visual grouping and prevents claustrophobic designs.

**Example:**
Component padding: 16px ($space-4)
Component margin: 24px ($space-5) or greater



### Gestalt Principle of Proximity

Use spacing to communicate relationships:

- **Related elements**: Use smaller spacing (4-16px)
- **Grouped elements**: Use medium spacing (16-32px)
- **Separate sections**: Use larger spacing (32-64px)
- **Major divisions**: Use maximum spacing (64-96px)

**Example Applications:**
- Icon + Label in button: 4px
- Form field label + input: 8px
- Form fields within group: 16px
- Form groups within form: 24px
- Form sections on page: 48px

---

## Component Spacing Standards

### Buttons

// Button internal spacing
padding: $space-3 $space-4; // 12px vertical, 16px horizontal

// Icon + text in button
gap: $space-1; // 4px

// Button group spacing
gap: $space-2; // 8px



### Cards

// Card padding
padding: $space-4; // 16px on mobile
padding: $space-5; // 24px on tablet+

// Card to card spacing
gap: $space-5; // 24px
margin-bottom: $space-5;



### Forms

// Label to input
margin-bottom: $space-2; // 8px

// Input fields within group
margin-bottom: $space-4; // 16px

// Form sections
margin-bottom: $space-6; // 32px

// Form buttons
margin-top: $space-6; // 32px
gap: $space-3; // 12px between buttons



### Lists

// List item padding
padding: $space-3 $space-4; // 12px vertical, 16px horizontal

// List item separation
gap: $space-1; // 4px for tight lists
gap: $space-2; // 8px for standard lists



### Navigation

// Nav item padding
padding: $space-3 $space-4; // 12px vertical, 16px horizontal

// Nav item spacing
gap: $space-1; // 4px for compact nav
gap: $space-2; // 8px for standard nav



### Page Layout

// Page container padding
padding: $space-4; // 16px on mobile
padding: $space-6; // 32px on tablet
padding: $space-8; // 48px on desktop

// Major section separation
margin-bottom: $space-8; // 48px on mobile
margin-bottom: $space-9; // 64px on tablet+




---



## Implementation Guidelines

### SCSS Variables

// Spacing scale
$space-0: 0;
$space-1: 0.25rem; // 4px
$space-2: 0.5rem; // 8px
$space-3: 0.75rem; // 12px
$space-4: 1rem; // 16px
$space-5: 1.5rem; // 24px
$space-6: 2rem; // 32px
$space-7: 2.5rem; // 40px
$space-8: 3rem; // 48px
$space-9: 4rem; // 64px
$space-10: 5rem; // 80px
$space-12: 6rem; // 96px

// Breakpoints
$breakpoint-sm: 480px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-xxl: 1440px;



### CSS Custom Properties

:root {
/* Spacing scale */
--space-0: 0;
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-5: 1.5rem;
--space-6: 2rem;
--space-7: 2.5rem;
--space-8: 3rem;
--space-9: 4rem;
--space-10: 5rem;
--space-12: 6rem;
}



### Angular/TypeScript

// spacing.constants.ts
export const SPACING = {
0: '0',
1: '0.25rem',
2: '0.5rem',
3: '0.75rem',
4: '1rem',
5: '1.5rem',
6: '2rem',
7: '2.5rem',
8: '3rem',
9: '4rem',
10: '5rem',
12: '6rem',
} as const;

export const BREAKPOINTS = {
sm: 480,
md: 768,
lg: 1024,
xl: 1280,
xxl: 1440,
} as const;



---

## Usage Examples

### Example 1: Practice Mode Question Card

.question-card {
padding: $space-5; // 24px card padding
margin-bottom: $space-6; // 32px separation from other elements

.question-text {
margin-bottom: $space-4; // 16px below question
}

.answer-options {
display: flex;
flex-direction: column;
gap: $space-2; // 8px between options
margin-bottom: $space-5; // 24px above submit button
}

.submit-button {
padding: $space-3 $space-4; // 12px vertical, 16px horizontal
margin-top: $space-5; // 24px separation
}
}



### Example 2: User Registration Form

.registration-form {
max-width: 480px;
padding: $space-6; // 32px form padding

.form-section {
margin-bottom: $space-6; // 32px between sections


.form-field {
  margin-bottom: $space-4; // 16px between fields
  
  label {
    margin-bottom: $space-2; // 8px label spacing
  }
  
  input {
    padding: $space-3 $space-4; // 12px vertical, 16px horizontal
  }
}
}

.form-actions {
margin-top: $space-6; // 32px separation from form
display: flex;
gap: $space-3; // 12px between buttons
}
}



### Example 3: Admin Dashboard Layout

.admin-dashboard {
padding: $space-6; // 32px page padding

@media (min-width: $breakpoint-lg) {
padding: $space-8; // 48px on desktop
}

.dashboard-header {
margin-bottom: $space-8; // 48px separation
}

.dashboard-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
gap: $space-5; // 24px between grid items
}

.stat-card {
padding: $space-5; // 24px card padding


.stat-value {
  margin-bottom: $space-2; // 8px below value
}
}
}


