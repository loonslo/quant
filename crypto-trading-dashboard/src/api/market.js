/**
 * 市场数据API接口
 * 封装所有与市场数据相关的API调用
 */

import { get, post } from './request';

/**
 * 获取市场总览数据（v2.0）
 * 返回主要加密货币的实时价格、涨跌幅、24小时交易量等市场概况信息（支持批量查询）
 * @param {Array<string>} symbols - 可选，币种符号列表，如 ['BTCUSDT', 'ETHUSDT']
 * @returns {Promise<Array>} 返回市场数据对象数组
 *  [{
 *    symbol: 'BTCUSDT',
 *    name: 'Bitcoin',
 *    current_price: 68000.00,
 *    price_change_24h: 1200.50,
 *    price_change_percentage_24h: 1.80,
 *    volume_24h: 25000000000.00,
 *    high_24h: 68500.00,
 *    low_24h: 67000.00,
 *    circulating_supply: 19750000.00,
 *    total_supply: 21000000.00,
 *    last_updated: '2025-11-04T20:46:12'
 *  }]
 */
export const getMarketData = async (symbols = []) => {
  try {
    // 默认获取 BTC 和 ETH
    const requestBody = symbols.length > 0 ? { symbols } : {};

    const data = await post('/api/market/list', requestBody);

    // 数据标准化处理
    if (Array.isArray(data)) {
      return data.map(item => ({
        symbol: item.symbol,
        name: item.name,
        current_price: parseFloat(item.current_price || 0),
        price_change_24h: parseFloat(item.price_change_24h || 0),
        price_change_percentage_24h: parseFloat(item.price_change_percentage_24h || 0),
        volume_24h: parseFloat(item.volume_24h || 0),
        high_24h: parseFloat(item.high_24h || 0),
        low_24h: parseFloat(item.low_24h || 0),
        circulating_supply: parseFloat(item.circulating_supply || 0),
        total_supply: parseFloat(item.total_supply || 0),
        last_updated: item.last_updated,
      }));
    }

    return data;
  } catch (error) {
    console.error('获取市场数据失败:', error);
    throw new Error(`获取市场数据失败: ${error.message}`);
  }
};

/**
 * 获取市场概览（v2.0更新）
 * 返回整个加密货币市场的概览数据
 * @returns {Promise<object>} 返回市场概览数据对象
 *  {
 *    total_market_cap: 3440090380757.1787,      // 总市值
 *    total_volume_24h: 20500004295.819645,      // 24小时交易量
 *    market_trend: "bullish",                   // 市场趋势
 *    risk_level: "low",                        // 风险等级
 *    btc_dominance: 58.56187966206689,         // BTC市值占比
 *    eth_dominance: 11.826921744887688,        // ETH市值占比
 *    fear_greed_value: 21,                     // 恐慌贪婪指数值
 *    fear_greed_classification: "Extreme Fear" // 恐慌贪婪分类
 *  }
 */
export const getMarketOverview = async () => {
  try {
    const data = await get('/api/market/overview');

    // 数据标准化处理
    return {
      total_market_cap: parseFloat(data.total_market_cap || 0),
      total_volume_24h: parseFloat(data.total_volume_24h || 0),
      market_trend: data.market_trend || 'neutral',
      risk_level: data.risk_level || 'medium',
      btc_dominance: parseFloat(data.btc_dominance || 0),
      eth_dominance: parseFloat(data.eth_dominance || 0),
      fear_greed_value: parseFloat(data.fear_greed_value || 0),
      fear_greed_classification: data.fear_greed_classification || 'Neutral',
    };
  } catch (error) {
    console.error('获取市场概览失败:', error);
    throw new Error(`获取市场概览失败: ${error.message}`);
  }
};

/**
 * 获取K线数据（v2.0更新）
 * 返回指定币种和时间周期的OHLCV（开高低收成交量）数据
 * @param {string} symbol - 币种符号（如 'BTCUSDT', 'ETHUSDT'）
 * @param {string} timeframe - 时间间隔（1m, 5m, 15m, 1h, 4h, 1d）
 * @param {string} start - 可选，开始时间（YYYY-MM-DD HH:MM:SS）
 * @param {string} end - 可选，结束时间（YYYY-MM-DD HH:MM:SS）
 * @returns {Promise<Array>} 返回K线数据数组
 *  [
 *    {
 *      time: 1640995200000,      // 时间戳
 *      timestamp: '2025-11-04 20:00:00',  // 时间字符串
 *      open: 68000.00,           // 开盘价
 *      high: 68200.00,           // 最高价
 *      low: 67900.00,            // 最低价
 *      close: 68100.00,          // 收盘价
 *      volume: 125.50            // 成交量
 *    }
 *  ]
 */
