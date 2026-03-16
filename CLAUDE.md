# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application using the App Router with HeroUI v2 as the UI component library. The project uses TypeScript, Tailwind CSS, and supports dark mode via next-themes.

## Development Commands

**Package Manager: This project uses Yarn, NOT npm**

```bash
# Development server (uses Turbopack)
yarn dev

# Production build
yarn build

# Start production server
yarn start

# Run linter with auto-fix
yarn lint

# Add new package
yarn add <package-name>

# Add dev dependency
yarn add -D <package-name>
```

**IMPORTANT**: Always use `yarn add` to install packages, NEVER use `npm install`.

## Architecture

### Core Technologies

- **Next.js 15** with App Router (app directory structure)
- **HeroUI v2** - Component library based on React Aria
- **Tailwind CSS v4** with Tailwind Variants for component styling
- **TypeScript** with strict mode enabled
- **Framer Motion** for animations

### Project Structure

```
app/                    # Next.js App Router pages
├── layout.tsx         # Root layout with Providers and Navbar
├── page.tsx           # Home page
├── providers.tsx      # HeroUI and theme providers wrapper
└── error.tsx          # Error boundary

components/            # Reusable React components
├── navbar.tsx        # Main navigation component
├── theme-switch.tsx  # Dark/light mode toggle

config/               # Application configuration
├── site.ts          # Site metadata, nav items, and links
└── fonts.ts         # Google Fonts configuration (Inter, Fira Code)

types/               # TypeScript type definitions
└── index.ts         # Shared types (IconSvgProps)

styles/              # Global styles
└── globals.css      # Tailwind directives and global CSS

public/              # Static assets (favicon, etc.)
```

### Key Architectural Patterns

#### Provider Setup

The app uses a layered provider structure in [app/providers.tsx](app/providers.tsx):

1. `HeroUIProvider` - Wraps the entire app, integrates with Next.js router
2. `NextThemesProvider` - Handles dark/light mode with `class` attribute strategy
3. Default theme is set to "dark" in [app/layout.tsx](app/layout.tsx:44)

#### Path Aliases

TypeScript paths are configured with `@/*` alias mapping to root:

```typescript
import { Navbar } from '@/components/navbar';
import { siteConfig } from '@/config/site';
```

#### SVG Handling

SVGs are configured to import as React components via @svgr/webpack in both webpack and Turbopack configurations. Use `*.svg?url` for raw URL imports.

#### Site Configuration

Centralized site configuration in [config/site.ts](config/site.ts) exports:

- Site name and description
- Navigation items for navbar
- Mobile menu items
- External links (GitHub, Discord, etc.)

Update this file when adding new navigation items or changing site metadata.

#### Styling System

- **Tailwind CSS v4** with Tailwind Variants for component styling
- **REM Unit Convention**: Base font size is 10px (1rem = 10px)

  - Formula: `Figma px value ÷ 10 = rem value`
  - Example: 24px → 2.4rem

- **Spacing System** (1 unit = 0.4rem = 4px):

  - **Use Tailwind spacing classes**, NOT arbitrary values
  - Formula: `Figma px value ÷ 4 = spacing unit`
  - Examples:
    - 16px ÷ 4 = 4 → `p-4` (= 1.6rem)
    - 24px ÷ 4 = 6 → `p-6` (= 2.4rem)
    - 32px ÷ 4 = 8 → `p-8` (= 3.2rem)
    - 48px ÷ 4 = 12 → `p-12` (= 4.8rem)
  - Common spacing units: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, etc.
  - ✅ CORRECT: `p-4`, `mt-6`, `gap-8`
  - ❌ WRONG: `p-[1.6rem]`, `mt-[2.4rem]`

- **Font Weight System**:

  - Use `font-{weight}` classes: `font-400`, `font-500`, `font-600`, `font-700`, etc.
  - Available weights: 100, 200, 300, 400, 500, 600, 700, 800, 900
  - ✅ CORRECT: `font-600`, `font-700`
  - ❌ WRONG: `font-[600]`, `font-semibold`, `font-bold`

