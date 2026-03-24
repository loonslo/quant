/**
 * TrendChart趋势图表组件
 *
 * 功能说明：
 * 1. 基于ECharts实现的趋势折线图
 * 2. 支持多币种趋势对比显示
 * 3. 时间范围选择器集成
 * 4. 币种筛选功能
 * 5. 数据缩放和平移交互
 *
 * 图表特点：
 * - 支持多币种同时显示
 * - 自动计算波动率和趋势
 * - 专业的金融配色方案
 * - 响应式设计，适配移动端
 *
 * 数据格式：
 * {
 *   data_range: { start: '2025-01-01', end: '2025-11-03' },
 *   time_interval: '1d',
 *   coins: [
 *     {
 *       symbol: 'BTCUSDT',
 *       prices: [
 *         { timestamp: 1640995200000, price: 45000, date: '2025-01-01' },
 *         ...
 *       ],
 *       trend: 'upward',
 *       volatility: 0.045,
 *       avg_price: 45500
 *     }
 *   ],
 *   market_summary: {
 *     best_performer: 'ETHUSDT',
 *     worst_performer: 'DOGEUSDT',
 *     total_change: 12.5
 *   }
 * }
 *
 * 使用示例：
 * <TrendChart
 *   data={trendData}
 *   theme="light"
 *   height={400}
 *   showCoinFilter={true}
 *   showDateRange={true}
 * />
 */

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { getThemeConfig } from './echartsTheme';

/**
 * 趋势图表组件
 * @param {object} props - 组件属性
 * @param {object} props.data - 趋势数据对象
 * @param {string} props.theme - 主题名称
 * @param {number} props.height - 图表高度
 * @param {boolean} props.showCoinFilter - 是否显示币种筛选器
 * @param {boolean} props.showDateRange - 是否显示日期范围
 * @param {Array<string>} props.selectedCoins - 当前选中的币种列表
 * @param {function} props.onCoinChange - 币种变化回调
 */
