/**
 * TechnicalIndicators技术指标容器组件（v2.0适配）
 *
 * 功能说明：
 * 1. 作为技术指标图表的容器和管理器
 * 2. 支持多种指标类型切换（RSI、MACD、布林带、移动平均线、EMA等）
 * 3. v2.0新增EMA指标支持
 * 4. 指标图表布局管理（单指标、双指标、多指标视图）
 * 5. 响应式设计，适配不同屏幕尺寸
 *
 * 支持的指标类型：
 * - RSI: 相对强弱指数，判断超买超卖状态
 * - MACD: 指数平滑移动平均线，显示趋势变化
 * - Bollinger: 布林带，显示价格波动区间（含宽度分析）
 * - MA: 移动平均线，显示趋势方向（含信号解读）
 * - EMA: 指数移动平均线（v2.0新增）
 *
 * 布局模式：
 * 1. 单指标模式：只显示一个指标
 * 2. 双指标模式：上下两个指标
 * 3. 多指标模式：多个指标平铺显示（移动端推荐）
 *
 * 使用示例：
 * <TechnicalIndicators
 *   symbol="BTCUSDT"
 *   interval="1h"
 *   activeIndicators={['rsi', 'macd']}
 *   onIndicatorChange={(indicators) => {}}
 * />
 */

import React, { useState, useEffect } from 'react';
import { getIndicatorData } from '../../api/market';
import { useAppContext } from '../../context/AppContext';
import RSIChart from './RSIChart';
import MACDChart from './MACDChart';
import BollingerChart from './BollingerChart';
import MAChart from './MAChart';

/**
 * 技术指标容器组件（v2.0适配）
 * @param {object} props - 组件属性
 * @param {string} props.symbol - 币种符号（v2.0需使用USDT后缀格式）
 * @param {string} props.interval - 时间间隔（v2.0支持更多间隔：1m, 5m, 15m, 1h, 4h, 1d）
 * @param {Array<string>} props.activeIndicators - 当前激活的指标类型（v2.0新增ema）
 * @param {function} props.onIndicatorChange - 指标变化回调
 * @param {number} props.height - 单个指标图表高度
 * @param {string} props.layoutMode - 布局模式（'single'|'double'|'multi'）
 */
