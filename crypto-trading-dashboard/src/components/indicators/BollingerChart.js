/**
 * BollingerChart布林带图表组件
 *
 * 功能说明：
 * 1. 基于ECharts实现的布林带指标图表
 * 2. 布林带包含三条线：上轨（Upper）、中轨（Middle）、下轨（Lower）
 * 3. 中轨 = 20日移动平均线（MA20）
 * 4. 上轨 = 中轨 + 2倍标准差
 * 5. 下轨 = 中轨 - 2倍标准差
 * 6. 价格突破上轨可能超买，跌破下轨可能超卖
 *
 * 布林带含义：
 * - 价格触及上轨：可能超买，关注卖出信号
 * - 价格触及下轨：可能超卖，关注买入信号
 * - 带宽收窄：波动率降低，可能迎来大幅行情
 * - 带宽扩张：波动率升高，趋势明确
 * - 价格在中轨附近：正常波动区间
 *
 * 数据格式：
 * {
 *   upper: 46500,           // 布林带上轨
 *   middle: 45000,          // 布林带中轨（20日移动平均）
 *   lower: 43500,           // 布林带下轨
 *   position: 0.65          // 当前价格在布林带中的位置（0-1）
 * }
 *
 * 使用示例：
 * <BollingerChart
 *   data={{ upper: 46500, middle: 45000, lower: 43500, position: 0.65 }}
 *   theme="light"
 *   height={300}
 *   color="#faad14"
 * />
 */

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { getThemeConfig } from '../charts/echartsTheme';

/**
 * 布林带图表组件
 * @param {object} props - 组件属性
 * @param {object} props.data - 布林带数据对象
 * @param {string} props.theme - 主题名称
 * @param {number} props.height - 图表高度
 * @param {string} props.color - 主线条颜色
 */
const BollingerChart = ({
  data = null,
  theme = 'light',
  height = 300,
  color = '#faad14',
}) => {
  /**
   * 处理布林带数据并生成图表配置
   */
  const chartConfig = useMemo(() => {
    if (!data || !data.upper || !data.middle || !data.lower) {
      return {
        title: {
          text: '布林带',
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
    const { upper = 0, middle = 0, lower = 0, position = 0.5 } = data;

    // 生成模拟的历史数据
    const dataPoints = 50; // 显示50个数据点
    const bandWidth = upper - lower;
    const midPrice = middle;

    // 生成模拟的布林带历史数据
    const upperData = [];
    const middleData = [];
    const lowerData = [];

    for (let i = 0; i < dataPoints; i++) {
      // 模拟布林带在一定范围内波动
      const progress = i / dataPoints;
      const volatility = 0.1; // 波动幅度

      const upperVariation = Math.sin(progress * Math.PI * 4) * bandWidth * volatility * 0.1;
      const lowerVariation = -upperVariation;

      upperData.push(upper + upperVariation);
      middleData.push(midPrice + Math.sin(progress * Math.PI * 2) * bandWidth * volatility * 0.05);
      lowerData.push(lower + lowerVariation);
    }

    // 时间分类标签
    const categories = new Array(dataPoints).fill(0).map((_, index) => {
      return index - dataPoints + 1;
    });

    return {
      // 图表标题
      title: {
        text: '布林带 (Bollinger Bands)',
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
          const upperParam = params.find(p => p.seriesName === '上轨');
          const middleParam = params.find(p => p.seriesName === '中轨');
          const lowerParam = params.find(p => p.seriesName === '下轨');

          const upper = upperParam ? upperParam.value : 0;
          const middle = middleParam ? middleParam.value : 0;
          const lower = lowerParam ? lowerParam.value : 0;
          const bandWidth = upper - lower;

          return `
            <div>
              <div>上轨: ${upper.toFixed(2)}</div>
              <div>中轨: ${middle.toFixed(2)}</div>
              <div>下轨: ${lower.toFixed(2)}</div>
              <div>带宽: ${bandWidth.toFixed(2)}</div>
            </div>
          `;
        },
      },

      // 图例
      legend: {
        top: '12%',
        data: ['上轨', '中轨', '下轨'],
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
        // 布林带区域填充（上轨和下轨之间）
        {
          name: '布林带',
          type: 'line',
          data: upperData,
          lineStyle: { opacity: 0 },
          areaStyle: {
            color: theme === 'dark'
              ? 'rgba(250, 173, 20, 0.1)'
              : 'rgba(250, 173, 20, 0.08)',
          },
          tooltip: { show: false },
        },
        {
          name: '布林带',
          type: 'line',
          data: lowerData,
          lineStyle: { opacity: 0 },
          areaStyle: {
            color: theme === 'dark'
              ? 'rgba(250, 173, 20, 0.1)'
              : 'rgba(250, 173, 20, 0.08)',
          },
          tooltip: { show: false },
        },
        // 上轨线
        {
          name: '上轨',
          type: 'line',
          data: upperData,
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 2,
            color: '#ff4d4f',
            type: 'dashed',
          },
          itemStyle: {
            color: '#ff4d4f',
          },
        },
        // 中轨线
        {
          name: '中轨',
          type: 'line',
          data: middleData,
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
        // 下轨线
        {
          name: '下轨',
          type: 'line',
          data: lowerData,
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 2,
            color: '#52c41a',
            type: 'dashed',
          },
          itemStyle: {
            color: '#52c41a',
          },
        },
      ],
    };
  }, [data, theme, color]);

  /**
   * 渲染当前布林带信息和价格位置
   */
  const renderBollingerInfo = () => {
    if (!data) return null;

    const {
      upper = 0,
      middle = 0,
      lower = 0,
      position = 0.5,
    } = data;

    const bandWidth = upper - lower;
    const currentPosition = position;

    // 判断价格位置
    let positionText = '正常区间';
    let positionColor = color;
    let positionIcon = '→';

    if (currentPosition > 0.8) {
      positionText = '接近上轨';
      positionColor = '#ff4d4f';
      positionIcon = '↗';
    } else if (currentPosition < 0.2) {
      positionText = '接近下轨';
      positionColor = '#52c41a';
      positionIcon = '↘';
    }

    return (
      <div className="bollinger-info">
        <div className="bollinger-bands">
          <div className="band-item">
            <span className="band-label">上轨:</span>
            <span className="band-value" style={{ color: '#ff4d4f' }}>
              ${upper.toFixed(2)}
            </span>
          </div>
          <div className="band-item">
            <span className="band-label">中轨:</span>
            <span className="band-value" style={{ color }}>
              ${middle.toFixed(2)}
            </span>
          </div>
          <div className="band-item">
            <span className="band-label">下轨:</span>
            <span className="band-value" style={{ color: '#52c41a' }}>
              ${lower.toFixed(2)}
            </span>
          </div>
          <div className="band-item">
            <span className="band-label">带宽:</span>
            <span className="band-value">
              ${bandWidth.toFixed(2)}
            </span>
          </div>
        </div>
        <div
          className="bollinger-position"
          style={{
            color: positionColor,
          }}
        >
          <span className="position-icon">{positionIcon}</span>
          <span className="position-text">{positionText}</span>
          <span className="position-percent">
            ({Math.round(currentPosition * 100)}%)
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bollinger-chart-container">
      {/* 布林带信息 */}
      {renderBollingerInfo()}

      {/* 布林带图表 */}
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

export default BollingerChart;