const TrendChart = ({
  data = null,
  theme = 'light',
  height = 400,
  showCoinFilter = true,
  showDateRange = true,
  selectedCoins = ['BTCUSDT', 'ETHUSDT'],
  onCoinChange,
}) => {
  /**
   * 处理趋势数据并生成图表配置
   */
  const chartConfig = useMemo(() => {
    if (!data || !data.coins || data.coins.length === 0) {
      return {
        title: {
          text: '价格趋势图表',
          textStyle: {
            color: getThemeConfig(theme).textStyle.color,
          },
        },
        xAxis: { show: false },
        yAxis: { show: false },
        series: [],
      };
    }

    const themeConfig = getThemeConfig(theme);

    // 生成时间轴（基于第一个币种的时间）
    const firstCoin = data.coins[0];
    const categories = firstCoin.prices.map(price => price.date);

    // 颜色配置
    const colorPalette = [
      '#1890ff',  // 蓝色
      '#52c41a',  // 绿色
      '#faad14',  // 黄色
      '#ff4d4f',  // 红色
      '#722ed1',  // 紫色
      '#13c2c2',  // 青色
    ];

    // 过滤选中的币种
    const filteredCoins = data.coins.filter(coin =>
      selectedCoins.includes(coin.symbol)
    );

    return {
      // 图表标题
      title: {
        text: '价格趋势对比',
        subtext: `数据区间: ${data.data_range?.start || 'N/A'} 至 ${data.data_range?.end || 'N/A'}`,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 600,
          color: themeConfig.textStyle.color,
        },
        subtextStyle: {
          color: themeConfig.textStyle.color,
          fontSize: 12,
        },
      },

      // 提示框
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        backgroundColor: themeConfig.tooltip.backgroundColor,
        borderColor: themeConfig.tooltip.borderColor,
        borderWidth: 1,
        textStyle: {
          color: themeConfig.tooltip.textStyle.color,
        },
        formatter: (params) => {
          const result = [`<div>${params[0].axisValue}</div>`];
          params.forEach((param, index) => {
            result.push(
              `<div style="margin-top: 4px;">
                <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${param.color};"></span>
                ${param.seriesName}: $${param.value.toFixed(2)}
              </div>`
            );
          });
          return result.join('');
        },
      },

      // 图例
      legend: {
        top: '10%',
        data: filteredCoins.map(coin => coin.symbol),
        textStyle: {
          color: themeConfig.legend.textStyle.color,
          fontSize: 12,
        },
      },

      // 网格
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        top: '25%',
        containLabel: true,
      },

      // X轴
      xAxis: {
        type: 'category',
        data: categories,
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: themeConfig.categoryAxis.axisLine.lineStyle.color,
          },
        },
        axisLabel: {
          color: themeConfig.categoryAxis.axisLabel.color,
          fontSize: 11,
        },
        splitLine: {
          show: false,
        },
      },

      // Y轴
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: themeConfig.valueAxis.axisLine.lineStyle.color,
          },
        },
        axisLabel: {
          color: themeConfig.valueAxis.axisLabel.color,
          fontSize: 11,
          formatter: (value) => {
            if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B';
            if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
            if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K';
            return value.toFixed(0);
          },
        },
        splitLine: {
          lineStyle: {
            color: themeConfig.valueAxis.splitLine.lineStyle.color,
            type: 'dashed',
          },
        },
      },

      // 数据缩放
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: 0,
        },
        {
          type: 'slider',
          xAxisIndex: 0,
          height: 20,
          bottom: 10,
          handleSize: 0,
          brushSelect: false,
          textStyle: {
            color: themeConfig.textStyle.color,
          },
          fillerColor: theme === 'dark'
            ? 'rgba(23, 125, 220, 0.15)'
            : 'rgba(24, 144, 255, 0.15)',
          borderColor: themeConfig.grid.borderColor,
        },
      ],

      // 数据系列
      series: filteredCoins.map((coin, index) => ({
        name: coin.symbol,
        type: 'line',
        data: coin.prices.map(price => price.price),
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: {
          width: 2,
          color: colorPalette[index % colorPalette.length],
        },
        itemStyle: {
          color: colorPalette[index % colorPalette.length],
        },
        emphasis: {
          focus: 'series',
          lineStyle: {
            width: 3,
          },
        },
        areaStyle: {
          opacity: 0.05,
        },
      })),
    };
  }, [data, theme, selectedCoins]);

  /**
   * 渲染市场摘要信息
   */
  const renderMarketSummary = () => {
    if (!data || !data.market_summary) return null;

    const { best_performer, worst_performer, total_change } = data.market_summary;

    return (
      <div className="trend-summary">
        <div className="summary-item">
          <span className="summary-label">最佳表现:</span>
          <span className="summary-value best">{best_performer}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">最差表现:</span>
          <span className="summary-value worst">{worst_performer}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">总体变化:</span>
          <span
            className={`summary-value ${total_change >= 0 ? 'positive' : 'negative'}`}
          >
            {total_change >= 0 ? '+' : ''}{total_change.toFixed(2)}%
          </span>
        </div>
      </div>
    );
  };

  /**
   * 渲染币种筛选器
   */
  const renderCoinFilter = () => {
    if (!showCoinFilter || !data || !data.coins) return null;

    return (
      <div className="coin-filter">
        <h4 className="filter-title">选择对比币种</h4>
        <div className="filter-buttons">
          {data.coins.map((coin) => {
            const isSelected = selectedCoins.includes(coin.symbol);
            return (
              <button
                key={coin.symbol}
                className={`filter-button ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  if (onCoinChange) {
                    const newSelected = isSelected
                      ? selectedCoins.filter(c => c !== coin.symbol)
                      : [...selectedCoins, coin.symbol];
                    onCoinChange(newSelected);
                  }
                }}
              >
                {coin.symbol}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  /**
   * 渲染加载状态
   */
  const renderLoading = () => (
    <div className="trend-loading">
      <div className="loading-spinner"></div>
      <p className="loading-text">正在加载趋势数据...</p>
    </div>
  );

  /**
   * 渲染错误状态
   */
  const renderError = () => (
    <div className="trend-error">
      <p className="error-message">❌ 暂无趋势数据显示</p>
    </div>
  );

  return (
    <div className="trend-chart-container">
      {/* 市场摘要 */}
      {renderMarketSummary()}

      {/* 币种筛选器 */}
      {renderCoinFilter()}

      {/* 趋势图表 */}
      <div className="trend-chart-content">
        {!data && renderLoading()}
        {data && (!data.coins || data.coins.length === 0) && renderError()}
        {data && data.coins && data.coins.length > 0 && (
          <ReactECharts
            option={chartConfig}
            style={{ height: `${height}px`, width: '100%' }}
            opts={{
              renderer: 'canvas',
            }}
            notMerge={true}
            lazyUpdate={true}
          />
        )}
      </div>
    </div>
  );
};

export default TrendChart;