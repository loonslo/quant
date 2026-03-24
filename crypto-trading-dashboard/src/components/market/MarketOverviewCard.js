/**
 * MarketOverviewCard单个概览卡片组件
 *
 * 功能说明：
 * 1. 展示一个市场指标的关键信息（价格、市值、交易量等）
 * 2. 支持数值格式化显示（千分位分隔符、小数位控制）
 * 3. 显示涨跌百分比（用颜色和箭头表示趋势）
 * 4. 响应式布局，适配移动端
 *
 * 使用示例：
 * <MarketOverviewCard
 *   title="总市值"
 *   value={850000000000}
 *   change={2.5}
 *   icon="💰"
 *   format="price"  // price | volume | number | percent
 * />
 *
 * 依赖的格式化函数：
 * - formatPrice(): 价格格式化（加$符号）
 * - formatNumber(): 数字格式化（千分位）
 * - formatVolume(): 交易量格式化（K/M/B单位）
 * - formatPercent(): 百分比格式化（带正负号）
 * - getPriceColor(): 获取涨跌颜色
 * - getPriceTrend(): 获取趋势图标
 */

import React from 'react';
import {
  formatPrice,
  formatNumber,
  formatVolume,
  formatPercent,
  getPriceColor,
  getPriceTrend,
} from '../../utils/tools';

/**
 * 单个概览卡片组件
 * @param {object} props - 组件属性
 * @param {string} props.title - 卡片标题（如"总市值"、"24h交易量"）
 * @param {number\|string} props.value - 数值或文本（原始数字或文本）
 * @param {number} props.change - 变化百分比（如5.25表示上涨5.25%）
 * @param {string} props.icon - 图标（可使用emoji或图标字体）
 * @param {string} props.format - 数据格式类型
 *   - 'price': 价格格式（加$符号）
 *   - 'volume': 交易量格式（K/M/B单位）
 *   - 'number': 普通数字（千分位分隔符）
 *   - 'percent': 百分比格式
 *   - 'text': 纯文本显示
 * @param {string} props.trend - 趋势方向（'up'|'down'|'neutral'），可选，不传则根据change自动判断
 * @param {string} props.subtitle - 副标题文本，可选
 */
const MarketOverviewCard = ({
  title,
  value,
  change,
  icon,
  format = 'number',
  trend,
  subtitle,
}) => {
  /**
   * 根据format类型格式化数值
   * @param {number\|string} val - 原始数值或文本
   * @param {string} fmt - 格式类型
   * @returns {string} 格式化后的字符串
   */
  const formatValue = (val, fmt) => {
    // 如果是文本格式，直接返回
    if (fmt === 'text') {
      return String(val);
    }

    // 数值类型格式化
    if (typeof val === 'number') {
      switch (fmt) {
        case 'price':
          return formatPrice(val);
        case 'volume':
          return formatVolume(val);
        case 'percent':
          return `${val.toFixed(2)}%`;
        case 'number':
        default:
          return formatNumber(val);
      }
    }

    // 文本直接返回
    return String(val);
  };

  /**
   * 获取显示的趋势信息
   * @returns {object} 包含color（颜色）、trend（图标）、direction（方向）
   */
  const getTrendInfo = () => {
    // 如果手动指定了trend，使用指定的
    if (trend) {
      const direction = trend === 'up' ? 1 : trend === 'down' ? -1 : 0;
      return {
        color: getPriceColor(direction, 'color'),
        trend: getPriceTrend(direction),
        direction,
      };
    }

    // 否则根据change值自动判断
    const direction = change > 0 ? 1 : change < 0 ? -1 : 0;
    return {
      color: getPriceColor(change, 'color'),
      trend: getPriceTrend(change),
      direction,
    };
  };

  const trendInfo = getTrendInfo();

  return (
    <div className="market-overview-card">
      {/* 卡片头部：标题和图标 */}
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <h3 className="card-title">{title}</h3>
      </div>

      {/* 卡片主体：数值和变化 */}
      <div className="card-content">
        {/* 主数值 */}
        <div className="card-value">
          {formatValue(value, format)}
        </div>

        {/* 副标题 */}
        {subtitle && (
          <div className="card-subtitle">
            {subtitle}
          </div>
        )}

        {/* 变化百分比和趋势 */}
        {change !== undefined && change !== 0 && (
          <div className="card-change" style={{ color: trendInfo.color }}>
            <span className="change-icon">{trendInfo.trend}</span>
            <span className="change-value">
              {formatPercent(change)}
            </span>
          </div>
        )}
      </div>

      {/* 卡片底部：装饰线或额外信息（可选扩展） */}
      <div className="card-footer">
        <div
          className="trend-line"
          style={{ backgroundColor: trendInfo.color }}
        />
      </div>
    </div>
  );
};

export default MarketOverviewCard;