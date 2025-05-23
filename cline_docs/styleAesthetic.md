# Taskify Pro - Style & Aesthetic Guidelines

## Design System Overview

Taskify Pro follows a cohesive design system that emphasizes clarity, accessibility, and a modern aesthetic. This document outlines the design principles, component styles, and visual language used throughout the application.

## Design Principles

### 1. Clarity First
- Clear visual hierarchy to guide users through tasks
- Intuitive interfaces that require minimal learning
- Purposeful use of space and typography

### 2. Consistency
- Unified visual language across all screens
- Predictable interaction patterns
- Consistent component usage

### 3. Accessibility
- High contrast for readability
- Multiple theme options for different preferences
- Support for reduced motion
- Keyboard navigable interfaces

### 4. Delight
- Subtle animations and transitions
- Rewarding feedback for achievements
- Playful elements like pet companions

## Color System

### Base Colors

#### Light Theme
- **Background**: `#ffffff` - Clean white background for content
- **Foreground**: `#0f172a` - Dark text for readability
- **Primary**: `#0ea5e9` - Vibrant blue for primary actions and focus
- **Secondary**: `#6366f1` - Purple for secondary elements
- **Accent**: `#f59e0b` - Warm orange for highlights and accents
- **Muted**: `#94a3b8` - Subtle gray for less important elements

#### Dark Theme
- **Background**: `#0f172a` - Deep blue-gray background
- **Foreground**: `#f8fafc` - Light text for readability
- **Primary**: `#38bdf8` - Bright blue for primary actions
- **Secondary**: `#818cf8` - Lighter purple for secondary elements
- **Accent**: `#fbbf24` - Bright amber for highlights
- **Muted**: `#64748b` - Medium gray for less important elements

#### Sunset Glow Theme (Premium)
- **Background**: `#1e1b4b` - Deep indigo background
- **Foreground**: `#fef2f2` - Soft white text
- **Primary**: `#f97316` - Vibrant orange for primary actions
- **Secondary**: `#c026d3` - Rich magenta for secondary elements
- **Accent**: `#eab308` - Golden yellow for highlights
- **Muted**: `#9ca3af` - Neutral gray for less important elements

### Semantic Colors

- **Success**: `#10b981` - Green for success states and completion
- **Warning**: `#f59e0b` - Amber for warnings and caution
- **Destructive**: `#ef4444` - Red for errors and destructive actions
- **Info**: `#3b82f6` - Blue for informational elements

### Priority Colors

- **High Priority**: `#ef4444` - Red to indicate urgency
- **Medium Priority**: `#f59e0b` - Amber for moderate importance
- **Low Priority**: `#10b981` - Green for less urgent tasks

## Typography

### Font Family
- **Primary**: System font stack (San Francisco on macOS/iOS, Segoe UI on Windows, Roboto on Android)
- **Monospace**: Consolas, Monaco, 'Andale Mono', monospace (for code blocks)

### Font Sizes
- **xs**: 0.75rem (12px) - Very small text, footnotes
- **sm**: 0.875rem (14px) - Secondary text, labels
- **base**: 1rem (16px) - Body text
- **lg**: 1.125rem (18px) - Large body text
- **xl**: 1.25rem (20px) - Subheadings
- **2xl**: 1.5rem (24px) - Headings
- **3xl**: 1.875rem (30px) - Major headings
- **4xl**: 2.25rem (36px) - Page titles

### Font Weights
- **normal**: 400 - Regular text
- **medium**: 500 - Slightly emphasized text
- **semibold**: 600 - Subheadings
- **bold**: 700 - Headings and important text

### Line Heights
- **tight**: 1.25 - Headings
- **normal**: 1.5 - Body text
- **relaxed**: 1.75 - Long-form content

## Spacing System

Taskify Pro uses a consistent spacing scale based on 4px increments:

- **px**: 1px - Borders
- **0.5**: 0.125rem (2px) - Tiny spacing
- **1**: 0.25rem (4px) - Very small spacing
- **2**: 0.5rem (8px) - Small spacing
- **3**: 0.75rem (12px) - Medium-small spacing
- **4**: 1rem (16px) - Base spacing
- **5**: 1.25rem (20px) - Medium spacing
- **6**: 1.5rem (24px) - Medium-large spacing
- **8**: 2rem (32px) - Large spacing
- **10**: 2.5rem (40px) - Very large spacing
- **12**: 3rem (48px) - Extra large spacing
- **16**: 4rem (64px) - Huge spacing

## Border Radius

- **none**: 0 - No rounding
- **sm**: 0.125rem (2px) - Slight rounding
- **default**: 0.25rem (4px) - Default rounding
- **md**: 0.375rem (6px) - Medium rounding
- **lg**: 0.5rem (8px) - Large rounding
- **xl**: 0.75rem (12px) - Extra large rounding
- **2xl**: 1rem (16px) - Very large rounding
- **full**: 9999px - Circular elements

## Shadows

- **sm**: Small shadow for subtle elevation
- **md**: Medium shadow for cards and dropdowns
- **lg**: Large shadow for modals and popovers
- **xl**: Extra large shadow for high-elevation elements
- **inner**: Inset shadow for pressed states
- **none**: No shadow

## Component Styles

### Buttons

#### Primary Button
- Background: Primary color
- Text: White
- Hover: Slightly darker primary color
- Active: Even darker primary color
- Disabled: Muted color with reduced opacity