- **Font Size & Line Height**:
  - **ALWAYS use arbitrary values** for font-size and line-height
  - Examples: `text-[1.6rem]`, `leading-[2.4rem]`
  - ❌ NEVER use preset classes: `text-lg`, `leading-tight`

### Responsive Typography (md, lg, xl)

When Figma provides only desktop designs (1440–1920px), treat the Figma font size as the xl breakpoint and scale down for lg and md. Keep using arbitrary font-size and line-height values.

- Breakpoints (Tailwind default): md ≥ 768px, lg ≥ 1024px, xl ≥ 1280px
- Sizing principle:
  - md: ~85–90% of xl (choose based on density and hierarchy)
  - lg: ~95–100% of xl
  - xl: = Figma value
- Rounding: round to the nearest 0.1rem (base 1rem = 10px)
- Line-height: scale proportionally to font-size and keep as arbitrary value (e.g., 1.3–1.6 ratio depending on the text role)
- Mobile (base): has its own UI; set later. If needed temporarily, you may use the md value as the base and refine after the mobile spec is ready.

Examples (Figma at xl):

- 18px → 1.8rem
  - md: text-[1.4rem] or text-[1.5rem]
  - lg: text-[1.6rem]
  - xl: text-[1.8rem]
  - Example: className="md:text-[1.4rem] lg:text-[1.6rem] xl:text-[1.8rem]"
- 24px → 2.4rem
  - md: text-[2.0rem] or text-[2.1rem]
  - lg: text-[2.2rem]
  - xl: text-[2.4rem]

Rules:

- ✅ Use responsive modifiers for typography on tablet/desktop
- ✅ Keep arbitrary values for font-size and line-height
- ✅ Choose md/lg sizes by visual judgement; use the ranges above as defaults
- ❌ Do not use preset sizes like text-lg, text-xl

- **Color System from Figma**:
  - Figma colors use format: `var(--UI-Text-Primary, #0F0F10)`
  - **Check [tailwind.config.js](tailwind.config.js) first** before using colors
  - Colors are defined in HeroUI theme under `themes.light.colors` and `themes.dark.colors`
  - Example mapping: `--UI-Text-Primary` → check for `ui.text.primary` in config (nested path with dots)
  - Usage in components: `text-ui-text-primary` (dots become hyphens in Tailwind class)
  - If color exists in config, use the Tailwind class; if not, add to config first
  - Color structure: nested objects become hyphenated classes (e.g., `ui: { text: { primary: "#0F0F10" } }` → `text-ui-text-primary`)
- **Font Configuration**:
  - fontSans (Inter), fontMono (Fira Code), fontNunito (Nunito - added to config)
  - Font family set globally in [styles/globals.css](styles/globals.css)
  - **IMPORTANT**: Do NOT use `font-nunito` class in components - Nunito is already set as the default font in the root layout
  - ❌ WRONG: `className="font-nunito text-[1.6rem]"`
  - ✅ CORRECT: `className="text-[1.6rem]"` (Nunito is already applied globally)
- **Dark Mode**: Default theme can be `light` or `dark`, uses `class` strategy
- Global styles in [styles/globals.css](styles/globals.css)

## ESLint Configuration

The project uses a comprehensive ESLint setup with:

- **Perfectionist plugin** for import/export sorting
- Import order groups: type → builtin → external → internal → parent → sibling → index
- Custom groups for Next.js, React, HeroUI, and local paths
- TypeScript-specific rules with `prefer-type-imports`
- React JSX prop sorting enabled
- Unused imports detection

When adding imports, the linter will auto-sort them by line length within their group.

## Next.js Configuration Notes

- **React Strict Mode**: Disabled (`reactStrictMode: false`)
- **Turbopack**: Enabled by default in dev mode
- **Output**: Configured for standalone builds
- **SASS**: Legacy JS API deprecation warnings silenced
- **SVG Loader**: Automatically converts SVG imports to React components

## Important Conventions

1. **Server vs Client Components**:

   - Most components can be server components by default
   - Add `"use client"` directive only when needed (providers, interactive components)
   - The Providers component ([app/providers.tsx](app/providers.tsx)) must be a client component

2. **Type Imports**:

   - Use `import type { }` for type-only imports (enforced by ESLint)

