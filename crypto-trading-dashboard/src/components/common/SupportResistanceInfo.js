/**
 * SupportResistanceInfo 支撑阻力位信息展示组件
 *
 * 功能说明：
 * 1. 展示当前K线图上的支撑位和阻力位
 * 2. 显示每个支撑/阻力位的价格、强度和触及次数
 * 3. 支持4小时和1天两个时间维度切换
 * 4. 提供直观的视觉反馈
 *
 * 支撑阻力位含义：
 * - 支撑位：价格下跌时的支撑点，跌破可能导致进一步下跌
 * - 阻力位：价格上涨时的阻力点，突破可能继续上涨
 * - 强度：支撑/阻力位的可靠性（0-100%）
 * - 触及次数：价格触及该位置的次数，次数越多越重要
 *
 * 数据格式：
 * {
 *   symbol: 'BTCUSDT',
 *   timeframe: '4h',
 *   support_levels: [
 *     { price: 44000, strength: 0.85, touches: 3 },
 *     ...
 *   ],
 *   resistance_levels: [
 *     { price: 46000, strength: 0.78, touches: 2 },
 *     ...
 *   ]
 * }
 *
 * 使用示例：
 * <SupportResistanceInfo
 *   data={supportData}
 *   theme="light"
 *   onIntervalChange={(interval) => {...}}
 * />
 */

import React from 'react';

/**
 * 支撑阻力位信息组件
 * @param {object} props - 组件属性
 * @param {object} props.data - 支撑阻力位数据对象
 * @param {string} props.theme - 主题名称（'light'|'dark'）
 * @param {function} props.onIntervalChange - 时间维度变化回调函数
 */
const SupportResistanceInfo = ({
  data = null,
  theme = 'light',
  onIntervalChange = null,
}) => {
  /**
   * 获取强度颜色
   * @param {number} strength - 强度值（0-1）
   * @returns {object} 颜色配置对象
   */
  const getStrengthColor = (strength) => {
    if (strength >= 0.8) {
      return {
        color: '#52c41a',
        bgColor: theme === 'dark' ? 'rgba(82, 196, 26, 0.2)' : 'rgba(82, 196, 26, 0.1)',
        text: '强',
      };
    } else if (strength >= 0.6) {
      return {
        color: '#faad14',
        bgColor: theme === 'dark' ? 'rgba(250, 173, 20, 0.2)' : 'rgba(250, 173, 20, 0.1)',
        text: '中',
      };
    } else {
      return {
        color: '#ff4d4f',
        bgColor: theme === 'dark' ? 'rgba(255, 77, 79, 0.2)' : 'rgba(255, 77, 79, 0.1)',
        text: '弱',
      };
    }
  };

  /**
   * 格式化价格显示
   * @param {number} price - 价格
   * @returns {string} 格式化后的价格字符串
   */
  const formatPrice = (price) => {
    if (price >= 1e9) return `$${(price / 1e9).toFixed(2)}B`;
    if (price >= 1e6) return `$${(price / 1e6).toFixed(2)}M`;
    if (price >= 1e3) return `$${(price / 1e3).toFixed(2)}K`;
    return `$${price.toFixed(2)}`;
  };

  /**
   * 渲染支撑位列表
   */
  const renderSupportLevels = () => {
    if (!data || !data.support_levels || data.support_levels.length === 0) {
      return (
        <div className="support-resistance-empty">
          <p>暂无支撑位数据</p>
        </div>
      );
    }

    return (
      <div className="support-levels">
        {data.support_levels.map((level, index) => {
          const strengthConfig = getStrengthColor(level.strength);
          return (
            <div key={`support-${index}`} className="level-item support-item">
              <div className="level-header">
                <span className="level-icon" style={{ color: '#52c41a' }}>
                  ↘
                </span>
                <span className="level-label">支撑位 {index + 1}</span>
                <span
                  className="level-strength"
                  style={{
                    color: strengthConfig.color,
                    backgroundColor: strengthConfig.bgColor,
                  }}
                >
                  {strengthConfig.text}
                </span>
              </div>
              <div className="level-details">
                <span className="level-price">{formatPrice(level.price)}</span>
                <span className="level-metrics">
                  强度: {(level.strength * 100).toFixed(0)}% · 触及: {level.touches}次
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  /**
   * 渲染阻力位列表
   */
  const renderResistanceLevels = () => {
    if (!data || !data.resistance_levels || data.resistance_levels.length === 0) {
      return (
        <div className="support-resistance-empty">
          <p>暂无阻力位数据</p>
        </div>
      );
    }

    return (
      <div className="resistance-levels">
        {data.resistance_levels.map((level, index) => {
          const strengthConfig = getStrengthColor(level.strength);
          return (
            <div key={`resistance-${index}`} className="level-item resistance-item">
              <div className="level-header">
                <span className="level-icon" style={{ color: '#ff4d4f' }}>
                  ↗
                </span>
                <span className="level-label">阻力位 {index + 1}</span>
                <span
                  className="level-strength"
                  style={{
                    color: strengthConfig.color,
                    backgroundColor: strengthConfig.bgColor,
                  }}
                >
                  {strengthConfig.text}
                </span>
              </div>
              <div className="level-details">
                <span className="level-price">{formatPrice(level.price)}</span>
                <span className="level-metrics">
                  强度: {(level.strength * 100).toFixed(0)}% · 触及: {level.touches}次
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  /**
   * 渲染时间维度切换按钮
   */
  const renderIntervalSelector = () => {
    if (!onIntervalChange) return null;

    const intervals = [
      { value: '4h', label: '4小时' },
      { value: '1d', label: '1天' },
    ];

    return (
      <div className="interval-selector">
        {intervals.map((interval) => (
          <button
            key={interval.value}
            className={`interval-button ${data?.timeframe === interval.value ? 'active' : ''}`}
            onClick={() => onIntervalChange(interval.value)}
          >
            {interval.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="support-resistance-info">
      {/* 标题和维度切换 */}
      <div className="support-resistance-header">
        <h4 className="support-resistance-title">
          支撑阻力位分析
          {data?.timeframe && (
            <span className="interval-badge">
              {data.timeframe === '4h' ? '4小时' : '1天'}
            </span>
          )}
        </h4>
        {renderIntervalSelector()}
      </div>

      {/* 支撑位和阻力位列表 */}
      <div className="levels-container">
        {/* 支撑位 */}
        <div className="level-section">
          <div className="section-header">
            <span className="section-icon">↘</span>
            <span className="section-title">支撑位</span>
          </div>
          {renderSupportLevels()}
        </div>

        {/* 阻力位 */}
        <div className="level-section">
          <div className="section-header">
            <span className="section-icon">↗</span>
            <span className="section-title">阻力位</span>
          </div>
          {renderResistanceLevels()}
        </div>
      </div>

      {/* 说明文字 */}
      <div className="support-resistance-footer">
        <p className="info-text">
          <span className="info-icon">💡</span>
          支撑位是价格下跌时的支撑点，阻力位是价格上涨时的阻力点
        </p>
      </div>
    </div>
  );
};

export default SupportResistanceInfo;
