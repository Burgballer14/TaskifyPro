# Taskify Pro - Codebase Summary

## Project Structure Overview

The Taskify Pro application follows a well-organized structure based on Next.js App Router conventions and feature-based organization:

```
/src
  /ai              # AI integration for daily summaries
  /app             # Next.js App Router pages and layouts
    /dashboard     # Dashboard routes (tasks, analytics, etc.)
  /components      # React components
    /ui            # Reusable UI components (shadcn/ui)
    /tasks         # Task-related components
    /analytics     # Analytics-related components
    /achievements  # Achievement-related components
    /calendar      # Calendar-related components
    /weekly        # Weekly view components
  /hooks           # Custom React hooks
  /lib             # Utility functions and constants
  /types           # TypeScript type definitions
```

## Key Components and Their Interactions

### Core Layout Components
- **DashboardLayout**: Main layout wrapper providing sidebar navigation, theme switching, and pet companion integration.
- **SidebarNav**: Navigation component for dashboard sections.
- **PageHeader**: Consistent header for all dashboard pages.

### Task Management
- **TaskList**: Main component for displaying, filtering, and sorting tasks.
- **TaskCard**: Card component for individual task display with actions.
- **NewTaskForm**: Form for creating and editing tasks.
- **task-storage.ts**: Utility for localStorage persistence of tasks.

### Analytics
- **AnalyticsOverview**: Dashboard for productivity metrics and insights.
- **Chart Components**: Various chart components for data visualization.
- **ThemeUnlockCard**: Store interface for unlocking themes and pets.

### Achievements
- **AchievementCard**: Display component for achievements and progress.
- **achievements-data.ts**: Achievement definitions and unlock logic.

### Gamification
- **PetCompanionDisplay**: Interactive pet companion feature.
- **useDailyStreak**: Hook for tracking user login streaks.

## Data Flow

### Task Management Flow
1. Tasks are stored in localStorage using the `task-storage.ts` utilities.
2. The `TaskList` component loads tasks and provides filtering/sorting.
3. User interactions (create, edit, complete) update the task state.
4. Changes are persisted to localStorage and may trigger achievement unlocks.
5. Task completion awards points that can be spent in the store.

### Achievement System Flow
1. Achievements are defined in `achievements-data.ts`.
2. User actions (completing tasks, login streaks) trigger achievement checks.
3. Unlocked achievements are stored in localStorage.
4. Achievement unlocks award points and display toast notifications.
5. Achievement cards display progress toward multi-stage achievements.

### Theme and Customization Flow
1. User earns points through task completion and achievements.
2. Points can be spent in the store to unlock themes and pets.
3. Selected theme is applied globally through the theme context.
4. Pet companions can be activated and appear on the tasks page.

## External Dependencies

### UI Framework
- **shadcn/ui**: Collection of accessible UI components built on Radix UI.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Lucide React**: Icon library for consistent iconography.

### Date Handling
- **date-fns**: Library for date manipulation and formatting.

### AI Integration
- **AI-generated daily summaries**: Personalized productivity insights.

## Recent Significant Changes

### Performance Optimization
1. Implemented memoization for expensive calculations in TaskList component.
2. Created useThrottledStorage hook for efficient localStorage operations.
3. Enhanced error handling in storage operations.
4. Added reduced motion preference detection for accessibility.

### Accessibility Improvements
1. Added skip link for keyboard navigation.
2. Improved focus management throughout the application.
3. Enhanced ARIA attributes for better screen reader support.

### Documentation
1. Created comprehensive documentation in the cline_docs folder:
   - Project roadmap and goals
   - Technology stack and architecture decisions
   - Style and aesthetic guidelines
   - Security protocols
   - Performance optimization strategies
   - Accessibility guidelines
   - Deployment checklist

## User Feedback Integration

User feedback has led to several improvements:
1. Enhanced task filtering and sorting options
2. Added recurring tasks functionality
3. Improved visual distinction between task priorities
4. Added pet companion feature for engagement
5. Implemented theme customization options

## Performance Considerations

### Current Optimizations
- Memoization of filtered and sorted tasks
- Throttled localStorage operations
- Optimized rendering with proper dependency arrays
- Reduced motion options for animations

### Areas for Further Optimization
- Virtualization for long lists
- Code splitting for non-critical components
- Further optimization of useEffect dependencies
- Implementation of React.memo for pure components

## Security Measures

### Data Storage
- All data is stored locally in the browser's localStorage
- No sensitive data is collected or stored
- Future backend integration will require proper authentication and authorization

### Input Validation
- Basic validation for task creation and editing
- Sanitization of user inputs to prevent XSS attacks

### Future Security Enhancements
- Implementation of Content Security Policy
- Enhanced input validation and sanitization
- Secure authentication for future backend integration
