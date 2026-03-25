# 加密货币量化交易仪表板

一个基于React的现代化前端应用，为交易者提供直观美观的加密货币市场数据可视化界面。

## 功能特性

- 📊 实时K线图表展示，支持多种时间维度切换
- 📈 市场概览数据（交易量、持仓量、贪婪指数）
- 🎯 支撑位和阻力位标记
- 📉 技术指标分析（RSI、MACD、布林带、移动平均线）
- 📱 响应式设计，支持移动端和桌面端
- 🌙 深色/浅色主题切换
- 🔍 币种详情页面深度分析

## 技术栈

- **前端框架**: React 18
- **UI组件库**: Ant Design
- **图表库**: ECharts + echarts-for-react
- **样式**: 原生CSS + CSS变量
- **状态管理**: React内置状态（useState、useContext）
- **路由**: React Router v6
- **构建工具**: Vite (已从 CRA 迁移，2025)

## 项目结构

```
src/
├── components/          # 组件文件夹
│   ├── charts/         # 图表组件
│   │   ├── KLineChart.js       # K线图表组件
│   │   ├── TechnicalIndicators.js  # 技术指标组件
│   │   └── TrendChart.js       # 趋势图表组件
│   ├── cards/          # 卡片组件
│   │   ├── MarketOverviewCard.js   # 市场概览卡片
│   │   ├── OverviewCards.js        # 概览卡片容器
│   │   └── CoinInfoCard.js         # 币种信息卡片
│   └── common/         # 通用组件
│       ├── Layout.js           # 页面布局组件
│       ├── Header.js           # 头部组件
│       ├── TimeSelector.js     # 时间选择器
│       └── ThemeButton.js      # 主题切换按钮
├── pages/              # 页面文件夹
│   ├── Home.js         # 主页面（仪表板）
│   └── CoinDetail.js   # 币种详情页面
├── api/                # 接口文件夹
│   └── request.js      # 所有API请求函数
├── utils/              # 工具函数
│   └── tools.js        # 格式化等工具函数
├── styles/             # 样式文件
│   └── main.css        # 主样式文件（主题、响应式等）
├── App.js              # 主程序文件
└── index.js            # 程序入口文件
```

## 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖

```bash
# 克隆项目
git clone [项目地址]
cd crypto-trading-dashboard

# 安装依赖
npm install
```

### 运行项目

```bash
# 启动开发服务器
npm start
```

项目将在 http://localhost:3000 打开

### 其他命令

```bash
# 运行测试
npm test

# 构建生产版本
npm run build

# 代码检查
npm run lint
```

### API 代理说明

本项目通过 Vite 代理连接后端服务（默认：`http://localhost:8000`）。代理配置位于 `vite.config.js`：

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

如需修改后端地址，编辑 `vite.config.js` 中的 `target` 配置。

## API接口说明

项目通过RESTful API与后端服务通信，主要接口包括：

### 市场概览数据
```
GET /api/market/overview
```
获取24小时交易量、持仓量变化和贪婪指数

### K线数据
```
GET /api/kline/{symbol}?timeframe={timeframe}&limit={limit}
```
获取指定交易对和时间维度的K线数据

### 支撑阻力位
```
GET /api/levels/{symbol}?timeframe={timeframe}
```
获取支撑位和阻力位数据

### 技术指标
```
GET /api/indicators/{symbol}?timeframe={timeframe}&indicators={indicators}
```
获取技术指标数据（RSI、MACD等）

## 开发指南

### 代码规范

1. **组件命名**: 使用PascalCase，如 `KLineChart`
2. **文件命名**: 与组件名保持一致
3. **函数命名**: 使用camelCase，动词开头，如 `getData`
4. **变量命名**: 使用有意义的名称，布尔值用is/has/can前缀

### 注释要求

每个文件都需要包含：
- 文件头部注释（功能说明）
- 函数注释（参数、返回值说明）
- 复杂逻辑的行内注释

示例：
```javascript
/**
 * 文件名: KLineChart.js
 * 功能: K线图表组件，支持时间维度切换和支撑阻力位显示
 * 作者: [开发者姓名]
 * 创建时间: 2024-01-01
 */

/**
 * 格式化价格数字
 * @param {number} price - 原始价格数字
 * @param {number} decimals - 保留小数位数，默认2位
 * @returns {string} 格式化后的价格字符串
 */
function formatPrice(price, decimals = 2) {
  // 实现逻辑...
}
```

### 主题系统

项目支持深色和浅色主题切换，使用CSS变量实现：

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #333333;
  /* 更多变量... */
}

:root[data-theme="dark"] {
  --bg-primary: #1f1f1f;
  --text-primary: #ffffff;
  /* 更多变量... */
}
```

### 响应式设计

项目采用移动优先的响应式设计：

- **移动端** (< 768px): 单列布局
- **平板端** (768px - 1024px): 两列布局
- **桌面端** (> 1024px): 多列布局

## 部署

### 构建生产版本

```bash
npm run build
```

构建完成后，`build` 文件夹包含了可部署的静态文件。

### 部署到服务器

可以部署到任何支持静态文件的服务器，如：
- Nginx
- Apache
- Vercel
- Netlify

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请通过以下方式联系：

- 项目Issues: [GitHub Issues链接]
- 邮箱: [联系邮箱]

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 基础K线图表功能
- 市场概览数据展示
- 响应式设计支持