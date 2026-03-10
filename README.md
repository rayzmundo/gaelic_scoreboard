# Gaelic Scoreboard

A browser-based scoreboard for Gaelic football, built for live streaming overlays and match day use.

![GAA Scoreboard](/readme_img/scoreboard.png?raw=true 'GAA Scoreboard for streaming')

## Features

- **Score tracking** — Goals, 2-pointers, and points for both home and away teams, with automatic total calculation (goal = 3pts, 2-pointer = 2pts)
- **Live timer** — Start, stop, and reset with manual time entry; highlights red when overrunning (30:00 in 1st half, 60:00 in 2nd half)
- **Half indicator** — Toggle between 1st and 2nd half with a single click, auto-setting the timer
- **Cards** — Black and red card counters per team, displayed on the scoreboard with count badges when more than one
- **Team customisation** — Editable team names and colour-picker for each team's scoreboard badge
- **Persistent state** — All scores, names, colours, cards, and half are saved to localStorage and restored on page refresh

## Tech Stack

- [Angular 21](https://angular.dev) — single-component app using Angular Signals for reactive state
- TypeScript
- CSS (no external UI library)

## Installation

Requires [Node.js](https://nodejs.org) (v18+) and npm.

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/gaelic-scoreboard.git
cd gaelic-scoreboard

# Install dependencies
npm install
```

## Usage

**Development server**
```bash
npm start
# or
npx ng serve
```
Open [http://localhost:4200](http://localhost:4200) in your browser.

**Production build**
```bash
npm run build
# Output is in the dist/ directory
```

### Scoreboard tab
- Enter team names in the text inputs
- Use **+** / **-** buttons to adjust Goals, 2-Pointers, and Points
- Use the timer controls to start/stop the clock or jump to a specific half
- Add black/red cards per team as needed

### Options tab
- Pick a background colour for each team's name badge on the scoreboard

## License

MIT