export const getKLineData = async ({
  symbol,
  timeframe = '1h',
  start = null,
  end = null,
}) => {
  try {
    if (!symbol) {
      throw new Error('获取K线数据需要指定币种symbol参数');
    }

    const params = {
      symbol: symbol.toUpperCase(), // v2.0使用大写符号
      timeframe,
    };

    // v2.0时间参数格式：YYYY-MM-DD HH:MM:SS
    if (start) params.start = start;
    if (end) params.end = end;

    const response = await post('/api/market/kline', params); // v2.0接口路径带/api

    console.log('=== API响应调试 ===');
    console.log('API响应原始格式:', response);
    console.log('response 类型:', typeof response);
    console.log('response.data:', response.data);
    console.log('=== 数据处理开始 ===');

    // 兼容多种返回格式：
    // 1. 直接返回数组: response = [...]
    // 2. 对象格式: response = { data: [...] }
    // 3. 嵌套对象: response = { data: { data: [...] } }
    let data;
    if (Array.isArray(response)) {
      // 直接返回数组
      data = response;
      console.log('直接返回数组格式');
    } else if (response.data && Array.isArray(response.data)) {
      // 格式: { data: [...] }
      data = response.data;
      console.log('返回 { data: [...] } 格式');
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      // 格式: { data: { data: [...] } }
      data = response.data.data;
      console.log('返回 { data: { data: [...] } } 格式');
    } else {
      data = [];
      console.log('无法识别格式，使用空数组');
    }

    console.log('最终使用的 data:', data);
    console.log('data 类型:', typeof data);
    console.log('data 长度:', Array.isArray(data) ? data.length : 'N/A');

    // 数据标准化处理
    if (Array.isArray(data)) {
      console.log('开始标准化数据，原始长度:', data.length);
      const standardizedData = data.map(item => ({
        time: item.time || item.timestamp_ms || 0,
        timestamp: item.timestamp || item.datetime || '',
        open: parseFloat(item.open || 0),
        high: parseFloat(item.high || 0),
        low: parseFloat(item.low || 0),
        close: parseFloat(item.close || 0),
        volume: parseFloat(item.volume || 0),
      }));
      console.log('标准化后数据示例:', standardizedData.slice(0, 2));
      console.log('标准化后长度:', standardizedData.length);
      console.log('=== 返回数据 ===');
      return standardizedData;
    }

    console.log('数据不是数组，返回空数组');
    return data || [];
  } catch (error) {
    console.error('获取K线数据失败:', error);
    throw new Error(`获取K线数据失败: ${error.message}`);
  }
};

/**
 * 获取支撑阻力位数据（v2.0更新）
 * 分析价格图表，识别关键支撑位和阻力位，用于交易决策参考
 * @param {string} symbol - 币种符号（如 'BTCUSDT'）
 * @param {string} timeframe - 时间间隔（1m, 5m, 15m, 1h, 4h, 1d）
 * @returns {Promise<object>} 返回支撑阻力位数据对象
 *  {
 *    symbol: 'BTCUSDT',
 *    timeframe: '1h',
 *    support_levels: [
 *      { price: 67500.00, strength: 0.85, touches: 3, type: 'support' },
 *      { price: 67000.00, strength: 0.72, touches: 2, type: 'support' }
 *    ],
 *    resistance_levels: [
 *      { price: 68500.00, strength: 0.78, touches: 2, type: 'resistance' },
 *      { price: 69000.00, strength: 0.65, touches: 1, type: 'resistance' }
 *    ],
 *    current_price: 68000.00,
 *    last_updated: '2025-11-04T20:46:12'
 *  }
 *  说明：
 *  - price: 支撑/阻力位价格
 *  - strength: 强度系数（0-1），数值越高表示该位置越重要
 *  - touches: 价格触及该位置的次数
 *  - type: 级别类型（support/resistance）
 */