#### Secondary Button
- Background: Transparent
- Border: Primary color
- Text: Primary color
- Hover: Light primary color background
- Active: Slightly darker primary color background

#### Ghost Button
- Background: Transparent
- Text: Foreground color
- Hover: Very light background
- Active: Light background

#### Destructive Button
- Background: Destructive color
- Text: White
- Hover: Darker destructive color
- Active: Even darker destructive color

### Cards

- Background: Background color
- Border: Very light border
- Border Radius: lg (0.5rem)
- Shadow: sm for default, md for hover
- Padding: 6 (1.5rem)

### Forms

#### Inputs
- Background: Background color
- Border: Light border
- Border Radius: md (0.375rem)
- Focus: Primary color border, light primary color ring
- Padding: 3 (0.75rem) vertical, 4 (1rem) horizontal

#### Select
- Similar to inputs
- Dropdown with light shadow
- Selected item highlighted with light primary color

#### Checkbox & Radio
- Border: Light border
- Checked: Primary color background
- Focus: Light primary color ring

### Navigation

#### Sidebar
- Background: Slightly darker than main background
- Selected Item: Light primary color background
- Hover: Very light background
- Icons: Muted color, primary color when selected

#### Tabs
- Inactive: Muted color text
- Active: Primary color text, bottom border
- Hover: Slightly darker than muted color

### Feedback & Alerts

#### Toast Notifications
- Success: Success color background
- Error: Destructive color background
- Warning: Warning color background
- Info: Info color background
- Border Radius: lg (0.5rem)
- Shadow: lg

#### Dialog/Modal
- Background: Background color
- Border: Light border
- Border Radius: xl (0.75rem)
- Shadow: xl
- Overlay: Semi-transparent black

## Animation & Motion

### Transitions
- **fast**: 150ms - Quick interactions (hover, focus)
- **normal**: 250ms - Standard transitions (opening small components)
- **slow**: 350ms - More noticeable transitions (modals, page transitions)

### Easing
- **default**: cubic-bezier(0.4, 0, 0.2, 1) - Smooth, natural motion
- **in**: cubic-bezier(0.4, 0, 1, 1) - Accelerating motion
- **out**: cubic-bezier(0, 0, 0.2, 1) - Decelerating motion
- **in-out**: cubic-bezier(0.4, 0, 0.2, 1) - Accelerating and decelerating

### Animation Types
- Fade in/out for appearing/disappearing
- Slide for panels and drawers
- Scale for emphasis
- Bounce for playful feedback (achievements, pet companion)

### Reduced Motion
- Simpler transitions when reduced motion is preferred
- Essential motion only
- No bounces or elaborate animations

## Icons

- **System**: Lucide React icons for consistency
- **Size**: 
  - **sm**: 1rem (16px) - Small contexts
  - **md**: 1.25rem (20px) - Standard size
  - **lg**: 1.5rem (24px) - Emphasis
  - **xl**: 2rem (32px) - Major features

## Layout Guidelines

### Responsive Breakpoints
- **sm**: 640px - Small devices
- **md**: 768px - Medium devices
- **lg**: 1024px - Large devices
- **xl**: 1280px - Extra large devices
- **2xl**: 1536px - Very large devices

### Grid System
- 12-column grid for complex layouts
- Flexbox for simpler arrangements
- Consistent gutters (4, 6, or 8 spacing units)

### Page Structure
- Sidebar navigation (collapsible on mobile)
- Header with user info and global actions
- Main content area with appropriate padding
- Responsive adjustments at breakpoints

## UI Patterns

### Task Cards
- Clear visual hierarchy with title prominence
- Color-coded priority indicators
- Due date clearly visible
- Action buttons for common operations
- Status indicator

### Achievement Cards
- Visual reward imagery
- Clear progress indicators
- Unlock conditions displayed
- Points value prominently shown

### Analytics Visualizations
- Clear labels and legends
- Consistent color coding
- Appropriate chart types for data
- Interactive elements for exploration

### Forms
- Single column layout for simplicity
- Logical grouping of related fields
- Clear error states
- Progressive disclosure for complex forms

## Gamification Elements

### Points System
- Points displayed prominently in header
- Points awarded with animation and feedback
- Clear indication of points value for actions

### Achievements
- Trophy or badge visual
- Progress tracking for multi-stage achievements
- Celebration animation on unlock
- Gallery view for collection

### Pet Companions
- Playful animations
- Positive reinforcement messages
- Collapsible to avoid distraction

## Accessibility Considerations

### Color Contrast
- All text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- Interactive elements have sufficient contrast
- Non-color indicators for state changes

### Focus Styles
- Clear focus indicators for keyboard navigation
- Focus visible at all times when using keyboard
- Custom focus styles that maintain visibility in all themes

### Motion
- Respects user's motion preferences
- Alternative static states for animations
- No essential information conveyed through motion alone

### Screen Readers
- Semantic HTML structure
- ARIA labels where needed
- Meaningful alt text for images
- Proper heading hierarchy

## Implementation Notes

### CSS Framework
- Tailwind CSS for utility-first styling
- Custom theme configuration for brand colors
- Component-specific styles when needed

### Theme Implementation
- CSS variables for theme values
- Dark mode using `dark:` variant
- Custom theme using class-based approach

### Responsive Strategy
- Mobile-first approach
- Strategic breakpoints for layout changes
- Flexbox and Grid for responsive layouts
