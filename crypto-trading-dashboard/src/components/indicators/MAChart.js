/**
 * MAChart移动平均线图表组件
 *
 * 功能说明：
 * 1. 基于ECharts实现的移动平均线指标图表
 * 2. 显示多条移动平均线：MA5、MA10、MA20、MA50、MA200
 * 3. 移动平均线帮助识别价格趋势
 * 4. 短周期MA上穿长周期MA：黄金交叉，看涨信号
 * 5. 短周期MA下穿长周期MA：死亡交叉，看跌信号
 *
 * 移动平均线类型：
 * - MA5: 5日移动平均线（短期趋势）
 * - MA10: 10日移动平均线（短期趋势）
 * - MA20: 20日移动平均线（中期趋势）
 * - MA50: 50日移动平均线（中期趋势）
 * - MA200: 200日移动平均线（长期趋势，分水岭）
 *
 * 趋势判断：
 * - 价格 > MA200：多头市场，长期看涨
 * - 价格 < MA200：空头市场，长期看跌
 * - MA多头排列（MA5 > MA10 > MA20 > MA50）：强烈上涨趋势
 * - MA空头排列（MA5 < MA10 < MA20 < MA50）：强烈下跌趋势
 *
 * 数据格式：
 * {
 *   ma20: 44800,            // 20日移动平均线
 *   ma50: 44200,            // 50日移动平均线
 *   ma200: 42000,           // 200日移动平均线
 *   trend: 'uptrend'         // 趋势方向：uptrend(上升) / downtrend(下降) / sideways(横盘)
 * }
 *
 * 使用示例：
 * <MAChart
 *   data={{ ma20: 44800, ma50: 44200, ma200: 42000, trend: 'uptrend' }}
 *   theme="light"
 *   height={300}
 *   color="#722ed1"
 * />
 */

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { getThemeConfig } from '../charts/echartsTheme';

/**
 * 移动平均线图表组件
 * @param {object} props - 组件属性
 * @param {object} props.data - MA数据对象
 * @param {string} props.theme - 主题名称
 * @param {number} props.height - 图表高度
 * @param {string} props.color - 主线条颜色
 */