3. **Component Props**:

   - Props are auto-sorted by ESLint: reserved → shorthand → callbacks (last)

4. **Metadata**:

   - Use Next.js Metadata API in layout.tsx for SEO
   - Viewport configuration is separate from metadata in Next.js 15

5. **HeroUI RouterConfig**:

   - Custom RouterConfig type declaration in providers.tsx integrates HeroUI navigation with Next.js App Router

6. **Page and Component Separation**:

   **CRITICAL: Pages should NEVER contain component logic. Always separate page wrapper from component implementation.**

   - **app/[route]/page.tsx**: Minimal wrapper that only imports and renders component
   - **components/[ComponentName]/index.tsx**: Contains all logic, state, and UI

   **Pattern:**

   ```tsx
   // ✅ CORRECT - app/student-management/page.tsx
   import React from 'react';
   import StudentManagement from '@/components/StudentManagement';

   const StudentManagementPage = () => {
     return <StudentManagement />;
   };

   export default StudentManagementPage;
   ```

   ```tsx
   // ✅ CORRECT - components/StudentManagement/index.tsx
   export default function StudentManagement() {
     // All state, logic, and hooks here
     const [data, setData] = useState();

     return <div>{/* All UI here */}</div>;
   }
   ```

   ```tsx
   // ❌ WRONG - Do NOT put logic in page.tsx
   export default function StudentManagementPage() {
     const [data, setData] = useState(); // ❌ Logic in page
     return <div>{/* UI here */}</div>; // ❌ UI in page
   }
   ```

   **Benefits:**

   - Clean separation of routing and component logic
   - Easy to test components independently
   - Component can be reused in different routes
   - Follows Next.js App Router best practices

## HeroUI Components

### Component Import Pattern

**IMPORTANT: Always import from individual scoped packages, NEVER from `@heroui/react`**

```typescript
// ✅ CORRECT - Import from scoped packages
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Checkbox } from '@heroui/checkbox';
import { Switch } from '@heroui/switch';
import { Card, CardBody, CardHeader } from '@heroui/card';

// ❌ WRONG - Do not import from @heroui/react
import { Button, Link, Input } from '@heroui/react';
```

### Available HeroUI Components

The project has all HeroUI components installed as individual packages. **Always check and use HeroUI components first before creating custom ones:**

**Form Components:**

- `@heroui/input` - Text inputs
- `@heroui/select` - Select dropdowns
- `@heroui/checkbox` - Checkboxes
- `@heroui/radio` - Radio buttons
- `@heroui/switch` - Toggle switches
- `@heroui/autocomplete` - Autocomplete inputs
- `@heroui/form` - Form wrapper

**Layout Components:**

- `@heroui/card` - Cards
- `@heroui/divider` - Dividers
- `@heroui/spacer` - Spacing
- `@heroui/accordion` - Accordions

**Navigation:**

- `@heroui/link` - Links
- `@heroui/navbar` - Navigation bar
- `@heroui/tabs` - Tabs
- `@heroui/pagination` - Pagination

**Data Display:**

- `@heroui/table` - Tables
- `@heroui/badge` - Badges
- `@heroui/chip` - Chips
- `@heroui/avatar` - Avatars
- `@heroui/image` - Images
- `@heroui/code` - Code blocks
- `@heroui/kbd` - Keyboard keys

**Feedback:**

- `@heroui/alert` - Alerts
- `@heroui/toast` - Toast notifications
- `@heroui/progress` - Progress bars
- `@heroui/spinner` - Loading spinners
- `@heroui/skeleton` - Skeleton loaders

**Overlay:**

- `@heroui/modal` - Modals
- `@heroui/drawer` - Drawers
- `@heroui/dropdown` - Dropdowns
- `@heroui/popover` - Popovers
- `@heroui/tooltip` - Tooltips

**Rules for Using HeroUI Components:**

- ✅ **ALWAYS check if HeroUI has the component first** before building custom
- ✅ Use HeroUI components and customize styling with `className` and Tailwind
- ✅ Refer to package.json for full list of available components
- ❌ DO NOT build custom select/checkbox/switch if HeroUI provides it
- ❌ DO NOT import from `@heroui/react` - use individual packages

**Customizing HeroUI Components:**

