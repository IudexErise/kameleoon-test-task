## Visualization library

This project uses Recharts Library (v.3.5.0) and sub-library Recharts-to-png (v.3.0.1)

## Setup & Run Locally

``` bash
# 1. Clone the repo
git clone https://github.com/IudexErise/kameleoon-test-task.git

# 2. Go to the project folder
cd YOUR_REPO

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev      
```
## Requirements

(+) Display a **conversion rate (conversionRate)** line chart for all variations, showing all values as **percentages**.

(+)  On **hover**, show a **vertical line** and a **popup** with daily data.

(+) At least **one variation must always be selected**.

(+) When variations are toggled, both X and Y axes must **adapt automatically** to the visible data range.

(+) Display all values as **percentages**.

(+) Responsive layout for screens between **671 px** and **1300 px**.

(+) Controls:
  - **Variations selector** (choose which lines to display)
  - **Day / Week selector** (using Brush native element)

## Bonus Features

(+) Zoom / Reset zoom

(+) Line style selector (`Line`, `Smooth`, `Area`)

(+) Light / Dark theme toggle

(+) Export chart to PNG
