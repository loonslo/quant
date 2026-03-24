/**
 * 文件名: config.js
 * 功能: 应用配置文件，包含时间选项、API地址、图表主题等全局设置
 * 作者: 开发者
 * 创建时间: 2024-01-01
 * 说明: 集中管理应用的所有配置项，方便维护和修改
 */

// ==================== 时间维度配置 ====================
/**
 * 时间维度选项配置
 * 用于K线图表和其他时间相关组件的时间选择器
 * 每个选项包含：显示文本、API参数值、描述
 */
export const TIME_OPTIONS = [
  {
    label: '1分钟',        // 显示在界面上的文字
    value: '1m',          // 发送给API的参数值
    description: '1分钟K线数据'
  },
  {
    label: '5分钟',
    value: '5m',
    description: '5分钟K线数据'
  },
  {
    label: '15分钟',
    value: '15m',
    description: '15分钟K线数据'
  },
  {
    label: '1小时',
    value: '1h',
    description: '1小时K线数据'
  },
  {
    label: '4小时',
    value: '4h',
    description: '4小时K线数据'
  },
  {
    label: '1天',
    value: '1d',
    description: '1天K线数据'
  }
];

/**
 * 趋势图表时间范围选项
 * 用于趋势分析页面的时间范围选择
 */
export const TREND_TIME_RANGES = [
  {
    label: '1天',
    value: '1d',
    description: '最近1天的价格趋势'
  },
  {
    label: '1周',
    value: '1w',
    description: '最近1周的价格趋势'
  },
  {
    label: '30天',
    value: '30d',
    description: '最近30天的价格趋势'
  }
];

// ==================== API配置 ====================
/**
 * API基础配置
 * 包含后端服务的地址和通用设置
 */
export const API_CONFIG = {
  // 后端API的基础地址，开发环境和生产环境可以不同
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  
  // 请求超时时间（毫秒）
  TIMEOUT: 30000,
  
  // 自动重试次数（网络错误时）
  RETRY_COUNT: 3,
  
  // 重试间隔时间（毫秒）
  RETRY_DELAY: 1000
};

/**
 * API接口路径配置
 * 定义所有后端接口的路径，方便统一管理
 */
export const API_ENDPOINTS = {
  // 市场概览数据接口
  MARKET_OVERVIEW: '/market/overview',
  
  // K线数据接口，需要传入交易对和时间维度参数
  KLINE_DATA: '/kline',
  
  // 支撑阻力位数据接口
  SUPPORT_RESISTANCE: '/levels',
  
  // 技术指标数据接口
  TECHNICAL_INDICATORS: '/indicators',
  
  // 趋势数据接口
  TREND_DATA: '/trend',
  
  // 币种列表接口
  COIN_LIST: '/coins'
};

// ==================== 图表主题配置 ====================
/**
 * 浅色主题配置
 * 定义浅色模式下图表和界面的颜色方案
 */
export const LIGHT_THEME = {
  // 背景颜色
  backgroundColor: '#ffffff',
  
  // 文字颜色
  textColor: '#333333',
  
  // 边框颜色
  borderColor: '#e0e0e0',
  
  // 网格线颜色
  gridColor: '#f0f0f0',
  
  // K线图颜色配置
  candlestick: {
    upColor: '#00da3c',      // 上涨蜡烛颜色（绿色）
    downColor: '#ec0000',    // 下跌蜡烛颜色（红色）
    upBorderColor: '#00da3c', // 上涨蜡烛边框颜色
    downBorderColor: '#ec0000' // 下跌蜡烛边框颜色
  },
  
  // 折线图颜色
  lineColors: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'],
  
  // 支撑阻力位颜色
  supportColor: '#52c41a',    // 支撑位颜色（绿色）
  resistanceColor: '#f5222d'  // 阻力位颜色（红色）
};

/**
 * 深色主题配置
 * 定义深色模式下图表和界面的颜色方案
 */
export const DARK_THEME = {
  // 背景颜色
  backgroundColor: '#1f1f1f',
  
  // 文字颜色
  textColor: '#ffffff',
  
  // 边框颜色
  borderColor: '#404040',
  
  // 网格线颜色
  gridColor: '#2d2d2d',
  
  // K线图颜色配置
  candlestick: {
    upColor: '#00da3c',      // 上涨蜡烛颜色（绿色）
    downColor: '#ec0000',    // 下跌蜡烛颜色（红色）
    upBorderColor: '#00da3c', // 上涨蜡烛边框颜色
    downBorderColor: '#ec0000' // 下跌蜡烛边框颜色
  },
  
  // 折线图颜色
  lineColors: ['#177ddc', '#49aa19', '#d89614', '#d32029', '#531dab'],
  
  // 支撑阻力位颜色
  supportColor: '#49aa19',    // 支撑位颜色（绿色）
  resistanceColor: '#d32029'  // 阻力位颜色（红色）
};

// ==================== 应用设置 ====================
/**
 * 默认应用设置
 * 定义应用启动时的默认配置
 */
export const DEFAULT_SETTINGS = {
  // 默认主题模式
  theme: 'light',
  
  // 默认选中的交易对
  defaultSymbol: 'BTCUSDT',
  
  // 默认时间维度
  defaultTimeframe: '1h',
  
  // 默认趋势时间范围
  defaultTrendRange: '1d',
  
  // 是否自动刷新数据
  autoRefresh: true,
  
  // 自动刷新间隔（毫秒）
  refreshInterval: 30000,
  
  // 数据加载动画持续时间（毫秒）
  loadingDuration: 300
};

