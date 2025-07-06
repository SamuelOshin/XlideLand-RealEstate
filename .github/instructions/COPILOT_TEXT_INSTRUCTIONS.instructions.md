# Copilot Instructions: Text Contrast & Readability Standards

## 🎯 **PRIMARY RULE: ALWAYS USE READABLE TEXT COLORS**

When generating code for this XlideLand project, **NEVER** use faint or low-contrast text colors. Always prioritize readability and accessibility.

---

## 📋 **TEXT COLOR GUIDELINES**

### ✅ **PREFERRED: Use Semantic Text Classes**
```tsx
// ✅ GOOD - Use these semantic classes
className="text-text-primary"    // For headings, primary content
className="text-text-secondary"  // For body text, descriptions  
className="text-text-muted"      // For labels, metadata
className="text-text-subtle"     // For timestamps, minor details
className="text-text-disabled"   // For disabled states only
```

### ✅ **ACCEPTABLE: Enhanced Gray Classes** 
```tsx
// ✅ ACCEPTABLE - These are now readable (auto-enhanced)
className="text-gray-700"  // Dark, good for body text
className="text-gray-600"  // Medium, good for labels
className="text-gray-500"  // Light but readable, for metadata
```

### ❌ **AVOID: Faint/Low Contrast Colors**
```tsx
// ❌ NEVER USE - Too faint, poor readability
className="text-gray-400"  // Too light for body text
className="text-gray-300"  // Too light for any text
className="text-gray-200"  // Barely visible
className="text-slate-400" // Also too faint
className="text-zinc-400"  // Also too faint
```

---

## 🎨 **COMPONENT-SPECIFIC RULES**

### **Cards & Property Listings**
```tsx
// ✅ Card titles
<h3 className="text-text-primary text-lg font-semibold">Property Title</h3>

// ✅ Descriptions  
<p className="text-text-secondary text-sm">Property description text</p>

// ✅ Metadata (price, location, etc.)
<span className="text-text-muted text-sm">Location • Price</span>

// ✅ Timestamps, small details
<time className="text-text-subtle text-xs">Posted 2 days ago</time>
```

### **Forms & Inputs**
```tsx
// ✅ Label text
<label className="text-text-muted text-sm font-medium">Email Address</label>

// ✅ Input placeholder (handled automatically)
<input placeholder="Enter your email..." className="placeholder:text-gray-500" />

// ✅ Help text
<p className="text-text-subtle text-xs">We'll never share your email</p>

// ✅ Error text  
<p className="text-red-600 text-sm">This field is required</p>
```

### **Navigation & Menus**
```tsx
// ✅ Active navigation items
<span className="text-text-primary font-medium">Dashboard</span>

// ✅ Inactive navigation items
<span className="text-text-muted hover:text-text-secondary">Settings</span>

// ✅ Menu descriptions
<p className="text-text-subtle text-sm">Manage your account</p>
```

### **Buttons & Interactive Elements**
```tsx
// ✅ Primary button text (usually white on colored background)
<Button className="bg-emerald-600 text-white">Save Changes</Button>

// ✅ Secondary button text
<Button variant="outline" className="text-text-primary">Cancel</Button>

// ✅ Link text
<Link className="text-emerald-600 hover:text-emerald-700">Learn more</Link>
```

---

## 🧩 **TYPOGRAPHY COMPONENT USAGE**

### **When Available, Use Typography Components**
```tsx
import { Heading, Body, Caption, Muted } from '@/components/ui/Typography';

// ✅ For headings
<Heading size="2xl">Section Title</Heading>

// ✅ For body text
<Body>This is readable body content that users can easily read.</Body>

// ✅ For captions/metadata
<Caption>Additional details or metadata</Caption>

// ✅ For subtle/muted text
<Muted>Less important information</Muted>
```

---

## 🎯 **SPECIFIC COLOR APPLICATIONS**

