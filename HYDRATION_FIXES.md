# React Hydration Error Fixes

## Summary of Changes

This document outlines the fixes applied to resolve React hydration errors in your Next.js Real Estate DApp.

## Root Causes Identified

1. **Responsive CSS Classes**: Using `hidden md:flex` caused different rendering between server and client
2. **Client-only Browser APIs**: Components accessing `window` object before client-side hydration
3. **Missing Context Provider**: `RealEstateProvider` was not wrapping the app
4. **Dynamic State**: Interactive components with `useState` causing different initial states

## Fixes Applied

### 1. Created ClientOnly Component (`components/ClientOnly.jsx`)

```jsx
"use client";
import { useState, useEffect } from "react";

const ClientOnly = ({ children, fallback = null }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback;
  }

  return children;
};
```

**Purpose**: Prevents rendering mismatches by only rendering client-specific content after hydration is complete.

### 2. Updated Layout (`app/layout.js`)

- Added `RealEstateProvider` wrapper around children
- Ensures context is available throughout the app

### 3. Fixed Utils/apiFeature.js

- Added `typeof window === "undefined"` checks to all functions accessing `window`
- Functions now safely return `null` on server-side

### 4. Updated Home Component (`components/home/home.jsx`)

- Wrapped responsive layouts with `ClientOnly` component
- Provides fallback content during SSR

### 5. Fixed Modal Component (`components/modal/modal.jsx`)

- Wrapped entire modal in `ClientOnly`
- Prevents hydration issues with responsive classes

### 6. Updated HeroImage Component (`components/home/heroImage/heroImage.jsx`)

- Added `mounted` state to prevent hydration issues
- Added `suppressHydrationWarning` to interactive button
- Provides safe fallback during hydration

### 7. Enhanced RealEstateContext (`context/RealEstateContext.js`)

- Added `isClient` state to track client-side rendering
- Added `useEffect` to set client state after mount

## Key Principles Applied

### 1. Server-Client Parity

- Ensure server-rendered HTML matches initial client render
- Use `ClientOnly` wrapper for client-specific features

### 2. Progressive Enhancement

- Start with server-safe rendering
- Enhance with client features after hydration

### 3. Safe Browser API Access

- Always check `typeof window !== "undefined"`
- Provide fallbacks for server-side rendering

### 4. Responsive Design Hydration

- Use `ClientOnly` for responsive CSS that differs between server/client
- Provide appropriate fallbacks

## Best Practices Moving Forward

### 1. Component Design

```jsx
// ✅ Good - Safe for SSR
const MyComponent = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>; // Server-safe fallback
  }

  return <div>Client content</div>;
};

// ❌ Bad - Causes hydration error
const MyComponent = () => {
  const isClient = typeof window !== "undefined";
  return <div>{isClient ? "Client" : "Server"}</div>;
};
```

### 2. API Functions

```jsx
// ✅ Good
export const getWalletAccount = async () => {
  if (typeof window === "undefined") return null;
  // ... rest of function
};

// ❌ Bad
export const getWalletAccount = async () => {
  const { ethereum } = window; // Crashes on server
  // ... rest of function
};
```

### 3. Context Usage

```jsx
// ✅ Good
const MyProvider = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return <Context.Provider value={{ isClient }}>{children}</Context.Provider>;
};
```

## Testing Checklist

After applying these fixes, verify:

- [ ] No hydration warnings in browser console
- [ ] All responsive layouts work correctly
- [ ] Modal components open without errors
- [ ] Wallet connection functions work
- [ ] Interactive elements (like buttons) work properly
- [ ] Page loads and renders correctly on first visit

## Additional Recommendations

1. **Enable React Strict Mode** in development to catch hydration issues early
2. **Use ESLint React Hooks plugin** to catch dependency array issues
3. **Test with JavaScript disabled** to ensure proper SSR fallbacks
4. **Monitor console warnings** during development

## Common Hydration Error Patterns to Avoid

1. **Date/Time formatting without timezone consideration**
2. **Random values (Math.random()) in render**
3. **Browser-specific feature detection in render**
4. **Responsive classes without proper hydration handling**
5. **LocalStorage/SessionStorage access in render**

By following these patterns and fixes, your React app should now hydrate properly without errors.
