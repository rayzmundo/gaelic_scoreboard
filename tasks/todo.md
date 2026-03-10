# Gaelic Football Scoreboard - Implementation Plan

## Tasks

- [x] Create Angular 21 project in /Users/rayz/development/gaelic-scoreboard
- [x] Create CLAUDE.md with project rules
- [x] Create tasks/todo.md
- [x] Build scoreboard display bar (top dark bar with half, time, teams, scores, total points)
- [x] Build Teams/Scores configuration (name inputs, goal/point +/- buttons with 0-padded points)
- [x] Build Cards configuration (black/red cards with +/- for each team)
- [x] Build Time configuration (input, start/stop/reset, set half buttons)
- [x] Build Options tab with color pickers for team backgrounds
- [x] Add card display on scoreboard (below scores with white border, count when > 1)
- [x] Add time rules (red background over 30:00 in 1st half or 60:00 in 2nd half)
- [x] Style to match reference image
- [x] Build and verify - no compilation errors

## LocalStorage Persistence

- [x] Add `saveState()` method that writes all scores, colors, team names, cards, and half to localStorage as a single JSON object
- [x] Add `loadState()` method that reads from localStorage on app init and sets signal values
- [x] Call `saveState()` from every method that mutates state (score adjustments, card adjustments, color changes, team name changes, half changes)
- [x] Hook into template `(input)` events for team names and colors to also trigger save

### LocalStorage Review
- Added `saveState()` and `loadState()` private methods to `app.ts` using a single `gaelic-scoreboard-state` localStorage key
- `loadState()` is called in the constructor; defensively checks each field before setting
- `saveState()` is called at the end of: `adjustGoals`, `adjustTwoPointers`, `adjustPoints`, `adjustCard`, `setFirstHalf`, `setSecondHalf`
- Added 4 small wrapper methods (`setTeam1Name`, `setTeam2Name`, `setTeam1Color`, `setTeam2Color`) to replace inline signal sets in the template, so saves also fire on name/color input
- Timer state is intentionally NOT persisted (transient)
- Build passes with zero errors

## Review

### Summary of Changes
All changes were made in 4 files within the Angular project:

1. **src/app/app.ts** - Main component with all state management using Angular signals:
   - Half indicator (1st/2nd)
   - Timer with start/stop/reset and set-half controls
   - Team names, colors, scores (goals + points with total calculation: goal = 3 pts)
   - Black and red card counts per team
   - Timer overrun detection (red background at 30:00 for 1st half, 60:00 for 2nd half)

2. **src/app/app.html** - Template with:
   - Scoreboard display bar matching the reference layout
   - Tabbed interface (Scoreboard / Options)
   - Teams/Scores, Cards, Time config sections under Scoreboard tab
   - Color pickers under Options tab
   - Cards shown on scoreboard with white border and count when > 1

3. **src/app/app.css** - All styling to match the reference image layout

4. **src/styles.css** - Global body reset styles

### Architecture
- Single component app (AppComponent) - kept simple as requested
- Angular signals for reactive state management
- No external dependencies beyond Angular core and FormsModule
- All logic contained in one component file for simplicity