export const getSupportData = async (symbol, timeframe = '1h') => {
  try {
    if (!symbol) {
      throw new Error('获取支撑阻力位数据需要指定币种symbol参数');
    }

    const params = {
      symbol: symbol.toUpperCase(), // v2.0使用大写符号
      timeframe, // v2.0支持更多时间间隔
    };

    const response = await post('/api/market/support-resistance', params); // v2.0接口路径带/api

    // v2.0返回格式：{ data: {...}, success: true, message, timestamp }
    const data = response.data;

    // 数据标准化处理
    return {
      symbol: data.symbol,
      timeframe: data.timeframe || data.interval, // v2.0字段名为interval，兼容处理
      support_levels: data.support_levels?.map(level => ({
        price: parseFloat(level.price),
        strength: parseFloat(level.strength),
        touches: level.touches || 0,
        type: level.type || 'support', // v2.0新增
      })) || [],
      resistance_levels: data.resistance_levels?.map(level => ({
        price: parseFloat(level.price),
        strength: parseFloat(level.strength),
        touches: level.touches || 0,
        type: level.type || 'resistance', // v2.0新增
      })) || [],
      current_price: parseFloat(data.current_price || 0), // v2.0新增
      last_updated: data.last_updated,
    };
  } catch (error) {
    console.error('获取支撑阻力位数据失败:', error);
    throw new Error(`获取支撑阻力位数据失败: ${error.message}`);
  }
};

/**
 * 获取技术指标数据（v2.0更新）
 * 计算并返回各种技术分析指标，帮助判断价格趋势和超买超卖状态
 * 注意：v2.0 API返回所有技术指标，不支持选择性查询
 * @param {string} symbol - 币种符号（如 'BTCUSDT'）
 * @param {string} timeframe - 时间间隔（1m, 5m, 15m, 1h, 4h, 1d）
 * @returns {Promise<object>} 返回技术指标数据对象
 *  {
 *    symbol: 'BTCUSDT',
 *    timeframe: '1h',
 *    timestamp: '2025-11-04T20:46:12',
 *    rsi: {
 *      value: 65.50,            // RSI当前值（0-100）
 *      signal: 'neutral',       // 信号：overbought(超买) / oversold(超卖) / neutral(中性)
 *      interpretation: 'RSI在正常范围内'  // v2.0新增
 *    },
 *    macd: {
 *      macd: 125.50,            // MACD线值
 *      signal: 118.20,          // 信号线值
 *      histogram: 7.30,         // 柱状图值
 *      signal_type: 'bullish',  // 信号类型：bullish(看涨) / bearish(看跌)
 *      interpretation: 'MACD呈现看涨信号'  // v2.0新增
 *    },
 *    bollinger: {
 *      upper: 68500.00,         // 布林带上轨
 *      middle: 68000.00,        // 布林带中轨（20日移动平均）
 *      lower: 67500.00,         // 布林带下轨
 *      position: 0.65,          // 当前价格在布林带中的位置（0-1）
 *      width: 1.47,             // v2.0新增
 *      interpretation: '价格在中上轨之间'  // v2.0新增
 *    },
 *    ma: {
 *      ma20: 67800.00,          // 20日移动平均线
 *      ma50: 67500.00,          // 50日移动平均线
 *      ma200: 66500.00,         // 200日移动平均线
 *      trend: 'uptrend',        // 趋势方向：uptrend(上升) / downtrend(下降) / sideways(横盘)
 *      interpretation: '短期均线上方，趋势向上'  // v2.0新增
 *    },
 *    ema: {  // v2.0新增
 *      ema12: 67950.00,         // 12日指数移动平均
 *      ema26: 67700.00,         // 26日指数移动平均
 *      ema50: 67500.00          // 50日指数移动平均
 *    }
 *  }
 */