```tsx
import { Select, SelectItem } from '@heroui/select';

function CustomSelect() {
  return (
    <Select
      label="Choose option"
      className="max-w-[30rem]"
      classNames={{
        label: 'text-ui-text-primary text-[1.4rem]',
        trigger: 'bg-surface-weak border-stroke-soft',
        value: 'text-ui-text-secondary',
      }}
    >
      <SelectItem key="1">Option 1</SelectItem>
      <SelectItem key="2">Option 2</SelectItem>
    </Select>
  );
}
```

### Link Component

**ALWAYS use HeroUI `Link` component, NEVER use HTML `<a>` tag**

```tsx
import { Link } from '@heroui/link';

function Navigation() {
  return (
    <div>
      {/* Internal link */}
      <Link href="/about">About Us</Link>

      {/* External link */}
      <Link href="https://example.com" isExternal>
        External Link
      </Link>

      {/* With styling */}
      <Link href="/pricing" className="text-ui-text-primary">
        Pricing
      </Link>
    </div>
  );
}
```

**Link Rules:**

- ✅ Use HeroUI `Link`: `import { Link } from "@heroui/link"`
- ✅ Use `href` prop for navigation
- ✅ Add `isExternal` prop for external links
- ✅ Style with `className` using Tailwind classes
- ❌ NEVER use HTML `<a>` tag directly
- ❌ NEVER use Next.js `Link` component (use HeroUI Link instead)

### Toast Notifications

```typescript
import { addToast } from '@heroui/toast';

// Success toast
addToast({
  color: 'success',
  description: 'Operation completed successfully',
});

// Error toast
addToast({
  color: 'danger',
  description: 'An error occurred',
});

// Toast props: color ('success' | 'danger' | 'warning' | 'default'), description, title (optional)
```

### Component Structure Convention

- **Folder-based structure**: Each component has its own directory with `index.tsx`
- Example: `components/Footer/index.tsx` (NOT `components/Footer.tsx`)
- Benefits: Clean imports, easy to extend with tests/styles
- Each `index.tsx` exports as default: `export default function ComponentName()`

**Nested Components (Sub-components):**
When a component needs child/sub-components, create nested folders:

```
components/
├── UserTable/
│   ├── index.tsx           # Main UserTable component
│   ├── ActionCell/
│   │   └── index.tsx       # ActionCell sub-component
│   └── StatusBadge/
│       └── index.tsx       # StatusBadge sub-component
```

**Rules for nested components:**

- ✅ Create folder for sub-component: `ParentComponent/SubComponent/index.tsx`
- ❌ NEVER create flat file: `ParentComponent/ActionCell.tsx`
- Sub-components should be colocated with parent if only used by that parent
- Import: `import ActionCell from "./ActionCell"`

## Form Management with Formik & Yup

### Folder Structure

```
elements/
├── TextField/index.tsx          # Formik wrapper for text input
├── InputField/index.tsx         # Base HeroUI Input with Formik integration
├── PasswordField/index.tsx      # Formik wrapper for password input
├── PasswordInputField/index.tsx # Base HeroUI Input for password with Formik
├── TextInput/index.tsx          # Standalone text input (non-Formik)
├── PasswordInput/index.tsx      # Standalone password input (non-Formik)
└── index.tsx                    # Export Field object
```

### Basic Form Setup

```typescript
import { Formik } from 'formik';
import * as yup from 'yup';
import { Field } from '@/elements';

const validationSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required('Vui lòng nhập số điện thoại')
    .matches(/^0[0-9]{9}$/, 'Số điện thoại không đúng định dạng'),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

const initialValues = { phoneNumber: '', password: '' };

<Formik
  onSubmit={handleSubmit}
  validationSchema={validationSchema}
  initialValues={initialValues}
  validateOnMount
>
  {({ handleSubmit, isValid }) => (
    <form onSubmit={handleSubmit}>
      <Field.Text
        name="phoneNumber"
        label="Số điện thoại"
        placeholder="Nhập số điện thoại"
        icon={PhoneIcon}
        required
      />
      <Field.Password
        name="password"
        label="Mật khẩu"
        placeholder="Nhập mật khẩu"
        required
      />
      <button type="submit" disabled={!isValid}>Đăng nhập</button>
    </form>
  )}
</Formik>
```

