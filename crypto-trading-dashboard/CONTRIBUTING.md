# Contributing to crypto-trading-dashboard

Thank you for contributing!

## Project Overview

A React-based cryptocurrency trading dashboard with real-time K-line charts, technical indicators (RSI, MACD, Bollinger Bands, Moving Averages), and market overview.

> Note: This project has been migrated from CRA to **Vite** (2025).

## Tech Stack

- **Frontend**: React 18
- **UI Library**: Ant Design
- **Charts**: ECharts + echarts-for-react
- **Routing**: React Router v6
- **Build Tool**: Vite

## Setup

```bash
cd crypto-trading-dashboard

# Install dependencies
npm install

# Start dev server (proxies API to avoid CORS)
npm run dev

# Production build
npm run build
```

## API Proxy Configuration

The Vite dev server proxies `/api` requests to external crypto APIs to avoid CORS issues. See `vite.config.js` for configuration.

## Adding New Charts

1. Add component to `src/components/charts/`
2. Import ECharts via `echarts-for-react`
3. Use `antd` Card component for consistent styling

## Pull Request Guidelines

- Test charts on multiple screen sizes (responsive)
- Use existing Ant Design components before custom ones
- Keep ECharts theme consistent with dark/light mode
- Update `vite.config.js` proxy if adding new API endpoints

## License

MIT License