const TechnicalIndicators = ({
  symbol = 'BTCUSDT', // v2.0需使用USDT后缀格式
  interval = '1h',
  activeIndicators = ['rsi', 'macd', 'ema'], // v2.0默认包含ema
  onIndicatorChange,
  height = 300,
  layoutMode = 'multi',
}) => {
  // 从全局状态获取主题
  const { theme } = useAppContext();

  // 组件内部状态
  const [indicatorsData, setIndicatorsData] = useState(null);  // 指标数据
  const [loading, setLoading] = useState(false);               // 加载状态
  const [error, setError] = useState(null);                    // 错误信息

  /**
   * 所有可用的指标类型配置（v2.0新增EMA）
   */
  const indicatorTypes = {
    rsi: {
      key: 'rsi',
      name: 'RSI',
      fullName: '相对强弱指数',
      description: '判断超买超卖状态',
      color: '#1890ff',
      component: RSIChart,
    },
    macd: {
      key: 'macd',
      name: 'MACD',
      fullName: '指数平滑移动平均线',
      description: '显示趋势变化',
      color: '#52c41a',
      component: MACDChart,
    },
    bollinger: {
      key: 'bollinger',
      name: 'BOLL',
      fullName: '布林带',
      description: '显示价格波动区间（含宽度分析）',
      color: '#faad14',
      component: BollingerChart,
    },
    ma: {
      key: 'ma',
      name: 'MA',
      fullName: '移动平均线',
      description: '显示趋势方向（含信号解读）',
      color: '#722ed1',
      component: MAChart,
    },
    ema: { // v2.0新增
      key: 'ema',
      name: 'EMA',
      fullName: '指数移动平均线',
      description: '更敏感的趋势线',
      color: '#eb2f96',
      component: MAChart, // 可以复用MA图表组件
    },
  };

  /**
   * 获取技术指标数据
   */
  const fetchIndicatorsData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`正在获取技术指标数据: ${symbol}, ${interval}`);
      const data = await getIndicatorData({
        symbol,
        timeframe: interval,  // v2.0: interval -> timeframe
      });

      setIndicatorsData(data);
      console.log('技术指标数据获取成功:', data);
    } catch (err) {
      console.error('获取技术指标数据失败:', err);
      setError(err.message || '获取技术指标数据失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 组件挂载时获取数据
   * 注意：v2.0 API返回所有指标，无需根据activeIndicators过滤
   */
  useEffect(() => {
    fetchIndicatorsData();
  }, [symbol, interval]);

  /**
   * 切换指标类型
   * @param {string} indicatorKey - 指标类型键名
   */
  const toggleIndicator = (indicatorKey) => {
    let newActiveIndicators;

    if (activeIndicators.includes(indicatorKey)) {
      // 如果指标已激活，则移除
      newActiveIndicators = activeIndicators.filter(key => key !== indicatorKey);
    } else {
      // 如果指标未激活，则添加
      newActiveIndicators = [...activeIndicators, indicatorKey];
    }

    // 通知父组件
    if (onIndicatorChange) {
      onIndicatorChange(newActiveIndicators);
    }
  };

  /**
   * 渲染加载状态
   */
  const renderLoading = () => (
    <div className="indicators-loading">
      <div className="loading-spinner"></div>
      <p className="loading-text">正在加载技术指标数据...</p>
    </div>
  );

  /**
   * 渲染错误状态
   */
  const renderError = () => (
    <div className="indicators-error">
      <p className="error-message">❌ {error}</p>
      <button className="retry-button" onClick={fetchIndicatorsData}>
        重新加载
      </button>
    </div>
  );

  /**
   * 渲染指标选择器
   */
  const renderIndicatorSelector = () => (
    <div className="indicator-selector">
      <h4 className="selector-title">选择技术指标</h4>
      <div className="selector-buttons">
        {Object.values(indicatorTypes).map((indicator) => {
          const isActive = activeIndicators.includes(indicator.key);
          return (
            <button
              key={indicator.key}
              className={`indicator-button ${isActive ? 'active' : ''}`}
              onClick={() => toggleIndicator(indicator.key)}
              style={{
                '--indicator-color': indicator.color,
              }}
            >
              <span className="indicator-name">{indicator.name}</span>
              <span className="indicator-desc">{indicator.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  /**
   * 渲染单个指标图表
   * @param {string} indicatorKey - 指标类型键名
   */
  const renderIndicatorChart = (indicatorKey) => {
    const indicator = indicatorTypes[indicatorKey];
    const IndicatorComponent = indicator.component;

    if (!indicatorsData || !indicatorsData[indicatorKey]) {
      return (
        <div className="indicator-empty" key={indicatorKey}>
          <p>暂无{indicator.fullName}数据</p>
        </div>
      );
    }

    return (
      <div className="indicator-chart-wrapper" key={indicatorKey}>
        <div className="indicator-header">
          <h4 className="indicator-title">
            <span className="indicator-dot" style={{ backgroundColor: indicator.color }}></span>
            {indicator.fullName}
          </h4>
        </div>
        <div className="indicator-chart-content">
          <IndicatorComponent
            data={indicatorsData[indicatorKey]}
            theme={theme}
            height={height}
            color={indicator.color}
          />
        </div>
      </div>
    );
  };

  /**
   * 渲染指标图表列表
   */
  const renderIndicators = () => {
    if (!indicatorsData || activeIndicators.length === 0) {
      return (
        <div className="indicators-empty">
          <p>请至少选择一个技术指标</p>
        </div>
      );
    }

    return (
      <div className={`indicators-charts layout-${layoutMode}`}>
        {activeIndicators.map((indicatorKey) => renderIndicatorChart(indicatorKey))}
      </div>
    );
  };

  return (
    <div className="technical-indicators-container">
      {/* 指标选择器 */}
      {renderIndicatorSelector()}

      {/* 指标图表区域 */}
      <div className="indicators-content">
        {loading && renderLoading()}
        {error && renderError()}
        {!loading && !error && renderIndicators()}
      </div>
    </div>
  );
};

export default TechnicalIndicators;