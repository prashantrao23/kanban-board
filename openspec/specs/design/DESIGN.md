---
name: Kinetic Minimalist
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#464555'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#3a495f'
  on-tertiary: '#ffffff'
  tertiary-container: '#516177'
  on-tertiary-container: '#ccdcf7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  container-margin: 24px
  column-width: 280px
---

## Brand & Style

The design system is engineered for high-performance productivity, specifically tailored for professional SaaS environments where cognitive load must be minimized. The brand personality is disciplined, precise, and unobtrusive, allowing user content to take center stage.

Drawing inspiration from modern software like Linear and Notion, the style is a refined blend of **Minimalism** and **Modern Corporate** aesthetics. It utilizes "Invisible UI" principles—where borders and backgrounds are subtle enough to disappear during deep work but remain structurally sound for navigation. The emotional response should be one of calm control and systematic efficiency. Key visual drivers include generous whitespace, high-quality typography, and a "layered paper" approach to depth.

## Colors

The palette is anchored by a soft, cool neutral background (`#F8FAFC`) to reduce screen glare during long working sessions. 

- **Primary (Indigo):** Used exclusively for primary actions, focus states, and active navigation indicators to ensure high signaling value.
- **Secondary (Emerald):** Reserved for "Success" states, completion indicators, and positive growth metrics.
- **Neutral/Surface:** The system relies on white (`#FFFFFF`) for interactive containers (cards, modals) to create a clear "raised" distinction from the background. 
- **Borders:** A consistent, low-contrast slate (`#E2E8F0`) defines boundaries without creating visual noise.

## Typography

This design system uses **Inter** exclusively to leverage its exceptional legibility in data-dense interfaces. 

The type hierarchy is strictly functional. `Display` and `Headline` roles use tighter letter spacing and heavier weights to provide architectural anchors on the page. `Body-md` (14px) is the workhorse size for Kanban card content and metadata. `Label-sm` uses uppercase styling with increased tracking for secondary metadata (like IDs or status categories) to distinguish it from interactive text. All line heights are optimized for a 4px or 8px baseline grid alignment.

## Layout & Spacing

The system follows a strict **8px linear scale**. All padding, margins, and component heights must be multiples of 8 (with 4px used for tight internal component spacing).

**The Kanban Grid:**
- **Desktop:** A horizontally-scrolling fluid layout where columns have a fixed minimum width (`280px`) and expand slightly to fill the viewport.
- **Gutters:** Standardized at `16px` to maintain clear separation between task stacks.
- **Margins:** Page-level padding is `24px` on desktop and scales down to `16px` on mobile.

On mobile devices, the Kanban columns stack vertically or transition into a tabbed view to ensure accessibility, as horizontal scrolling of large columns is discouraged on small touch devices.

## Elevation & Depth

This design system uses **Tonal Layering** combined with **Ambient Shadows** to communicate hierarchy.

- **Level 0 (Background):** `#F8FAFC` - The canvas.
- **Level 1 (Cards/Sidebar):** White surface with a `1px` solid border (`#E2E8F0`). 
- **Shadows:** Use a "Natural Light" shadow model. 
  - *Resting Card:* `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)`
  - *Hover State:* `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)`
  - *Dragged State:* `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)`

Avoid heavy black shadows; instead, use low-opacity blurs to simulate soft studio lighting.

## Shapes

The shape language is "Soft-Modern," utilizing a `16px` (1rem) corner radius for primary containers like Kanban cards and modals. This high degree of roundedness promotes a friendly, approachable tool feel.

- **Base Components:** Buttons and input fields use `8px` (rounded-lg) for a more professional, stable look.
- **Kanban Cards:** Use `16px` (rounded-xl) to create a distinct "object" feel.
- **Badges/Chips:** Use full pill-shaping (9999px) to contrast against the more rectangular cards.

## Components

### Buttons
Primary buttons use the Indigo background with white text. Secondary buttons use a white background with a subtle border and Indigo text. Interaction states (Hover/Active) should be represented by a 10% darkening of the background color.

### Kanban Cards
The core component of the system. Cards must have a white background, `16px` rounded corners, and the Level 1 resting shadow. Internal padding should be `16px`. Status indicators (priority icons) should be placed in the top-right corner.

### Badges/Chips
Low-saturation backgrounds with high-saturation text. For example, a "High Priority" badge uses a light red background with deep red text. Shape is always pill-style.

### Input Fields
Inputs should have an `8px` radius and a `1px` border. On focus, the border transitions to Primary Indigo with a `3px` soft glow (box-shadow) in the same color at 20% opacity.

### Lists & Navigation
Sidebar items use a ghost-hover state (light gray background appearing on hover). The active state is indicated by a vertical 3px Indigo line on the leading edge of the list item.