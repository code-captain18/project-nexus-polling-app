# Components Documentation

This directory contains all reusable UI components for the Vunes Poll application.

## Components List

### Layout & Structure

#### `PageHeader`
Gradient header component used across screens with back button and optional icons.
- Props: `title`, `subtitle`, `showBack`, `backText`, `rightElement`, `onBack`, `icon`
- Used in: Poll detail, Create poll

#### `EmptyState`
Empty state display with icon, title, and subtitle.
- Props: `icon`, `title`, `subtitle`
- Used in: Home screen (no polls)

#### `LoadingState`
Loading indicator with customizable message.
- Props: `message`
- Used in: Home screen, Poll detail

### Poll Components

#### `PollCard`
Complete poll card with status badge, stats, and time info.
- Props: `poll`, `getPollStatus`
- Used in: Home screen poll list

#### `PollStatusBadge`
Colored status badge showing poll state (Live/Upcoming/Closed).
- Props: `status`, `label`, `color`, `bg`
- Used in: PollCard

#### `StatusBanner`
Alert banner for poll status information.
- Props: `type`, `title`, `subtitle`, `icon`
- Types: `pending`, `ended`, `voted`, `info`
- Used in: Poll detail screen

### Voting & Results

#### `VotingOption`
Radio button option card for voting.
- Props: `text`, `isSelected`, `onSelect`
- Used in: Poll detail voting view

#### `ChartTypeToggle`
Toggle between bar and pie chart views.
- Props: `chartType`, `onToggle`
- Used in: Poll detail results view

#### `ResultsBreakdown`
Detailed result card with progress bar and percentage.
- Props: `option`, `percentage`, `isSelected`
- Used in: Poll detail results view

### Form Components

#### `DateTimePickerButton`
Customizable date/time picker button with clear functionality.
- Props: `label`, `value`, `onPress`, `onClear`, `placeholder`, `iconName`, `color`, `bgColor`, `borderColor`
- Used in: Create poll form

#### `PrimaryButton`
Main action button with loading state.
- Props: `onPress`, `disabled`, `loading`, `title`, `loadingTitle`, `icon`, `loadingIcon`
- Used in: Home screen, Poll detail, Create poll

## Usage

Import components individually:
```tsx
import { PollCard, StatusBanner } from '../components';
```

Or import from index:
```tsx
import { 
  PageHeader, 
  PrimaryButton, 
  VotingOption 
} from '../components';
```

## Design System

All components follow the professional color palette:
- Primary: `#2563EB` (blue)
- Success: `#10B981` (green)
- Warning: `#F59E0B` (orange)
- Neutral: `#64748B` (slate)
- Background: `#F8FAFC`

Components use consistent:
- Border radius: `rounded-2xl` (2xl)
- Shadows: `shadowOpacity: 0.08`, `elevation: 3`
- Typography: Semibold/Bold weights
- Spacing: Standard Tailwind scale
