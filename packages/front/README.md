# Frontend Template

A reusable React + TypeScript frontend template with pre-built UI components and infrastructure.

## Features

### 🎨 UI Components

- **Atoms**: Button, CheckBox, Dropdown, Slider, EditableText, Icons, and more
- **Layout**: Grid, Row, Column, Gap with drag-and-drop support
- **Containers**: ListView, InfiniteScroll
- **Modals**: Dialog system (Confirm, Info, Choice), Progress, Form modals
- **TabBar**: Tabbed navigation component
- **Toast**: Toast notification system
- **TreeView**: Hierarchical tree view component

### 🏗️ Infrastructure

- **React Router**: Client-side routing
- **i18n**: Internationalization with i18next
- **State Management**: Zustand with custom event bus (zustbus)
- **Styling**: Emotion, Tailwind CSS, SCSS/SASS support
- **UI Library**: Material-UI integration
- **TypeScript**: Full type safety

### 🛠️ Development Tools

- **Vite**: Fast build tool and dev server
- **ESLint**: Code linting
- **TypeScript**: Type checking

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Build

```bash
npm run build
```

Builds the app for production to the `dist` folder.

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── api/                      # API layer
│   ├── events/               # Event pipe system
│   └── error.ts              # API error types
├── assets/                   # Static assets and global styles
├── components/               # Reusable UI components
│   ├── atoms/                # Basic UI elements
│   │   ├── Button/
│   │   ├── CheckBox/
│   │   ├── Dropdown/
│   │   ├── Slider/
│   │   └── ...
│   ├── container/            # Container components
│   │   ├── InfiniteScroll/
│   │   └── ListView/
│   ├── layout/               # Layout components
│   ├── Modal/                # Modal wrapper
│   ├── TabBar/               # Tab navigation
│   ├── ToastAnchor/          # Toast system
│   ├── TreeView/             # Tree view
│   └── ui/                   # Utility UI components
├── hooks/                    # Custom React hooks
│   ├── useModal.tsx          # Modal management
│   ├── useHotkey.ts          # Hotkey binding
│   ├── useDebounce.ts        # Debounce hook
│   ├── useThrottle.ts        # Throttle hook
│   └── ...
├── lib/                      # Library code
│   ├── zustbus/              # Event bus system
│   └── xyflow/               # Flow diagram types
├── locales/                  # i18n translations
│   ├── en/                   # English
│   └── ko/                   # Korean
├── modals/                   # Modal components
│   ├── Dialog/               # Dialog modals
│   ├── FormModal/            # Dynamic form modal
│   ├── ProgressModal/        # Progress indicator
│   └── ...
├── pages/                    # Page components
│   ├── Home.tsx              # Home page
│   ├── ComponentsDemo.tsx    # Components showcase
│   ├── FormsDemo.tsx         # Forms example
│   └── ModalsDemo.tsx        # Modals example
├── stores/                   # Zustand stores
│   ├── useCacheStore.ts      # Cache management
│   ├── useChannelStore.ts    # Channel management
│   └── ...
├── types/                    # TypeScript types
├── utils/                    # Utility functions
│   ├── clipboard.ts          # Clipboard utilities
│   ├── file.ts               # File utilities
│   ├── math.ts               # Math utilities
│   └── ...
├── App.tsx                   # Root component
└── main.tsx                  # Entry point
```

## Key Components

### Button

```tsx
import Button from '@/components/atoms/Button';

<Button onClick={() => alert('Clicked!')}>
  Click Me
</Button>
```

### CheckBox

```tsx
import CheckBox from '@/components/atoms/CheckBox';

<CheckBox
  checked={checked}
  onChange={setChecked}
  label="Check me"
/>
```

### Dropdown

```tsx
import Dropdown from '@/components/atoms/Dropdown';

<Dropdown value={value} onChange={setValue}>
  <Dropdown.Item value="option1">Option 1</Dropdown.Item>
  <Dropdown.Item value="option2">Option 2</Dropdown.Item>
  <Dropdown.Group label="Group">
    <Dropdown.Item value="option3">Option 3</Dropdown.Item>
  </Dropdown.Group>
</Dropdown>
```

### Modal

```tsx
import { useModal } from '@/hooks/useModal';
import ConfirmDialog from '@/modals/Dialog/ConfirmDialog';

const modal = useModal();

const handleClick = async () => {
  const result = await modal.open();
  console.log('User confirmed:', result);
};

<ConfirmDialog
  modal={modal}
  title="Confirm"
  message="Are you sure?"
/>
```

## Custom Hooks

### useModal

Manage modal state and lifecycle:

```tsx
const modal = useModal();

// Open modal
modal.open();

// Close modal
modal.close();

// Check if open
modal.isOpen;
```

### useHotkey

Bind keyboard shortcuts:

```tsx
useHotkey('ctrl+s', () => {
  console.log('Save triggered!');
});
```

### useDebounce / useThrottle

Control function execution rate:

```tsx
const debouncedValue = useDebounce(value, 500);
const throttledCallback = useThrottle(callback, 1000);
```

## State Management

### Zustand Store

```tsx
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// In component
const { count, increment } = useStore();
```

### Event Bus (zustbus)

```tsx
import { createBus } from '@/lib/zustbus';

const [emit, useOn, useValue] = createBus<{
  userLoggedIn: { userId: string };
  dataUpdated: { data: any };
}>();

// Emit event
emit('userLoggedIn', { userId: '123' });

// Listen to event
useOn('userLoggedIn', (payload) => {
  console.log('User logged in:', payload.userId);
});
```

## Internationalization

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return <h1>{t('welcome')}</h1>;
}
```

Add translations in `src/locales/`:
- `en/translation.json` for English
- `ko/translation.json` for Korean

## Styling

### Emotion (CSS-in-JS)

```tsx
import styled from '@emotion/styled';

const StyledButton = styled.button`
  background: blue;
  color: white;
  padding: 10px 20px;
`;
```

### Tailwind CSS

```tsx
<div className="flex items-center justify-center p-4">
  Content
</div>
```

### SCSS Modules

```tsx
import styles from './MyComponent.module.scss';

<div className={styles.container}>
  Content
</div>
```

## Best Practices

1. **Component Organization**: Keep components small and focused
2. **Type Safety**: Use TypeScript for all components and hooks
3. **Reusability**: Design components to be reusable across projects
4. **Accessibility**: Use semantic HTML and ARIA attributes
5. **Performance**: Use React.memo, useMemo, useCallback when appropriate
6. **State Management**: Use Zustand for global state, React state for local
7. **Testing**: Write tests for critical components and hooks

## License

MIT

## Contributing

This is a template project. Feel free to fork and customize for your needs.