export const getIndicatorData = async ({
  symbol,
  timeframe = '1h',
}) => {
  try {
    if (!symbol) {
      throw new Error('获取技术指标数据需要指定币种symbol参数');
    }

    const params = {
      symbol: symbol.toUpperCase(), // v2.0使用大写符号
      timeframe, // v2.0支持更多时间间隔
    };

    const response = await post('/api/market/indicators', params); // v2.0接口路径带/api

    // v2.0返回格式：{ data: {...}, success: true, message, timestamp }
    const data = response.data;

    // 数据标准化处理
    const result = {
      symbol: data.symbol,
      timeframe: data.timeframe,
      timestamp: data.timestamp, // v2.0新增
    };

    // 处理RSI指标
    if (data.rsi) {
      result.rsi = {
        value: parseFloat(data.rsi.value || 0),
        signal: data.rsi.signal,
        interpretation: data.rsi.interpretation, // v2.0新增
      };
      // 保留兼容性，如果后端返回history字段
      if (data.rsi.history) {
        result.rsi.history = data.rsi.history.map(v => parseFloat(v));
      }
    }

    // 处理MACD指标
    if (data.macd) {
      result.macd = {
        macd: parseFloat(data.macd.macd || 0),
        signal: parseFloat(data.macd.signal || 0),
        histogram: parseFloat(data.macd.histogram || 0),
        signal_type: data.macd.signal_type,
        interpretation: data.macd.interpretation, // v2.0新增
      };
    }

    // 处理布林带指标
    if (data.bollinger) {
      result.bollinger = {
        upper: parseFloat(data.bollinger.upper || 0),
        middle: parseFloat(data.bollinger.middle || 0),
        lower: parseFloat(data.bollinger.lower || 0),
        position: parseFloat(data.bollinger.position || 0),
        width: parseFloat(data.bollinger.width || 0), // v2.0新增
        interpretation: data.bollinger.interpretation, // v2.0新增
      };
    }

    // 处理移动平均线指标
    if (data.ma) {
      result.ma = {
        ma20: parseFloat(data.ma.ma20 || 0),
        ma50: parseFloat(data.ma.ma50 || 0),
        ma200: parseFloat(data.ma.ma200 || 0),
        trend: data.ma.trend,
        interpretation: data.ma.interpretation, // v2.0新增
      };
    }

    // 处理EMA指标（v2.0新增）
    if (data.ema) {
      result.ema = {
        ema12: parseFloat(data.ema.ema12 || 0),
        ema26: parseFloat(data.ema.ema26 || 0),
        ema50: parseFloat(data.ema.ema50 || 0),
      };
    }

    return result;
  } catch (error) {
    console.error('获取技术指标数据失败:', error);
    throw new Error(`获取技术指标数据失败: ${error.message}`);
  }
};

/**
 * 获取趋势数据（v2.0更新）
 * 返回价格趋势分析数据，支持多币种对比和预设周期选择
 * @param {string} symbol - 币种符号（如 'BTCUSDT'，可选）
 * @param {string} period - 周期（1d, 7d, 30d），默认7d
 * @returns {Promise<object>} 返回趋势数据对象
 *  {
 *    period: '7d',
 *    symbol: 'BTCUSDT',
 *    trend_analysis: {
 *      direction: 'upward',          // 趋势方向：upward(上升) / downward(下降) / sideways(横盘)
 *      strength: 0.75,              // 趋势强度（0-1）
 *      change_percentage: 5.20,     // 变化百分比
 *      interpretation: '价格呈现强势上升趋势'  // v2.0新增
 *    },
 *    volatility: {
 *      value: 0.045,                // 波动率值
 *      level: 'medium',            // 波动水平：low, medium, high
 *      interpretation: '波动率处于中等水平'  // v2.0新增
 *    },
 *    price_points: [
 *      {
 *        timestamp: '2025-11-01T00:00:00',
 *        price: 67000.00,
 *        date: '2025-11-01'
 *      }
 *    ],
 *    support_resistance: {
 *      key_support: 66500.00,      // v2.0新增
 *      key_resistance: 69000.00    // v2.0新增
 *    },
 *    last_updated: '2025-11-04T20:46:12'
 *  }
 *  说明：
 *  - v2.0使用period参数替代自定义日期范围
 *  - 返回更详细的趋势分析和波动率数据
 *  - 包含信号解读信息
 */
export const getTrendData = async ({
  symbol = null,
  period = '7d',
}) => {
  try {
    // v2.0构建请求参数
    const params = {
      period, // 1d, 7d, 30d
    };

    if (symbol) {
      params.symbol = symbol.toUpperCase(); // v2.0使用大写符号
    }

    const data = await post('/api/market/trend', params); // v2.0接口路径带/api

    // v2.0数据标准化处理
    const result = {
      period: data.period || period,
      symbol: data.symbol,
    };

    // 处理趋势分析
    if (data.trend_analysis) {
      result.trend_analysis = {
        direction: data.trend_analysis.direction,
        strength: parseFloat(data.trend_analysis.strength || 0),
        change_percentage: parseFloat(data.trend_analysis.change_percentage || 0),
        interpretation: data.trend_analysis.interpretation, // v2.0新增
      };
    }

    // 处理波动率
    if (data.volatility) {
      result.volatility = {
        value: parseFloat(data.volatility.value || 0),
        level: data.volatility.level,
        interpretation: data.volatility.interpretation, // v2.0新增
      };
    }

    // 处理价格点
    if (data.price_points && Array.isArray(data.price_points)) {
      result.price_points = data.price_points.map(p => ({
        timestamp: p.timestamp,
        price: parseFloat(p.price || 0),
        date: p.date,
      }));
    }

    // 处理支撑阻力位（v2.0新增）
    if (data.support_resistance) {
      result.support_resistance = {
        key_support: parseFloat(data.support_resistance.key_support || 0),
        key_resistance: parseFloat(data.support_resistance.key_resistance || 0),
      };
    }

    result.last_updated = data.last_updated;

    return result;
  } catch (error) {
    console.error('获取趋势数据失败:', error);
    throw new Error(`获取趋势数据失败: ${error.message}`);
  }
};