### Available Fields

**Field.Text:**

- Props: `name`, `label`, `placeholder`, `icon`, `type`, `required`, `className`
- Auto-validation with error display
- Clear icon when has value
- Error icon when validation fails

**Field.Password:**

- Props: `name`, `label`, `placeholder`, `required`
- Built-in show/hide password toggle (eye icon)
- Auto-validation with error display
- Error icon when validation fails

### Creating New Field Type

**Pattern:**

```tsx
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { Input } from '@heroui/input';
import ClearIcon from '@/assets/svg/clear.svg';
import ErrorIcon from '@/assets/svg/error.svg';

const MyField = ({ name, label, required }: MyFieldProps) => {
  return (
    <FormikField name={name}>
      {({ field, form, meta }: FormikFieldProps) => {
        const hasError = Boolean(meta.touched && meta.error);

        return (
          <div className="flex flex-col gap-2">
            {label && (
              <label className="text-[1.6rem] font-600 leading-[2rem] text-text-text-primary">
                {label}
                {required && <span> *</span>}
              </label>
            )}
            <Input
              {...field}
              placeholder="Enter value"
              classNames={{
                base: 'w-full',
                inputWrapper: [
                  'bg-neutral-0',
                  'border-[2px]',
                  hasError ? 'border-subtitle-red-300' : 'border-neutral-30',
                  'rounded-[1.6rem]',
                  'px-4',
                  'py-3.5',
                  'h-[5.2rem]',
                  hasError ? 'shadow-[0px_2px_0px_0px_#FF4363]' : 'shadow-none',
                  '!overflow-hidden',
                ].join(' '),
                input: [
                  'text-[1.6rem]',
                  'leading-[2.4rem]',
                  hasError || field.value
                    ? 'text-text-text-primary font-700'
                    : 'text-text-text-secondary font-400',
                ].join(' '),
              }}
              variant="flat"
            />
            {hasError && (
              <p className="text-[1.4rem] font-600 leading-[2rem] text-subtitle-red-300">{meta.error}</p>
            )}
          </div>
        );
      }}
    </FormikField>
  );
};
```

**Export:**

```tsx
// elements/index.tsx
export const Field = {
  Text: TextField,
  Password: PasswordField,
  MyField: MyField, // Add here
};
```

### Field Component Requirements

1. ✅ Import `FormikField` and `FormikFieldProps`
2. ✅ Use render props pattern
3. ✅ Spread `{...field}` onto HeroUI Input
4. ✅ Check error with `Boolean(meta.touched && meta.error)`
5. ✅ Use `gap-2` for spacing (8px)
6. ✅ Label style: `text-[1.6rem] font-600 leading-[2rem] text-text-text-primary`
7. ✅ Error style: `text-[1.4rem] font-600 leading-[2rem] text-subtitle-red-300`
8. ✅ Input height: `h-[5.2rem]`
9. ✅ Border: `border-[2px]` with conditional color
10. ✅ Error shadow: `shadow-[0px_2px_0px_0px_#FF4363]`

### Common Yup Validations

```typescript
yup
  .string()
  .required('Required')
  .min(6, 'Minimum 6 characters')
  .email('Invalid email')
  .matches(/regex/, 'Pattern message')
  .oneOf([yup.ref('password')], 'Must match');

yup.number().required('Required').min(0).max(100).positive().integer();

yup.array().required('Required').min(1, 'Select at least one');
```

### Best Practices

1. ✅ Always use Field components (not raw Formik Field)
2. ✅ Define TypeScript interfaces for form values
3. ✅ Use `validateOnMount` to validate immediately
4. ✅ Disable submit when `!isValid`
5. ✅ Keep validation in Yup schema, not components

## Images

### Image Handling

**ALWAYS use Next.js `Image` component for images, NEVER use `<img>` tag**

```tsx
import Image from 'next/image';
import Earth from '@/assets/png/earth.png';

function MyComponent() {
  return (
    <div className="relative h-[40rem] w-[40rem]">
      <Image src={Earth} alt="Earth" fill className="object-contain" priority />
    </div>
  );
}
```

