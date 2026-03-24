# Crypto Trading Dashboard

加密货币交易 Dashboard，包含后端 API 和前端看板。

## 项目结构

```
quant/
├── crypto-trading-dashboard/    # React 前端
│   ├── src/                     # 源代码
│   ├── public/                  # 静态资源
│   ├── build/                   # 构建产物
│   └── package.json
├── user_strategies/             # 用户策略目录
├── config/                      # 配置文件
└── 接口v2.md                    # API 文档
```

## 功能

- 实时加密货币行情查看
- 交易下单（市价/限价）
- 持仓查询
- 技术指标分析（支撑位/阻力位）
- 策略回测

## 技术栈

- **前端**: React (CRA)
- **后端 API**: RESTful
- **数据源**: Binance API, CoinGecko API

## API 接口

详见 [接口v2.md](./接口v2.md)

### 基础 URL

```
https://api.your-domain.com/api
```

### 主要接口

| 接口 | 说明 |
|------|------|
| `POST /api/market/list` | 获取市场行情 |
| `POST /api/trade/order` | 下单交易 |
| `POST /api/position/list` | 持仓查询 |

## 开发

### 前端

```bash
cd crypto-trading-dashboard
npm install
npm start
```

### 后端

（需要自行搭建后端服务，API 文档见接口v2.md）

## 注意事项

- 请勿将 API Key 直接写入代码，使用环境变量
- 实盘交易前请充分测试
- 谨慎处理敏感配置信息