/**
 * 获取期货市场数据（v2.0新增）
 * 返回永续合约的持仓量、资金费率等期货特有指标
 * @param {string} symbol - 币种符号（如 'BTCUSDT'）
 * @returns {Promise<object>} 返回期货数据对象
 *  {
 *    symbol: 'BTCUSDT',
 *    open_interest: 78256.51,        // 持仓量
 *    open_interest_change_24h: 2.35, // 24小时持仓量变化百分比
 *    funding_rate: 0.0001,           // 当前资金费率
 *    funding_time: '2025-11-04T20:00:00',
 *    next_funding_time: '2025-11-05T08:00:00',
 *    long_short_ratio: 1.25,         // 多空比
 *    dominance: {
 *      long: 55.5,                   // 多头占比（%）
 *      short: 44.5                   // 空头占比（%）
 *    },
 *    last_updated: '2025-11-04T20:46:12'
 *  }
 */
export const getFuturesData = async (symbol) => {
  try {
    if (!symbol) {
      throw new Error('获取期货数据需要指定币种symbol参数');
    }

    const data = await post('/api/market/crypto-futures', { symbol });

    // 数据标准化处理
    return {
      symbol: data.symbol,
      open_interest: parseFloat(data.open_interest || 0),
      open_interest_change_24h: parseFloat(data.open_interest_change_24h || 0),
      funding_rate: parseFloat(data.funding_rate || 0),
      funding_time: data.funding_time,
      next_funding_time: data.next_funding_time,
      long_short_ratio: parseFloat(data.long_short_ratio || 0),
      dominance: {
        long: parseFloat(data.dominance?.long || 0),
        short: parseFloat(data.dominance?.short || 0),
      },
      last_updated: data.last_updated,
    };
  } catch (error) {
    console.error('获取期货数据失败:', error);
    throw new Error(`获取期货数据失败: ${error.message}`);
  }
};

/**
 * 获取市场排行（v2.0新增）
 * 按交易量排序的加密货币排行榜
 * @param {number} limit - 返回数量限制（1-100），默认20
 * @returns {Promise<Array>} 返回排行数据数组
 *  [
 *    {
 *      rank: 1,
 *      symbol: 'BTCUSDT',
 *      name: 'Bitcoin',
 *      current_price: 68000.00,
 *      price_change_percentage_24h: 1.80,
 *      volume_24h: 25000000000.00,
 *      market_cap: 1343000000000.00,
 *      circulating_supply: 19750000.00
 *    }
 *  ]
 */
export const getMarketRank = async (limit = 20) => {
  try {
    const data = await post('/api/market/rank', { limit: Math.min(limit, 100) });

    // 数据标准化处理
    if (Array.isArray(data)) {
      return data.map(item => ({
        rank: item.rank,
        symbol: item.symbol,
        name: item.name,
        current_price: parseFloat(item.current_price || 0),
        price_change_percentage_24h: parseFloat(item.price_change_percentage_24h || 0),
        volume_24h: parseFloat(item.volume_24h || 0),
        market_cap: parseFloat(item.market_cap || 0),
        circulating_supply: parseFloat(item.circulating_supply || 0),
      }));
    }

    return data;
  } catch (error) {
    console.error('获取市场排行失败:', error);
    throw new Error(`获取市场排行失败: ${error.message}`);
  }
};

const api = {
  getMarketData,
  getMarketOverview,
  getKLineData,
  getSupportData,
  getIndicatorData,
  getTrendData,
  getFuturesData,
  getMarketRank,
};

export default api;