/**
 * 本地存储键名配置
 * 定义保存到localStorage的数据键名
 */
export const STORAGE_KEYS = {
  // 用户主题偏好
  THEME: 'crypto_dashboard_theme',
  
  // 最后选择的交易对
  LAST_SYMBOL: 'crypto_dashboard_last_symbol',
  
  // 最后选择的时间维度
  LAST_TIMEFRAME: 'crypto_dashboard_last_timeframe',
  
  // 用户自定义设置
  USER_SETTINGS: 'crypto_dashboard_user_settings'
};

// ==================== 图表配置 ====================
/**
 * ECharts图表通用配置
 * 定义图表的基础样式和行为
 */
export const CHART_CONFIG = {
  // 图表动画配置
  animation: {
    duration: 300,           // 动画持续时间
    easing: 'cubicOut'       // 动画缓动函数
  },
  
  // 工具栏配置
  toolbox: {
    show: true,              // 是否显示工具栏
    feature: {
      saveAsImage: {         // 保存为图片功能
        show: true,
        title: '保存为图片'
      },
      restore: {             // 重置缩放功能
        show: true,
        title: '重置'
      },
      dataZoom: {            // 数据缩放功能
        show: true,
        title: {
          zoom: '区域缩放',
          back: '缩放还原'
        }
      }
    }
  },
  
  // 数据缩放配置
  dataZoom: {
    show: true,              // 是否显示数据缩放滑块
    type: 'slider',          // 滑块类型
    start: 70,               // 初始显示数据的起始百分比
    end: 100                 // 初始显示数据的结束百分比
  }
};

/**
 * 响应式断点配置
 * 定义不同屏幕尺寸下的布局断点
 */
export const BREAKPOINTS = {
  // 移动设备最大宽度
  mobile: 768,
  
  // 平板设备最大宽度
  tablet: 1024,
  
  // 桌面设备最小宽度
  desktop: 1025
};

// ==================== 数据格式配置 ====================
/**
 * 数字格式化配置
 * 定义不同类型数据的显示格式
 */
export const FORMAT_CONFIG = {
  // 价格显示小数位数
  priceDecimals: 2,
  
  // 百分比显示小数位数
  percentDecimals: 2,
  
  // 交易量显示格式
  volumeFormat: 'compact',   // 'compact' 显示为 1.2M, 'full' 显示完整数字
  
  // 日期时间显示格式
  dateFormat: 'YYYY-MM-DD HH:mm:ss',
  
  // 货币符号
  currencySymbol: '$'
};

/**
 * 错误消息配置
 * 定义各种错误情况下显示给用户的友好提示
 */
export const ERROR_MESSAGES = {
  // 网络错误
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  
  // 数据加载失败
  DATA_LOAD_ERROR: '数据加载失败，请稍后重试',
  
  // API错误
  API_ERROR: '服务器响应异常，请联系技术支持',
  
  // 数据格式错误
  DATA_FORMAT_ERROR: '数据格式异常，请刷新页面重试',
  
  // 超时错误
  TIMEOUT_ERROR: '请求超时，请检查网络连接'
};

// ==================== 键盘快捷键配置 ====================
/**
 * 键盘快捷键配置
 * 定义时间维度切换的快捷键映射
 */
export const KEYBOARD_SHORTCUTS = {
  // 数字键1-6对应不同时间维度
  '1': '1m',    // 按键1对应1分钟
  '2': '5m',    // 按键2对应5分钟
  '3': '15m',   // 按键3对应15分钟
  '4': '1h',    // 按键4对应1小时
  '5': '4h',    // 按键5对应4小时
  '6': '1d'     // 按键6对应1天
};

// ==================== 币种配置 ====================
/**
 * 默认币种列表
 * 定义应用支持的主要加密货币交易对
 */
export const DEFAULT_COINS = [
  {
    symbol: 'BTCUSDT',
    name: '比特币',
    icon: 'btc'
  },
  {
    symbol: 'ETHUSDT',
    name: '以太坊',
    icon: 'eth'
  },
  {
    symbol: 'BNBUSDT',
    name: '币安币',
    icon: 'bnb'
  },
  {
    symbol: 'ADAUSDT',
    name: '艾达币',
    icon: 'ada'
  },
  {
    symbol: 'SOLUSDT',
    name: 'Solana',
    icon: 'sol'
  }
];

// ==================== 技术指标配置 ====================
/**
 * 技术指标配置
 * 定义支持的技术指标类型和默认参数
 */
export const TECHNICAL_INDICATORS = {
  // RSI相对强弱指数
  RSI: {
    name: 'RSI',
    displayName: '相对强弱指数',
    period: 14,              // 默认周期
    overbought: 70,          // 超买线
    oversold: 30             // 超卖线
  },
  
  // MACD指标
  MACD: {
    name: 'MACD',
    displayName: 'MACD指标',
    fastPeriod: 12,          // 快线周期
    slowPeriod: 26,          // 慢线周期
    signalPeriod: 9          // 信号线周期
  },
  
  // 布林带
  BOLLINGER: {
    name: 'BOLLINGER',
    displayName: '布林带',
    period: 20,              // 周期
    stdDev: 2                // 标准差倍数
  },
  
  // 移动平均线
  MA: {
    name: 'MA',
    displayName: '移动平均线',
    periods: [5, 10, 20, 50] // 支持的周期
  }
};