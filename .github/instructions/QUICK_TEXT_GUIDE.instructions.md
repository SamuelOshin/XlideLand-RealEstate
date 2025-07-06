# 📋 Quick Copilot Instructions: Text Contrast

## 🎯 **GOLDEN RULE**: Always use readable text colors. Never suggest faint gray text.

## ✅ **ALWAYS USE** (Semantic Classes):
```tsx
text-text-primary    // Headings, important text
text-text-secondary  // Body text, descriptions  
text-text-muted      // Labels, metadata
text-text-subtle     // Timestamps, minor details
```

## ❌ **NEVER USE** (Too Faint):
```tsx
text-gray-400  // Too light
text-gray-300  // Too light  
text-gray-200  // Too light
text-slate-400 // Too light
```

## 🎨 **Common Patterns**:
```tsx
// Card titles
className="text-text-primary text-lg font-semibold"

// Body text
className="text-text-secondary"

// Metadata
className="text-text-muted text-sm"

// Form labels  
className="text-text-muted text-sm font-medium"
```

## 🧩 **Use Typography Component When Available**:
```tsx
import { Heading, Body, Caption } from '@/components/ui/Typography';

<Heading>Clear heading</Heading>
<Body>Readable body text</Body>
<Caption>Clear metadata</Caption>
```

**Priority: Readability > Aesthetics**
