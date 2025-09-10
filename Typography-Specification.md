# SOAR-AI Typography Specification

## Overview
This document outlines the complete typography system for the SOAR-AI Corporate Intelligence Platform, including font sizes, weights, line heights, colors, and usage guidelines.

## Font Foundation

### Base Font Settings
- **Base Font Size**: 14px (0.875rem)
- **Primary Font Family**: System font stack (Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", etc.)
- **Base Line Height**: 1.5
- **Text Color**: #141414 (--foreground)

### Font Weight Scale
```css
--font-weight-normal: 400    /* Regular text, body content */
--font-weight-medium: 500    /* Headings, labels, buttons */
```

## Typography Scale

### Heading Typography

#### H1 - Main Page Headers
```css
font-size: 1.5rem (24px)
font-weight: 500 (medium)
line-height: 1.3
margin-bottom: 1rem
color: #141414
```
**Usage**: Main page titles, primary headers, section identifiers
**Examples**: "Corporate Search", "Lead Management", "Revenue Prediction"

#### H2 - Section Headers  
```css
font-size: 1.25rem (20px)
font-weight: 500 (medium)
line-height: 1.4
margin-bottom: 0.75rem
color: #141414
```
**Usage**: Major section dividers, card headers, panel titles
**Examples**: "Recent Activity", "Pipeline Overview", "Campaign Performance"

#### H3 - Subsection Headers
```css
font-size: 1.125rem (18px)
font-weight: 500 (medium)
line-height: 1.4
margin-bottom: 0.5rem
color: #141414
```
**Usage**: Card titles, form sections, data group headers
**Examples**: "Lead Details", "Contract Information", "Contact Preferences"

#### H4 - Component Headers
```css
font-size: 1rem (16px)
font-weight: 500 (medium)
line-height: 1.5
margin-bottom: 0.5rem
color: #141414
```
**Usage**: Widget titles, table headers, modal headers
**Examples**: "Quick Actions", "Recent Leads", "System Status"

#### H5 - Small Headers
```css
font-size: 0.875rem (14px)
font-weight: 500 (medium)
line-height: 1.5
margin-bottom: 0.25rem
color: #141414
```
**Usage**: List headers, small card titles, sidebar section headers
**Examples**: "Highlights", "COINHUB", "Recent Notifications"

#### H6 - Micro Headers
```css
font-size: 0.75rem (12px)
font-weight: 500 (medium)
line-height: 1.5
margin-bottom: 0.25rem
color: #141414
```
**Usage**: Smallest headers, metadata labels, micro-content headers
**Examples**: "Last Updated", "Status", "Priority Level"

### Body Typography

#### Large Body Text
```css
font-size: 1.125rem (18px)
font-weight: 400 (normal)
line-height: 1.6
margin-bottom: 1rem
color: #141414
```
**Usage**: Important descriptions, lead text, prominent content
**Examples**: Main content paragraphs, important notices

#### Regular Body Text
```css
font-size: 1rem (16px)
font-weight: 400 (normal)
line-height: 1.6
margin-bottom: 1rem
color: #141414
```
**Usage**: Standard paragraph text, descriptions, content body
**Examples**: Lead descriptions, contract details, help text

#### Small Body Text
```css
font-size: 0.875rem (14px)
font-weight: 400 (normal)
line-height: 1.5
color: #717182 (muted-foreground)
```
**Usage**: Secondary information, metadata, helper text
**Examples**: "Last updated 2 hours ago", timestamps, secondary descriptions

#### Extra Small Text
```css
font-size: 0.75rem (12px)
font-weight: 400 (normal)
line-height: 1.5
color: #717182 (muted-foreground)
```
**Usage**: Fine print, micro-data, status indicators
**Examples**: Version numbers, fine print, micro-labels

## UI Component Typography

### Buttons
```css
font-size: 0.875rem (14px)
font-weight: 500 (medium)
line-height: 1.5
```
**Usage**: All button elements, action controls
**Color**: Varies by button variant (primary: white, secondary: #133769)

### Form Elements

#### Input Fields
```css
font-size: 0.875rem (14px)
font-weight: 400 (normal)
line-height: 1.5
color: #141414
```

#### Labels
```css
font-size: 0.875rem (14px)
font-weight: 500 (medium)
line-height: 1.5
color: #141414
```

#### Placeholders
```css
font-size: 0.875rem (14px)
font-weight: 400 (normal)
color: #717182 (muted-foreground)
```

### Navigation Elements

#### Primary Navigation (Sidebar)
```css
font-size: 0.875rem (14px)
font-weight: 500 (medium)
line-height: 1.5
color: #141414
```

#### Secondary Navigation Descriptions
```css
font-size: 0.75rem (12px)
font-weight: 400 (normal)
line-height: 1.4
color: #717182 (muted-foreground)
```

#### Breadcrumbs
```css
font-size: 0.875rem (14px)
font-weight: 400 (normal)
color: #717182 (muted-foreground)
```

### Data Display

#### Table Headers
```css
font-size: 0.875rem (14px)
font-weight: 500 (medium)
line-height: 1.5
color: #141414
```

#### Table Cell Data
```css
font-size: 0.875rem (14px)
font-weight: 400 (normal)
line-height: 1.5
color: #141414
```

#### Data Labels
```css
font-size: 0.75rem (12px)
font-weight: 500 (medium)
line-height: 1.5
color: #717182 (muted-foreground)
```

#### Data Values
```css
font-size: 0.875rem (14px)
font-weight: 400 (normal)
line-height: 1.5
color: #141414
```

## Special Typography

### Brand Typography

#### Logo Text (SOAR-AI)
```css
font-size: 1.125rem (18px)
font-weight: 700 (bold)
color: #133769 (brand-primary)
```

#### Brand Tagline
```css
font-size: 0.75rem (12px)
font-weight: 400 (normal)
color: #717182 (muted-foreground)
```

### Status and Feedback

#### Success Messages
```css
font-size: 0.875rem (14px)
font-weight: 400 (normal)
color: #10b981 (success)
```

#### Error Messages
```css
font-size: 0.875rem (14px)
font-weight: 400 (normal)
color: #d4183d (destructive)
```

#### Warning Messages
```css
font-size: 0.875rem (14px)
font-weight: 400 (normal)
color: #f59e0b (warning)
```

### Badges and Tags
```css
font-size: 0.75rem (12px)
font-weight: 500 (medium)
line-height: 1.5
```

### Tooltips
```css
font-size: 0.75rem (12px)
font-weight: 400 (normal)
line-height: 1.4
color: #ffffff
```

## Color Usage

### Text Colors

#### Primary Text
- **Color**: #141414 (`--foreground`)
- **Usage**: Main content, headings, important text

#### Secondary Text  
- **Color**: #717182 (`--muted-foreground`)
- **Usage**: Helper text, descriptions, metadata

#### Brand Text
- **Color**: #133769 (`--primary`)
- **Usage**: Links, brand elements, call-to-action text

#### Inverse Text
- **Color**: #ffffff (`--primary-foreground`)
- **Usage**: Text on dark backgrounds, primary buttons

#### Error Text
- **Color**: #d4183d (`--destructive`)
- **Usage**: Error messages, validation feedback

### Interactive Text Colors

#### Link Default
- **Color**: #133769 (`--primary`)
- **Hover**: Darker shade of #133769

#### Button Text
- **Primary**: #ffffff on #133769 background
- **Secondary**: #133769 on transparent background
- **Outline**: #133769 with #133769 border

## Responsive Typography

### Mobile Considerations (< 768px)
- Maintain font sizes for readability
- Ensure touch targets are minimum 44px
- Reduce line-height slightly for compact displays

### Tablet Considerations (768px - 1024px)
- Standard typography scales apply
- Optimize for touch interaction

### Desktop Considerations (> 1024px)
- Full typography scale
- Optimal reading line lengths (45-75 characters)

## Implementation Guidelines

### CSS Classes
```css
/* Use existing Tailwind classes when available */
.text-xs     /* 12px - Extra small text */
.text-sm     /* 14px - Small text, UI elements */
.text-base   /* 16px - Standard body text */
.text-lg     /* 18px - Large body, H3 */
.text-xl     /* 20px - H2 headers */
.text-2xl    /* 24px - H1 headers */
.text-3xl    /* 30px - Large headers (rarely used) */
.text-4xl    /* 36px - Display headers (rarely used) */

/* Font weights */
.font-normal /* 400 - Regular text */
.font-medium /* 500 - Headings, labels */
```

### Best Practices

1. **Consistency**: Always use defined typography scales
2. **Hierarchy**: Maintain clear visual hierarchy with font sizes
3. **Readability**: Ensure sufficient contrast (minimum 4.5:1 ratio)
4. **Accessibility**: Support screen readers with semantic HTML
5. **Performance**: Minimize font loading with system fonts
6. **Spacing**: Use consistent margin/padding with typography

### Usage Examples

```jsx
/* Page Header */
<h1 className="text-2xl font-medium text-foreground mb-4">
  Corporate Search
</h1>

/* Section Header */
<h2 className="text-xl font-medium text-foreground mb-3">
  Recent Activity
</h2>

/* Body Text */
<p className="text-base text-foreground leading-relaxed mb-4">
  This is standard body text for descriptions and content.
</p>

/* Helper Text */
<p className="text-sm text-muted-foreground">
  Last updated 2 hours ago
</p>

/* Button Text */
<button className="text-sm font-medium">
  Create New Lead
</button>
```

## Typography Tokens Reference

| Token | Size | Weight | Usage |
|-------|------|---------|-------|
| `--text-xs` | 12px | 400/500 | Micro text, fine print |
| `--text-sm` | 14px | 400/500 | UI elements, labels |
| `--text-base` | 16px | 400 | Body text |
| `--text-lg` | 18px | 400/500 | Large body, H3 |
| `--text-xl` | 20px | 500 | H2 headers |
| `--text-2xl` | 24px | 500 | H1 headers |
| `--text-3xl` | 30px | 500 | Large headers |
| `--text-4xl` | 36px | 500 | Display headers |

This specification ensures consistent, accessible, and professional typography throughout the SOAR-AI application while maintaining brand identity and user experience standards.