**Image Rules:**

- ✅ Import image from `assets/` directory: `import Earth from "@/assets/png/earth.png"`
- ✅ Use Next.js `Image` component: `import Image from "next/image"`
- ✅ Always provide `alt` prop for accessibility
- ✅ Use `fill` prop for responsive images (requires parent with `position: relative`)
- ✅ Add `priority` prop for above-the-fold images
- ✅ Use `className` for styling (e.g., `object-contain`, `object-cover`)
- ❌ NEVER use HTML `<img>` tag directly

**Common Image Props:**

- `fill`: Makes image fill parent container (parent must have `position: relative`)
- `priority`: Loads image with high priority (for LCP images)
- `className`: Tailwind classes for styling
  - `object-contain`: Fit image within container
  - `object-cover`: Cover entire container
  - `object-center`, `object-top`, etc.: Position image
- `width` & `height`: Explicit dimensions (alternative to `fill`)

## SVG Icons

### Icon Workflow from Figma

When user requests an icon from Figma:

1. **Create empty placeholder** `.svg` file in `assets/svg/` directory
2. **Location**: `assets/svg/icon-name.svg` or `assets/svg/category/icon-name.svg`
3. **Content**: Leave file completely empty - user will manually export from Figma and paste SVG code
4. **Example**: `assets/svg/home/cloud3.svg` (empty file for user to fill)

**DO NOT:**

- ❌ Create `.tsx` component files for SVG icons
- ❌ Generate SVG content or paths
- ❌ Try to convert Figma designs to SVG code
- ❌ Add any placeholder content to the file

**Reasoning:** Only the user can export accurate SVG from Figma with correct viewBox, paths, and styling. Creating empty placeholder files allows proper file structure while user handles exact SVG export.

### SVG File Rules

- File extension: `.svg` (NOT `.tsx`)
- Store in `assets/svg/` with optional subcategories
- Leave content empty initially for user to populate from Figma
- User will add proper sizing and CSS variable colors after export

### Using SVG in Components

After user populates the SVG file from Figma, import and use it as a React component:

```tsx
// Import SVG as component
import Cloud from '@/assets/svg/home/cloud.svg';
import CheckIcon from '@/assets/svg/home/check.svg';

// Use as component
function MyComponent() {
  return (
    <div>
      <Cloud />
      <CheckIcon />
    </div>
  );
}
```

**Important:** SVG files are automatically converted to React components by the webpack/Turbopack SVG loader configuration.

## Color System & Figma Integration

### Color Mapping from Figma

When reading Figma designs, colors appear as: `var(--UI-Text-Primary, #0F0F10)`

**Workflow:**

1. **Extract variable name and color**: `var(--UI-Text-Primary, #0F0F10)` from Figma
2. **Check [tailwind.config.js](tailwind.config.js)**: Look in `themes.dark.colors` or `themes.light.colors`
3. **Convert to nested path**: `--UI-Text-Primary` → `ui.text.primary` (lowercase, replace hyphens with dots for nesting)
4. **Verify color value**:
   - If variable exists AND color matches: Use existing Tailwind class
   - If variable exists BUT color differs: **NEVER overwrite** - Create new variable with suffix (e.g., `primary2`, `primary3`)
   - If variable doesn't exist: Add new color to config
5. **Use Tailwind class**: Replace dots with hyphens: `text-ui-text-primary`, `bg-ui-text-primary`, `border-ui-text-primary`

**Example Mapping:**

```
Figma: var(--UI-Text-Primary, #0F0F10)
Config path: themes.dark.colors["ui"]["text"]["primary"]
Tailwind class: text-ui-text-primary

Figma: var(--Icon-Brand, #528BFF)
Config path: themes.dark.colors["icon"]["brand"]
Tailwind class: text-icon-brand

Figma: var(--Stroke-Soft, #323741)
Config path: themes.dark.colors["stroke"]["soft"]
Tailwind class: border-stroke-soft
```

**Handling Color Conflicts:**
When Figma variable name exists in config but with different color value:

