/**
 * MACDChart指数平滑移动平均线图表组件
 *
 * 功能说明：
 * 1. 基于ECharts实现的MACD指标图表
 * 2. MACD = DIF线 - DEA线
 * 3. 包含三条线：MACD线、DIF线、DEA线
 * 4. 包含柱状图：MACD Histogram
 * 5. 零轴线：判断多空趋势的分界线
 *
 * MACD指标含义：
 * - DIF > DEA：金叉，买入信号
 * - DIF < DEA：死叉，卖出信号
 * - MACD > 0：多头市场
 * - MACD < 0：空头市场
 * - Histogram > 0：MACD在零轴上方
 * - Histogram < 0：MACD在零轴下方
 *
 * 数据格式：
 * {
 *   macd: 125.5,            // MACD线值（DIF - DEA）
 *   signal: 118.2,          // 信号线值（DEA）
 *   histogram: 7.3,         // 柱状图值
 *   signal_type: 'bullish'   // 信号类型：bullish(看涨) / bearish(看跌)
 * }
 *
 * 使用示例：
 * <MACDChart
 *   data={{ macd: 125.5, signal: 118.2, histogram: 7.3, signal_type: 'bullish' }}
 *   theme="light"
 *   height={300}
 *   color="#52c41a"
 * />
 */

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { getThemeConfig } from '../charts/echartsTheme';

/**
 * MACD图表组件
 * @param {object} props - 组件属性
 * @param {object} props.data - MACD数据对象
 * @param {string} props.theme - 主题名称
 * @param {number} props.height - 图表高度
 * @param {string} props.color - 主线条颜色
 */
const MACDChart = ({
  data = null,
  theme = 'light',
  height = 300,
  color = '#52c41a',
}) => {
  /**
   * 处理MACD数据并生成图表配置
   */
  const chartConfig = useMemo(() => {
    if (!data || data.macd === undefined) {
      return {
        title: {
          text: 'MACD指数平滑移动平均线',
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

    // 生成模拟的历史数据（基于当前值生成一些变化）
    // 实际项目中这些数据应该来自API
    const dataPoints = 30; // 显示30个数据点
    const { macd = 0, signal = 0 } = data;

    // 生成模拟的MACD、DIF、DEA历史数据
    const macdData = [];
    const difData = [];
    const deaData = [];

    let currentMacd = macd;
    let currentSignal = signal;

    for (let i = 0; i < dataPoints; i++) {
      // 随机波动
      const volatility = 0.1;
      const macdChange = (Math.random() - 0.5) * volatility * macd;
      const signalChange = (Math.random() - 0.5) * volatility * signal;

      currentMacd += macdChange;
      currentSignal += signalChange;

      // 计算DIF（这里用macd模拟）
      const dif = currentMacd + (Math.random() - 0.5) * volatility * 2;

      macdData.push(currentMacd);
      difData.push(dif);
      deaData.push(currentSignal);
    }

    // 时间分类标签
    const categories = new Array(dataPoints).fill(0).map((_, index) => {
      return index - dataPoints + 1;
    });

    return {
      // 图表标题
      title: {
        text: 'MACD指数平滑移动平均线',
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
          const result = ['<div>'];
          result.push(`<div>MACD: ${params[0].value.toFixed(2)}</div>`);
          result.push(`<div>DIF: ${params[1].value.toFixed(2)}</div>`);
          result.push(`<div>DEA: ${params[2].value.toFixed(2)}</div>`);
          result.push('</div>');
          return result.join('');
        },
      },

      // 图例
      legend: {
        top: '12%',
        data: ['MACD', 'DIF', 'DEA'],
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
        // 零轴线
        {
          name: '零轴线',
          type: 'line',
          data: new Array(dataPoints).fill(0),
          lineStyle: {
            color: themeConfig.textStyle.color,
            width: 1,
            type: 'dotted',
            opacity: 0.3,
          },
          symbol: 'none',
          tooltip: { show: false },
        },
        // MACD柱状图
        {
          name: 'MACD',
          type: 'bar',
          data: macdData.map(value => value * 2), // 放大柱状图以便观察
          itemStyle: {
            color: (params) => {
              return params.value >= 0
                ? (theme === 'dark' ? 'rgba(82, 196, 26, 0.6)' : 'rgba(82, 196, 26, 0.5)')
                : (theme === 'dark' ? 'rgba(255, 77, 79, 0.6)' : 'rgba(255, 77, 79, 0.5)');
            },
            borderRadius: [2, 2, 0, 0],
          },
          barWidth: '60%',
        },
        // DIF线
        {
          name: 'DIF',
          type: 'line',
          data: difData,
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 2,
            color: '#1890ff',
          },
          itemStyle: {
            color: '#1890ff',
          },
        },
        // DEA线
        {
          name: 'DEA',
          type: 'line',
          data: deaData,
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 2,
            color: color,
          },
          itemStyle: {
            color: color,
          },
        },
      ],
    };
  }, [data, theme, color]);

  /**
   * 渲染当前MACD信息和信号
   */
  const renderMACDInfo = () => {
    if (!data) return null;

    const {
      macd = 0,
      signal = 0,
      histogram = 0,
      signal_type = 'neutral',
    } = data;

    const signalConfig = {
      bullish: {
        text: '看涨',
        color: '#52c41a',
        bgColor: theme === 'dark' ? 'rgba(82, 196, 26, 0.2)' : 'rgba(82, 196, 26, 0.1)',
        icon: '↗',
      },
      bearish: {
        text: '看跌',
        color: '#ff4d4f',
        bgColor: theme === 'dark' ? 'rgba(255, 77, 79, 0.2)' : 'rgba(255, 77, 79, 0.1)',
        icon: '↘',
      },
      neutral: {
        text: '中性',
        color: '#1890ff',
        bgColor: theme === 'dark' ? 'rgba(24, 144, 255, 0.2)' : 'rgba(24, 144, 255, 0.1)',
        icon: '→',
      },
    };

    const config = signalConfig[signal_type] || signalConfig.neutral;

    return (
      <div className="macd-info">
        <div className="macd-values">
          <div className="macd-item">
            <span className="macd-label">MACD:</span>
            <span className="macd-number" style={{ color }}>
              {macd.toFixed(2)}
            </span>
          </div>
          <div className="macd-item">
            <span className="macd-label">DIF:</span>
            <span className="macd-number" style={{ color: '#1890ff' }}>
              {(macd + histogram).toFixed(2)}
            </span>
          </div>
          <div className="macd-item">
            <span className="macd-label">DEA:</span>
            <span className="macd-number" style={{ color }}>
              {signal.toFixed(2)}
            </span>
          </div>
        </div>
        <div
          className="macd-signal"
          style={{
            color: config.color,
            backgroundColor: config.bgColor,
          }}
        >
          <span className="signal-icon">{config.icon}</span>
          <span className="signal-text">{config.text}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="macd-chart-container">
      {/* MACD信息 */}
      {renderMACDInfo()}

      {/* MACD图表 */}
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

export default MACDChart;