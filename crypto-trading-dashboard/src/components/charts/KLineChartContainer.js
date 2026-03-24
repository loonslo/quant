/**
 * KLineChartContainer K线图表容器组件
 *
 * 功能说明：
 * 1. 在K线图表上方集成时间选择器
 * 2. 实现时间维度切换逻辑（1h、4h、1d、1w）
 * 3. 数据加载状态处理（获取新数据时显示加载指示器）
 * 4. 自动响应全局时间维度状态变化
 *
 * 数据流向：
 * 1. 用户点击时间按钮触发selectTimeInterval
 * 2. 全局状态更新timeInterval
 * 3. 监听timeInterval变化，重新获取K线数据
 * 4. 数据返回后更新K线图表
 *
 * 使用示例：
 * <KLineChartContainer
 *   symbol="BTCUSDT"
 *   showTimeSelector={true}
 * />
 */

import React, { useState, useEffect, useCallback } from 'react';
import { getKLineData, getSupportData } from '../../api/market';
import { useAppContext } from '../../context/AppContext';
import KLineChart from './KLineChart';
import SupportResistanceInfo from '../common/SupportResistanceInfo';

/**
 * K线图表容器组件（v2.0适配）
 * @param {object} props - 组件属性
 * @param {string} props.symbol - 币种符号（如'BTCUSDT'、'ETHUSDT'）
 * @param {boolean} props.showTimeSelector - 是否显示时间选择器
 * @param {number} props.height - 图表高度
 * @param {Array} props.data - 可选，外部传入的K线数据（用于测试或手动控制）
 */