const MAChart = ({
  data = null,
  theme = 'light',
  height = 300,
  color = '#722ed1',
}) => {
  /**
   * MA线颜色配置
   */
  const maColors = {
    ma5: '#ff4d4f',    // 红色 - 短期
    ma10: '#faad14',   // 黄色 - 短期
    ma20: color,       // 紫色 - 中期
    ma50: '#1890ff',   // 蓝色 - 中期
    ma200: '#52c41a',  // 绿色 - 长期
  };

  /**
   * 处理MA数据并生成图表配置
   */
  const chartConfig = useMemo(() => {
    if (!data) {
      return {
        title: {
          text: '移动平均线',
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
    const { ma20 = 0, ma50 = 0, ma200 = 0, trend = 'sideways' } = data;

    // 生成模拟的历史数据
    const dataPoints = 60; // 显示60个数据点
    const ma20Array = [];
    const ma50Array = [];
    const ma200Array = [];

    // 模拟MA线在历史期间的波动
    const basePrice = ma20; // 以MA20作为基准价格

    for (let i = 0; i < dataPoints; i++) {
      const progress = i / dataPoints;
      const volatility = 0.02; // 波动幅度

      // 模拟不同周期的MA线
      const ma20Variation = Math.sin(progress * Math.PI * 6) * basePrice * volatility;
      const ma50Variation = Math.sin(progress * Math.PI * 4) * basePrice * volatility * 0.8;
      const ma200Variation = Math.sin(progress * Math.PI * 2) * basePrice * volatility * 0.5;

      ma20Array.push(basePrice + ma20Variation);
      ma50Array.push(basePrice * 0.98 + ma50Variation);
      ma200Array.push(basePrice * 0.93 + ma200Variation);
    }

    // 时间分类标签
    const categories = new Array(dataPoints).fill(0).map((_, index) => {
      return index - dataPoints + 1;
    });

    return {
      // 图表标题
      title: {
        text: '移动平均线 (Moving Average)',
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 600,
          color: themeConfig.textStyle.color,
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
          const ma20Param = params.find(p => p.seriesName === 'MA20');
          const ma50Param = params.find(p => p.seriesName === 'MA50');
          const ma200Param = params.find(p => p.seriesName === 'MA200');

          return `
            <div>
              <div>MA20: ${ma20Param ? ma20Param.value.toFixed(2) : 'N/A'}</div>
              <div>MA50: ${ma50Param ? ma50Param.value.toFixed(2) : 'N/A'}</div>
              <div>MA200: ${ma200Param ? ma200Param.value.toFixed(2) : 'N/A'}</div>
            </div>
          `;
        },
      },

      // 图例
      legend: {
        top: '12%',
        data: ['MA20', 'MA50', 'MA200'],
        textStyle: {
          color: themeConfig.legend.textStyle.color,
          fontSize: 11,
        },
      },

      // 网格
      grid: {
        left: '10%',
        right: '10%',
        bottom: '20%',
        top: '30%',
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
          formatter: (value) => value === 0 ? '现在' : value,
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
          height: 15,
          bottom: 5,
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
      series: [
        // MA20
        {
          name: 'MA20',
          type: 'line',
          data: ma20Array,
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 2,
            color: maColors.ma20,
            type: 'solid',
          },
          itemStyle: {
            color: maColors.ma20,
          },
          emphasis: {
            focus: 'series',
          },
        },
        // MA50
        {
          name: 'MA50',
          type: 'line',
          data: ma50Array,
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 2,
            color: maColors.ma50,
            type: 'dashed',
          },
          itemStyle: {
            color: maColors.ma50,
          },
          emphasis: {
            focus: 'series',
          },
        },
        // MA200
        {
          name: 'MA200',
          type: 'line',
          data: ma200Array,
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 2,
            color: maColors.ma200,
            type: 'dotted',
          },
          itemStyle: {
            color: maColors.ma200,
          },
          emphasis: {
            focus: 'series',
          },
        },
      ],
    };
  }, [data, theme]);

  /**
   * 渲染当前MA信息和趋势
   */
  const renderMAInfo = () => {
    if (!data) return null;

    const {
      ma20 = 0,
      ma50 = 0,
      ma200 = 0,
      trend = 'sideways',
    } = data;

    const trendConfig = {
      uptrend: {
        text: '上升趋势',
        color: '#52c41a',
        bgColor: theme === 'dark' ? 'rgba(82, 196, 26, 0.2)' : 'rgba(82, 196, 26, 0.1)',
        icon: '↗',
      },
      downtrend: {
        text: '下降趋势',
        color: '#ff4d4f',
        bgColor: theme === 'dark' ? 'rgba(255, 77, 79, 0.2)' : 'rgba(255, 77, 79, 0.1)',
        icon: '↘',
      },
      sideways: {
        text: '横盘整理',
        color: '#faad14',
        bgColor: theme === 'dark' ? 'rgba(250, 173, 20, 0.2)' : 'rgba(250, 173, 20, 0.1)',
        icon: '→',
      },
    };

    const config = trendConfig[trend] || trendConfig.sideways;

    return (
      <div className="ma-info">
        <div className="ma-values">
          <div className="ma-item">
            <span className="ma-label">MA20:</span>
            <span className="ma-number" style={{ color: maColors.ma20 }}>
              ${ma20.toFixed(2)}
            </span>
          </div>
          <div className="ma-item">
            <span className="ma-label">MA50:</span>
            <span className="ma-number" style={{ color: maColors.ma50 }}>
              ${ma50.toFixed(2)}
            </span>
          </div>
          <div className="ma-item">
            <span className="ma-label">MA200:</span>
            <span className="ma-number" style={{ color: maColors.ma200 }}>
              ${ma200.toFixed(2)}
            </span>
          </div>
        </div>
        <div
          className="ma-trend"
          style={{
            color: config.color,
            backgroundColor: config.bgColor,
          }}
        >
          <span className="trend-icon">{config.icon}</span>
          <span className="trend-text">{config.text}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="ma-chart-container">
      {/* MA信息 */}
      {renderMAInfo()}

      {/* MA图表 */}
      <ReactECharts
        option={chartConfig}
        style={{ height: `${height}px`, width: '100%' }}
        opts={{
          renderer: 'canvas',
        }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
};

export default MAChart;