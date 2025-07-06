# 🤖 Copilot Coding Instructions for XlideLand

## 📝 **OVERVIEW**
These instructions ensure consistent, accessible, and high-quality code generation for the XlideLand real estate platform.

---

## 🎨 **TEXT & TYPOGRAPHY STANDARDS**

### **PRIMARY RULE: READABLE TEXT ALWAYS**
- ✅ **DO**: Use `text-text-primary`, `text-text-secondary`, `text-text-muted`, `text-text-subtle`
- ❌ **DON'T**: Use `text-gray-400`, `text-gray-300`, `text-gray-200`, or any faint colors
- 🎯 **GOAL**: WCAG AA compliance (4.5:1 contrast minimum)

### **Quick Reference**
```tsx
// Headings & Important Text
className="text-text-primary text-xl font-semibold"

// Body Text & Descriptions  
className="text-text-secondary"

// Labels & Metadata
className="text-text-muted text-sm font-medium"

// Subtle Details & Timestamps
className="text-text-subtle text-xs"
```

---

## 🏗️ **COMPONENT STANDARDS**

### **React Components**
```tsx
// ✅ Always use TypeScript
interface ComponentProps {
  title: string;
  description?: string;
}

// ✅ Use proper prop types
const Component: React.FC<ComponentProps> = ({ title, description }) => {
  return (
    <div className="space-y-2">
      <h2 className="text-text-primary text-lg font-semibold">{title}</h2>
      {description && (
        <p className="text-text-secondary text-sm">{description}</p>
      )}
    </div>
  );
};
```

### **Styling Patterns**
```tsx
// ✅ Use consistent spacing
className="space-y-4 p-6"

// ✅ Use semantic colors
className="bg-white border border-gray-200 rounded-xl shadow-sm"

// ✅ Use proper hover states
className="hover:bg-gray-50 transition-colors duration-200"
```

---

## 🎯 **BRAND GUIDELINES**

### **Color Palette**
```tsx
// Primary Brand (Emerald)
className="bg-emerald-600 text-white"           // Primary buttons
className="text-emerald-600 hover:text-emerald-700"  // Links
className="border-emerald-200"                  // Borders

// Secondary (Orange)  
className="bg-orange-500 text-white"            // Secondary actions
className="text-orange-600"                     // Accents

// Status Colors
className="text-red-600"      // Errors
className="text-amber-600"    // Warnings  
className="text-green-600"    // Success
className="text-blue-600"     // Info
```

### **Typography Scale**
```tsx
// Headings
className="text-3xl font-bold"    // Page titles
className="text-2xl font-bold"    // Section headings
className="text-xl font-semibold" // Card titles
className="text-lg font-semibold" // Subsections

// Body Text
className="text-base"             // Regular body
className="text-sm"               // Secondary text
className="text-xs"               // Captions
```

---

## 🎪 **UI COMPONENT USAGE**

### **Always Use Existing Components**
```tsx
// ✅ Import from component library
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heading, Body } from '@/components/ui/Typography';

// ✅ Use InstantLoadingLink for navigation
import InstantLoadingLink from '@/components/ui/InstantLoadingLink';
<InstantLoadingLink href="/properties">View Properties</InstantLoadingLink>
```

### **Button Patterns**
```tsx
// Primary actions
<Button className="bg-emerald-600 hover:bg-emerald-700">
  Save Property
</Button>

// Secondary actions  
<Button variant="outline" className="text-text-primary">
  Cancel
</Button>

// Destructive actions
<Button variant="destructive">
  Delete Property
</Button>
```

---

## 📱 **RESPONSIVE DESIGN**

### **Mobile-First Approach**
```tsx
// ✅ Start with mobile, enhance for desktop
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// ✅ Use responsive text sizes
className="text-sm md:text-base lg:text-lg"

// ✅ Hide elements responsively
className="hidden md:block"          // Show on medium+ screens
className="block md:hidden"          // Show only on mobile
```

### **Container Patterns**
```tsx
// Page containers
className="container mx-auto px-4 py-8"

// Card grids
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Flex layouts
className="flex flex-col md:flex-row items-start md:items-center gap-4"
```