```
Example:
Figma: var(--neutral-colors-color-text-secondary, #6D7885)
Config already has: neutral.colors.color.text.secondary = "#8A8A8C"

❌ WRONG: Overwrite existing color (breaks other components)
✅ CORRECT: Create new variable with suffix

Add to config:
neutral: {
  colors: {
    color: {
      text: {
        secondary: "#8A8A8C",    // Keep existing
        secondary2: "#6D7885"     // Add new with suffix
      }
    }
  }
}

Use in component: text-neutral-colors-color-text-secondary2
```

**If color doesn't exist in config:**

1. Add to [tailwind.config.js](tailwind.config.js) under `themes.light.colors` and `themes.dark.colors`
2. Use consistent naming: lowercase, nested objects for groups
3. Structure: Group colors logically (e.g., `ui: { text: { primary: "#color" } }`)

### Background Gradients

**PREFERRED: Define gradients in [tailwind.config.js](tailwind.config.js)**

Add gradients to `theme.extend.backgroundImage` section:

```js
module.exports = {
  theme: {
    extend: {
      backgroundImage: {
        'gradient-primary': 'linear-gradient(180deg, #FFF 0%, #F1F7FF 100%)',
        'gradient-hero':
          'linear-gradient(106deg, rgba(0,200,176,0.15) 2.08%, rgba(117,30,218,0.15) 30.97%, rgba(226,17,175,0.15) 65.73%, rgba(255,247,0,0.15) 95.59%)',
        'gradient-card': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
    },
  },
};
```

Then use with Tailwind class: `className="bg-gradient-primary"`

**Alternative (one-time use only):**
For gradients used only once, you can use arbitrary values:

```tsx
// Single use gradient - avoid if possible
<div className="bg-[linear-gradient(106deg,rgba(0,200,176,0.15)_2.08%,rgba(117,30,218,0.15)_30.97%)]">
  Content
</div>
```

**Rules:**

- ✅ ALWAYS add gradients to `backgroundImage` in [tailwind.config.js](tailwind.config.js) for reusability
- ✅ Use semantic naming: `gradient-primary`, `gradient-hero`, `gradient-card`
- ✅ Use `bg-[linear-gradient(...)]` ONLY for truly one-time gradients
- ❌ Don't use inline styles (`style={{ background: '...' }}`)
- ❌ Don't repeat gradient values across components

## Spacing & Layout Guidelines

### Layout Best Practices

- **Prefer Flexbox/Grid over Position**: Use `flex` or `grid` for layouts instead of `absolute`/`relative` positioning when possible
- **Grid for Complex Layouts**: Use CSS Grid (`grid`, `grid-cols-*`) when layout is more structured than flex can handle
- **Avoid Fixed Widths**: Use responsive units (`w-full`, `max-w-[...]`, `min-w-[...]`) instead of fixed widths for better responsive design
- **Use Flexbox Gap** (NOT margin): `flex flex-col gap-[2.4rem]`
- **No Inline Styles**: Use Tailwind arbitrary values instead: `text-[1.6rem] font-[700] leading-[1.4]`
- **Avoid Double Spacing**: Only parent containers should have padding

**Examples:**

```tsx
// ❌ WRONG - Fixed width, will break on mobile
<div className="w-[120rem]">Content</div>

// ✅ CORRECT - Responsive width
<div className="w-full max-w-[120rem]">Content</div>

// ❌ WRONG - Using position when flex works
<div className="relative">
  <div className="absolute top-[2rem] left-[2rem]">Item 1</div>
  <div className="absolute top-[2rem] right-[2rem]">Item 2</div>
</div>

// ✅ CORRECT - Using flex
<div className="flex items-start justify-between p-[2rem]">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// ✅ CORRECT - Using grid for structured layouts
<div className="grid grid-cols-3 gap-[2.4rem]">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

### Spacing Best Practices

### Common Spacing Values

| Figma (px) | Code (rem) | Use Case                      |
| ---------- | ---------- | ----------------------------- |
| 8px        | 0.8rem     | Title to subtitle             |
| 16px       | 1.6rem     | Input padding, icon spacing   |
| 24px       | 2.4rem     | Container padding, input gaps |
| 48px       | 4.8rem     | Title/form/button spacing     |
| 63px       | 6.3rem     | Form area padding             |