const KLineChartContainer = ({
  symbol = 'BTCUSDT', // v2.0改为USDT后缀格式
  showTimeSelector = true,
  height = 500,
  data: externalData = null,
}) => {
  // 从全局状态获取当前时间间隔
  const { timeInterval } = useAppContext();

  // 组件内部状态
  const [klineData, setKlineData] = useState([]);     // K线数据
  const [supportData, setSupportData] = useState(null); // 支撑阻力数据
  const [supportInterval, setSupportInterval] = useState('4h'); // 支撑阻力数据时间维度
  const [loading, setLoading] = useState(false);       // 加载状态
  const [error, setError] = useState(null);            // 错误信息

  // 时间范围筛选状态（1天、1周、1月）
  const [timeRange, setTimeRange] = useState('7d'); // 默认7天
  const [availableSymbols] = useState(['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'DOTUSDT']); // 可选币种列表

  // 计算时间范围的开始和结束日期
  // API要求：开始时间必须是每天0点0分0秒，结束时间必须是时间间隔的倍数
  const getTimeRangeParams = (range) => {
    const now = new Date();
    const start = new Date(now);
    let timeframe = '1h'; // 默认时间间隔
    let endMinutes = 0;
    let endHours = now.getHours();
    let endSeconds = 0;

    if (range === '1d') {
      // 今天：从今天0点0分0秒到现在
      start.setDate(start.getDate() - 0);  // 不减日期，即为今天
      timeframe = '5m'; // 1天使用5分钟间隔

      // 将结束时间向下舍入到5分钟的倍数
      endMinutes = Math.floor(now.getMinutes() / 5) * 5;
      endHours = now.getHours();
      if (endMinutes === 60) {
        endMinutes = 0;
        endHours += 1;
      }
      endSeconds = 0;

    } else if (range === '7d') {
      // 7天前：从7天前0点0分0秒到现在
      start.setDate(start.getDate() - 7);
      timeframe = '1h'; // 7天使用1小时间隔

      // 将结束时间向下舍入到1小时的倍数（00分00秒）
      endMinutes = 0;
      endSeconds = 0;

    } else if (range === '30d') {
      // 1个月前：从30天前0点0分0秒到现在
      start.setDate(start.getDate() - 30);
      timeframe = '4h'; // 1个月使用4小时间隔

      // 将结束时间向下舍入到4小时的倍数（00分00秒）
      endMinutes = 0;
      endSeconds = 0;
      endHours = Math.floor(now.getHours() / 4) * 4;
    }

    // 将开始时间设置为当天的0点0分0秒
    start.setHours(0, 0, 0, 0);

    // 构造结束时间
    const endDate = new Date(now);
    endDate.setHours(endHours, endMinutes, endSeconds, 0);

    return {
      start: start.toISOString().slice(0, 19).replace('T', ' '),
      end: endDate.toISOString().slice(0, 19).replace('T', ' '),
      timeframe: timeframe
    };
  };

  /**
   * 获取K线数据
   * 根据当前币种和时间间隔获取数据
   */
  const fetchKLineData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { start, end, timeframe } = getTimeRangeParams(timeRange);
      console.log('=== fetchKLineData 参数调试 ===');
      console.log('symbol:', symbol);
      console.log('timeRange:', timeRange);
      console.log('timeframe:', timeframe);
      console.log('start:', start);
      console.log('end:', end);
      console.log('=== API调用开始 ===');

      const data = await getKLineData({
        symbol,
        timeframe: timeframe,  // 使用根据时间范围自动调整的间隔
        start,
        end,
      });

      console.log('=== API返回数据 ===');
      console.log('KLineContainer - API返回数据:', data);
      console.log('KLineContainer - 数据类型:', typeof data);
      console.log('KLineContainer - 数据长度:', data ? data.length : 'null/undefined');

      setKlineData(data);
      console.log('=== setKlineData 完成 ===');
    } catch (err) {
      console.error('=== API调用失败 ===');
      console.error('获取K线数据失败:', err);
      setError(err.message || '获取K线数据失败');
    } finally {
      setLoading(false);
    }
  }, [symbol, timeRange]);

  /**
   * 获取支撑阻力位数据（v2.0适配）
   * v2.0支持更多时间间隔：1m, 5m, 15m, 1h, 4h, 1d
   * 这里仍然只在4h和1d时显示支撑阻力数据
   */
  const fetchSupportData = useCallback(async (timeframe = supportInterval) => {
    // v2.0：只选择关键时间间隔显示支撑阻力数据
    if (timeframe !== '4h' && timeframe !== '1d') {
      setSupportData(null);
      return;
    }

    try {
      console.log(`正在获取支撑阻力数据: ${symbol}, 时间间隔: ${timeframe}`);

      const data = await getSupportData(symbol, timeframe);  // v2.0: interval -> timeframe

      setSupportData(data);
      console.log('支撑阻力数据获取成功:', data);
    } catch (err) {
      console.error('获取支撑阻力数据失败:', err);
      // 支撑阻力数据失败不影响主功能，不设置错误状态
      setSupportData(null);
    }
  }, [symbol, supportInterval]);

  /**
   * 组件挂载时获取数据
   * 依赖：symbol（币种）、timeInterval（时间间隔）、timeRange（时间范围）
   */
  useEffect(() => {
    fetchKLineData();
    fetchSupportData();
  }, [symbol, timeInterval, timeRange, fetchKLineData, fetchSupportData]); // 当币种、时间间隔或时间范围变化时重新获取

  /**
   * 处理时间范围变化
   * @param {string} range - 新时间范围（1d, 7d, 30d）
   */
  const handleTimeRangeChange = (range) => {
    console.log('时间范围变化:', range);
    setTimeRange(range);
  };

  /**
   * 处理币种切换
   * @param {string} newSymbol - 新币种
   */
  const handleSymbolChange = (newSymbol) => {
    console.log('币种切换:', newSymbol);
    // Note: Symbol changes are handled by parent component via props
  };

  /**
   * 处理支撑阻力时间维度变化
   * @param {string} interval - 新时间维度（4h 或 1d）
   */
  const handleSupportIntervalChange = (interval) => {
    console.log('支撑阻力时间维度变化:', interval);
    setSupportInterval(interval);
    fetchSupportData(interval);
  };

  /**
   * 渲染加载状态
   */
  const renderLoading = () => (
    <div className="kline-loading">
      <div className="loading-spinner"></div>
      <p className="loading-text">正在加载 {symbol} 的{timeInterval} K线数据...</p>
    </div>
  );

  /**
   * 渲染错误状态
   */
  const renderError = () => (
    <div className="kline-error">
      <p className="error-message">❌ {error}</p>
      <button className="retry-button" onClick={fetchKLineData}>
        重新加载
      </button>
    </div>
  );

  /**
   * 渲染空数据状态
   */
  const renderEmpty = () => (
    <div className="kline-empty">
      <p>暂无K线数据显示</p>
    </div>
  );

  return (
    <div className="kline-chart-container-wrapper">
      {/* 时间选择器区域 */}
      {showTimeSelector && (
        <div className="kline-header">
          <h3 className="kline-title">
            {symbol} K线图表
            <span className="kline-subtitle">
              当前时间维度: {timeInterval === '1h' ? '1小时' : timeInterval === '4h' ? '4小时' : timeInterval === '1d' ? '1天' : '1周'}
            </span>
          </h3>
          <div className="kline-controls">
            {/* 时间范围筛选 */}
            <div className="time-range-selector">
              <span className="control-label">时间范围:</span>
              <button
                className={`range-button ${timeRange === '1d' ? 'active' : ''}`}
                onClick={() => handleTimeRangeChange('1d')}
              >
                1天
              </button>
              <button
                className={`range-button ${timeRange === '7d' ? 'active' : ''}`}
                onClick={() => handleTimeRangeChange('7d')}
              >
                1周
              </button>
              <button
                className={`range-button ${timeRange === '30d' ? 'active' : ''}`}
                onClick={() => handleTimeRangeChange('30d')}
              >
                1月
              </button>
            </div>

            {/* 币种选择器 */}
            <div className="symbol-selector">
              <span className="control-label">币种:</span>
              <select
                className="symbol-select"
                value={symbol}
                onChange={(e) => handleSymbolChange(e.target.value)}
              >
                {availableSymbols.map((sym) => (
                  <option key={sym} value={sym}>
                    {sym}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>
      )}

      {/* K线图表区域 */}
      <div className="kline-chart-content">
        {loading && renderLoading()}
        {error && renderError()}
        {!loading && !error && (!klineData || klineData.length === 0) ? renderEmpty() : (
          <KLineChart
            data={externalData || klineData || []}
            supportData={supportData}
            theme="light"
            height={height}
            loading={false}
            loadingText="加载中..."
          />
        )}
      </div>

      {/* 支撑阻力位信息区域 */}
      <div className="support-resistance-container">
        <SupportResistanceInfo
          data={supportData}
          theme="light"
          onIntervalChange={handleSupportIntervalChange}
        />
      </div>
    </div>
  );
};

export default KLineChartContainer;