---

## ♿ **ACCESSIBILITY STANDARDS**

### **Always Include**
```tsx
// ✅ Proper ARIA labels
<button aria-label="Add to favorites">
  <Heart className="h-4 w-4" />
</button>

// ✅ Alt text for images
<Image 
  src="/property.jpg" 
  alt="3-bedroom house with garden in downtown area"
  width={400} 
  height={300} 
/>

// ✅ Semantic HTML
<nav>
  <ul>
    <li><a href="/properties">Properties</a></li>
  </ul>
</nav>
```

### **Focus States**
```tsx
// ✅ Always include focus states
className="focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
```

---

## 🔧 **CODE QUALITY STANDARDS**

### **TypeScript**
```tsx
// ✅ Always define proper types
interface PropertyCardProps {
  property: Property;
  onFavorite?: (id: string) => void;
  className?: string;
}

// ✅ Use proper error handling
try {
  const data = await fetchProperties();
  setProperties(data);
} catch (error) {
  console.error('Failed to fetch properties:', error);
  setError('Unable to load properties');
}
```

### **Performance**
```tsx
// ✅ Use React.memo for expensive components
const PropertyCard = React.memo<PropertyCardProps>(({ property }) => {
  // component logic
});

// ✅ Use proper loading states
if (loading) {
  return <div className="animate-pulse">Loading...</div>;
}

// ✅ Optimize images
<Image
  src={property.image}
  alt={property.title}
  width={400}
  height={300}
  loading="lazy"
  placeholder="blur"
/>
```

---

## 🎨 **ANIMATION & INTERACTIONS**

### **Consistent Transitions**
```tsx
// ✅ Use consistent transition classes
className="transition-all duration-200 ease-in-out"

// ✅ Hover effects
className="hover:scale-105 hover:shadow-lg transition-transform duration-200"

// ✅ Focus animations
className="focus:scale-105 transition-transform duration-150"
```

### **Loading States**
```tsx
// ✅ Use consistent loading patterns
className="animate-pulse bg-gray-200 rounded"

// ✅ Skeleton loaders
<div className="space-y-3">
  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
</div>
```

---

## 📋 **VALIDATION CHECKLIST**

Before generating any component, ensure:

- [ ] ✅ Uses readable text colors (no faint grays)
- [ ] ✅ Includes proper TypeScript types
- [ ] ✅ Uses existing UI components when possible
- [ ] ✅ Follows responsive design patterns
- [ ] ✅ Includes accessibility attributes
- [ ] ✅ Uses brand colors consistently
- [ ] ✅ Has proper error handling
- [ ] ✅ Includes loading states
- [ ] ✅ Uses semantic HTML
- [ ] ✅ Has consistent spacing and typography

---

## 🚫 **COMMON MISTAKES TO AVOID**

### ❌ **DON'T DO THIS:**
```tsx
// Faint text colors
<p className="text-gray-400">Important text</p>

// Missing types
const Component = ({ data }) => { /* ... */ }

// Inconsistent styling
<div className="mt-3 mb-2 ml-1 mr-4">

// Missing accessibility
<button><Icon /></button>

// Hardcoded colors
<div style={{ color: '#888' }}>
```

### ✅ **DO THIS INSTEAD:**
```tsx
// Readable text colors
<p className="text-text-secondary">Important text</p>

// Proper types
const Component: React.FC<Props> = ({ data }) => { /* ... */ }

// Consistent spacing
<div className="space-y-4 p-6">

// Proper accessibility
<button aria-label="Close dialog"><Icon /></button>

// Semantic colors
<div className="text-text-muted">
```

---

## 📚 **QUICK REFERENCE LINKS**

- 📖 Full Text Guidelines: `COPILOT_TEXT_INSTRUCTIONS.md`
- ⚡ Quick Text Guide: `QUICK_TEXT_GUIDE.md`  
- 🎨 Text Utilities: `src/lib/textUtils.ts`
- 🧩 Typography Component: `src/components/ui/Typography.tsx`

**Remember: Quality, accessibility, and consistency are more important than speed!**
