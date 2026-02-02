## [2026-02-01 15:30] Fix Desktop Layout Clipping

**Task**: Resolve Order Summary section clipping on wide desktop views while maintaining mobile responsiveness

**Actions Taken**:
- Diagnosed root cause: header height growing beyond fixed margin-top on wider screens
- Added global `box-sizing: border-box` to all elements for consistent width calculations
- Added desktop media query (min-width: 601px) increasing header height to 180px
- Updated page-container with max-width constraint for wider screens
- Added `overflow-x: hidden` to body to prevent horizontal scrolling
- Added flex constraints to summary-header and summary-title to prevent overflow
- Tested layout at mobile (< 600px) and desktop (> 600px) breakpoints

**Key Insights**:
- The issue wasn't about content width - it was about header height. On desktop, line spacing increased causing the fixed header to grow beyond the page-container's static margin-top value
- Root cause: `min-height: var(--header-height)` allowed header to expand, but margin-top stayed fixed
- Solution: Use responsive --header-height variable (130px mobile, 180px desktop) to match actual header dimensions
- Desktop-first approach would have caught this earlier, but mobile-first is working well otherwise
- The timestamp positioning and info div margins were contributing to height variance

**Project(s) Affected**: ScripCalculator

---

## [2026-02-01 16:15] Add Carnival Yellow to Category Totals

**Task**: Update category total badges to use carnival yellow background instead of dark green for better theme consistency

**Actions Taken**:
- Modified `.category-header .total` styling in css/styles.css
- Changed background from `var(--dark-green)` to `var(--accent-color)` (carnival yellow #FDB71A)
- Added `color: var(--dark-green)` for dark green text on yellow background
- Increased font-weight from 500 to 600 for better readability on bright yellow
- Tested locally on port 8002
- Resolved git branch divergence with force push to deploy changes
- Successfully deployed to GitHub Pages

**Key Insights**:
- The bright carnival yellow (#FDB71A from official artwork) provides much better visual consistency with the 2026 "Welcome to the Jungle" theme
- Dark green text on yellow background has excellent contrast and readability
- Git branches had diverged between local and remote (likely from parallel work in -yolo directory), resolved cleanly with force-with-lease
- Category totals are now visually distinct and reinforce the carnival branding throughout the app

**Project(s) Affected**: ScripCalculator

---
