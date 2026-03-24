/**
 * RSIChart相对强弱指数图表组件
 *
 * 功能说明：
 * 1. 基于ECharts实现的RSI指标图表
 * 2. RSI值范围：0-100
 * 3. 关键线：70（超买线）、30（超卖线）、50（中轴线）
 * 4. 区域填充：超买区（70-100）、超卖区（0-30）、中性区（30-70）
 * 5. 信号指示： RSI > 70 卖出信号，RSI < 30 买入信号
 *
 * RSI指标含义：
 * - RSI > 70：超买状态，价格可能过高，即将下跌
 * - RSI < 30：超卖状态，价格可能过低，即将上涨
 * - RSI 30-70：正常波动区间
 * - RSI ≈ 50：多空均衡
 *
 * 数据格式：
 * {
 *   value: 65.5,           // 当前RSI值
 *   signal: 'neutral',      // 信号：overbought(超买) / oversold(超卖) / neutral(中性)
 *   history: [45.2, 50.1, 55.3, ...]  // 历史RSI值数组
 * }
 *
 * 使用示例：
 * <RSIChart
 *   data={{ value: 65.5, signal: 'neutral', history: [...] }}
 *   theme="light"
 *   height={300}
 *   color="#1890ff"
 * />
 */

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { getThemeConfig } from '../charts/echartsTheme';

/**
 * RSI图表组件
 * @param {object} props - 组件属性
 * @param {object} props.data - RSI数据对象
 * @param {string} props.theme - 主题名称
 * @param {number} props.height - 图表高度
 * @param {string} props.color - RSI线条颜色
 */
const RSIChart = ({
  data = null,
  theme = 'light',
  height = 300,
  color = '#1890ff',
}) => {
  /**
   * 处理RSI数据并生成图表配置
   */
  const chartConfig = useMemo(() => {
    if (!data || !data.history || data.history.length === 0) {
      return {
        title: {
          text: 'RSI相对强弱指数',
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

    // 生成时间分类标签（基于历史数据长度）
    const categories = data.history.map((_, index) => {
      // 显示相对位置，例如：-99, -98, ..., 0
      return index - data.history.length + 1;
    });

    return {
      // 图表标题
      title: {
        text: 'RSI相对强弱指数',
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
          type: 'line',
        },
        backgroundColor: themeConfig.tooltip.backgroundColor,
        borderColor: themeConfig.tooltip.borderColor,
        borderWidth: 1,
        textStyle: {
          color: themeConfig.tooltip.textStyle.color,
        },
        formatter: (params) => {
          const param = params[0];
          const value = param.value;
          let signal = '中性';

          if (value > 70) {
            signal = '超买';
          } else if (value < 30) {
            signal = '超卖';
          }

          return `
            <div>
              <div>RSI: ${value.toFixed(2)}</div>
              <div>信号: ${signal}</div>
            </div>
          `;
        },
      },

      // 网格
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        top: '20%',
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
        min: 0,
        max: 100,
        axisLine: {
          lineStyle: {
            color: themeConfig.valueAxis.axisLine.lineStyle.color,
          },
        },
        axisLabel: {
          color: themeConfig.valueAxis.axisLabel.color,
          fontSize: 11,
          formatter: (value) => value,
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
          filterMode: 'filter',
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
        // 超买区域 (70-100)
        {
          name: '超买区',
          type: 'line',
          data: data.history.map(value => Math.max(value, 70)),
          lineStyle: { opacity: 0 },
          areaStyle: {
            color: theme === 'dark'
              ? 'rgba(255, 77, 79, 0.1)'
              : 'rgba(255, 77, 79, 0.08)',
          },
          tooltip: { show: false },
        },
        // 超卖区域 (0-30)
        {
          name: '超卖区',
          type: 'line',
          data: data.history.map(value => Math.min(value, 30)),
          lineStyle: { opacity: 0 },
          areaStyle: {
            color: theme === 'dark'
              ? 'rgba(82, 196, 26, 0.1)'
              : 'rgba(82, 196, 26, 0.08)',
          },
          tooltip: { show: false },
        },
        // RSI主线条
        {
          name: 'RSI',
          type: 'line',
          data: data.history,
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 2,
            color: color,
          },
          itemStyle: {
            color: color,
          },
          emphasis: {
            focus: 'series',
          },
        },
        // 超买线 (70)
        {
          name: '超买线',
          type: 'line',
          data: new Array(data.history.length).fill(70),
          lineStyle: {
            color: '#ff4d4f',
            width: 1,
            type: 'dashed',
            opacity: 0.5,
          },
          symbol: 'none',
          tooltip: { show: false },
        },
        // 超卖线 (30)
        {
          name: '超卖线',
          type: 'line',
          data: new Array(data.history.length).fill(30),
          lineStyle: {
            color: '#52c41a',
            width: 1,
            type: 'dashed',
            opacity: 0.5,
          },
          symbol: 'none',
          tooltip: { show: false },
        },
        // 中轴线 (50)
        {
          name: '中轴线',
          type: 'line',
          data: new Array(data.history.length).fill(50),
          lineStyle: {
            color: themeConfig.textStyle.color,
            width: 1,
            type: 'dotted',
            opacity: 0.3,
          },
          symbol: 'none',
          tooltip: { show: false },
        },
      ],
    };
  }, [data, theme, color]);

  /**
   * 渲染当前RSI值和信号
   */
  const renderRSIInfo = () => {
    if (!data) return null;

    const { value = 0, signal = 'neutral' } = data;
    const signalConfig = {
      overbought: {
        text: '超买',
        color: '#ff4d4f',
        bgColor: theme === 'dark' ? 'rgba(255, 77, 79, 0.2)' : 'rgba(255, 77, 79, 0.1)',
      },
      oversold: {
        text: '超卖',
        color: '#52c41a',
        bgColor: theme === 'dark' ? 'rgba(82, 196, 26, 0.2)' : 'rgba(82, 196, 26, 0.1)',
      },
      neutral: {
        text: '中性',
        color: '#1890ff',
        bgColor: theme === 'dark' ? 'rgba(24, 144, 255, 0.2)' : 'rgba(24, 144, 255, 0.1)',
      },
    };

    const config = signalConfig[signal] || signalConfig.neutral;

    return (
      <div className="rsi-info">
        <div className="rsi-value">
          <span className="rsi-label">当前RSI:</span>
          <span className="rsi-number" style={{ color }}>
            {value.toFixed(2)}
          </span>
        </div>
        <div
          className="rsi-signal"
          style={{
            color: config.color,
            backgroundColor: config.bgColor,
          }}
        >
          {config.text}
        </div>
      </div>
    );
  };

  return (
    <div className="rsi-chart-container">
      {/* RSI信息 */}
      {renderRSIInfo()}

      {/* RSI图表 */}
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

export default RSIChart;