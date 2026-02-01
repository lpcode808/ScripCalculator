# ScripCalculator - Project-Specific Guide

**Punahou Carnival 2026 Scrip Calculator** - Mobile-first web app for calculating carnival food scrip needs

## Project Overview

Annual scrip calculator for Punahou School's carnival fundraiser. Users calculate how much carnival currency (scrip) they need to purchase food and beverages.

**Theme 2026**: "Welcome to the Jungle" 🦜🌴
**Deployment**: GitHub Pages at lpcode808.github.io

## Key Design Principles

### Theme & Branding
- **Colors inspired by carnival artwork**:
  - Jungle greens: `#2D5016` (primary), `#1B4D0E` (dark)
  - Carnival yellow: `#FDB71A` (accent)
  - Warm creme background: `#FFFAED` (derived from yellow)
  - Tropical accents: Parrot blue/orange
- **Emojis**: 🦜 parrot (favicon), 🤠 (carnival), food category icons
- **Fonts**: Merriweather (headings), Overpass (body)

### Mobile-First Critical
- **Primary users**: Parents on phones at carnival
- Touch-optimized buttons (48px minimum)
- Collapsible categories to manage screen space
- Fixed header with running totals always visible
- Real-time calculations as quantities change

### Annual Update Workflow

**Every January (for February carnival):**
1. Get official price sheet from Punahou
2. Update `data/menu.json` with new prices
3. Check for booth changes (new locations, discontinued items)
4. Update theme colors if carnival artwork changes
5. Update timestamp in `index.html`
6. Test on mobile devices
7. Push to GitHub Pages

**Scrip Value**: Currently 1 scrip = $1 (changed from 50¢ in 2025)

## Technical Stack

- **Pure HTML/CSS/JS** - No build tools, no frameworks
- **Data-driven**: `menu.json` drives all content
- **Local development**: `python3 -m http.server 8000`
- **Deployment**: GitHub Pages (automatic from main branch)

## File Structure

```
ScripCalculator/
├── index.html           # Main page
├── css/styles.css       # All styling
├── js/main.js          # App logic with hash map optimization
├── data/menu.json      # Menu items and prices (UPDATE ANNUALLY)
├── CLAUDE.md           # This file
├── README.md           # User-facing documentation
├── AGENT-GUIDE.md      # General agent guide
├── plan.md             # Performance optimization plan
└── planningDocs/
    └── log.md          # Development log
```

## Key Features

### Performance Optimizations
- **Hash map indexing**: `categoryById`, `itemById` for O(1) lookups
- **Slugified IDs**: Safe DOM IDs from category names
- **Event delegation**: Efficient button handling
- **Real-time updates**: `oninput` events for instant feedback

### Accessibility
- Removed `user-scalable=no` (better for zoom)
- `aria-label` on all buttons
- `rel="noopener"` on external links
- High contrast jungle green text on creme background
- Keyboard navigable

### UX Features
- **Clear button**: Reset all quantities at once
- **Order Summary**: Collapsible list of selected items
- **Category totals**: See scrip per section
- **Running total**: Sticky header shows grand total + cost
- **Auto-rounding**: Calculates sheets needed (rounds up to $10)

## Common Development Tasks

### Update Menu for New Year
```bash
# 1. Edit menu data
vim data/menu.json

# 2. Update timestamp in HTML
# Change: <div class="last-updated">updated: [DATE]</div>

# 3. Test locally
python3 -m http.server 8000

# 4. Commit and push
git add data/menu.json index.html
git commit -m "Update for 2027 carnival"
git push origin main
```

### Change Theme Colors
```css
/* Edit css/styles.css :root variables */
--primary-color: #...;      /* Category headers */
--accent-color: #...;       /* Highlights */
--background-color: #...;   /* Page background */
```

### Add New Category
```json
// In data/menu.json, add to categories array:
{
  "name": "NEW CATEGORY",
  "icon": "🍕",
  "items": [
    {"id": "unique_id", "name": "Item Name", "scrip": 5}
  ]
}
```

## Critical Constraints

### Must Maintain
- ✅ Mobile-first responsive design
- ✅ No build tools (pure HTML/CSS/JS)
- ✅ Fast load time (< 3 seconds on slow connections)
- ✅ Works without JavaScript (progressive enhancement)
- ✅ Accessible (WCAG 2.1 AA)

### Never Change
- ❌ Don't add frameworks (React, etc.) - keep it simple
- ❌ Don't add build tools - must work with simple HTTP server
- ❌ Don't complicate deployment - GitHub Pages only
- ❌ Don't break mobile - 90% of traffic is mobile

## Timestamp Protocol

**IMPORTANT**: Always use actual current date/time for updates!

Check current time:
```bash
date  # Returns actual HST time
```

Update timestamp in `index.html`:
```html
<div class="last-updated">updated: M/D/YYYY H:MM AM/PM HST</div>
```

**Format**: `1/31/2026 9:05 PM HST` (no leading zeros, 12-hour time)

## GitHub Deployment

**Repo**: https://github.com/lpcode808/ScripCalculator
**Live Site**: https://lpcode808.github.io/ScripCalculator

Auto-deploys from `main` branch. No build process - files served directly.

## Testing Checklist

Before deploying:
- [ ] Test on iOS Safari (primary user device)
- [ ] Test on Android Chrome
- [ ] Verify all calculations are correct
- [ ] Check collapsible categories work
- [ ] Test Clear button
- [ ] Verify timestamp is current
- [ ] Check all emojis display correctly
- [ ] Test with 0, 1, and many items

## Historical Context

### 2026 Changes
- Theme: "Welcome to the Jungle" with tropical colors
- Scrip value changed: 50¢ → $1
- Significant price reductions across most items
- Added ICE CREAM AND SNACKS category
- Improved performance with hash map indexing

### 2025 Changes
- Added Hawaiian Plate, Noodles, Saimin booths
- Removed Chili/Rice Bowl
- Malasada prices doubled
- Introduced collapsible categories

## Future Considerations

**If carnival grows significantly:**
- Consider adding search/filter functionality
- Add "Favorites" for returning users (localStorage)
- Consider offline PWA support
- Add print-friendly summary view

**Keep in mind:**
- This is a community service tool, not a commercial product
- Simplicity and reliability > fancy features
- Most users are parents scrambling at carnival
- Fast, simple, accurate is the goal

## Contact

**Maintainer**: Justin Lai (justinlai@alum.mit.edu)
**Community**: Punahou ohana

---

*Last updated: January 31, 2026*
*Next update: January 2027 (for 2027 carnival)*