### **Dashboard Elements**
```tsx
// ✅ Dashboard headings
className="text-text-primary text-2xl font-bold"

// ✅ Stats/numbers
className="text-text-primary text-3xl font-bold"

// ✅ Stat labels
className="text-text-muted text-sm font-medium"

// ✅ Activity descriptions
className="text-text-secondary"

// ✅ Timestamps
className="text-text-subtle text-sm"
```

### **Property Details**
```tsx
// ✅ Property titles
className="text-text-primary text-xl font-semibold"

// ✅ Property descriptions
className="text-text-secondary"

// ✅ Features list
className="text-text-muted text-sm"

// ✅ Price information
className="text-text-primary text-2xl font-bold"

// ✅ Location/details
className="text-text-muted"
```

---

## ♿ **ACCESSIBILITY REQUIREMENTS**

### **Contrast Ratios**
- **Primary text**: Must have 4.5:1 contrast minimum
- **Secondary text**: Must have 4.5:1 contrast minimum  
- **Muted text**: Must have 3:1 contrast minimum
- **Subtle text**: Use sparingly, 3:1 contrast minimum

### **High Contrast Mode**
```tsx
// ✅ Automatically supported with semantic classes
className="text-text-secondary" // Auto-adjusts in high contrast mode
```

---

## 🚫 **COMMON MISTAKES TO AVOID**

### ❌ **Don't Use These Patterns**
```tsx
// ❌ Too faint for body text
<p className="text-gray-400">Important information</p>

// ❌ Inconsistent gray usage
<div className="text-gray-500">Label</div>
<div className="text-slate-400">Another label</div>

// ❌ Mixing color systems
<span className="text-zinc-500">Some text</span>
<span className="text-gray-600">Other text</span>
```

### ✅ **Do This Instead**
```tsx
// ✅ Consistent, readable approach
<p className="text-text-secondary">Important information</p>

// ✅ Consistent labeling
<div className="text-text-muted">Label</div>
<div className="text-text-muted">Another label</div>

// ✅ Unified color system
<span className="text-text-muted">Some text</span>
<span className="text-text-muted">Other text</span>
```

---

## 🎨 **BRAND CONSISTENCY**

### **XlideLand Color Palette**
```tsx
// ✅ Brand colors for interactive elements
className="text-emerald-600"     // Primary brand color
className="text-emerald-700"     // Hover state
className="text-red-600"         // Error states
className="text-amber-600"       // Warning states
className="text-blue-600"        // Info states
```

### **Text Hierarchy**
1. **Headings**: `text-text-primary` + appropriate font weight
2. **Body text**: `text-text-secondary`
3. **Labels/metadata**: `text-text-muted`
4. **Subtle details**: `text-text-subtle`
5. **Disabled states**: `text-text-disabled`

---

## 📝 **QUICK REFERENCE**

### **Most Common Use Cases**
```tsx
// Page/section headings
className="text-text-primary text-2xl font-bold"

// Card titles  
className="text-text-primary text-lg font-semibold"

// Body text, descriptions
className="text-text-secondary"

// Form labels
className="text-text-muted text-sm font-medium"

// Metadata (location, time, etc.)
className="text-text-muted text-sm"

// Very subtle details
className="text-text-subtle text-xs"
```

---

## 🎯 **ENFORCEMENT RULES**

1. **NEVER** suggest `text-gray-400` or lighter for regular text
2. **ALWAYS** use semantic text classes when possible
3. **ENSURE** proper contrast ratios for accessibility
4. **MAINTAIN** consistency across similar UI elements
5. **PRIORITIZE** readability over aesthetics when in conflict

---

## ✅ **VALIDATION CHECKLIST**

Before suggesting any text styling, ask:
- [ ] Is this text easily readable?
- [ ] Does it meet WCAG AA contrast requirements?
- [ ] Am I using semantic classes consistently?
- [ ] Is the text hierarchy clear?
- [ ] Would this work for users with visual impairments?

**Remember: Readable text is always better than stylish but faint text!**
