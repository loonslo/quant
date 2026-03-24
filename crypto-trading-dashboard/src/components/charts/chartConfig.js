/**
 * ECharts基础图表配置工具
 *
 * 功能说明：
 * 1. 提供通用的图表配置选项
 * 2. 支持响应式配置
 * 3. 封装常用图表类型的默认配置
 * 4. 主题适配和颜色管理
 *
 * 包含的配置类型：
 * - K线图配置 (KLineConfig)
 * - 折线图配置 (LineConfig)
 * - 柱状图配置 (BarConfig)
 * - 基础配置 (BaseConfig)
 */

import { getThemeConfig } from './echartsTheme';

/**
 * 基础图表配置
 * @param {object} options - 配置选项
 * @param {string} options.theme - 主题名称（'light'|'dark'）
 * @param {string} options.title - 图表标题
 * @param {string} options.xAxisName - X轴名称
 * @param {string} options.yAxisName - Y轴名称
 * @param {boolean} options.showGrid - 是否显示网格
 * @param {boolean} options.showLegend - 是否显示图例
 * @param {number} options.height - 图表高度（像素）
 * @returns {object} ECharts配置对象
 */
export const createBaseConfig = ({
  theme = 'light',
  title = '',
  xAxisName = '',
  yAxisName = '',
  showGrid = true,
  showLegend = true,
  height = 400,
} = {}) => {
  const themeConfig = getThemeConfig(theme);

  return {
    // 图表标题
    title: title ? {
      text: title,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: themeConfig.textStyle.color,
      },
      subtextStyle: {
        color: themeConfig.textStyle.color,
      },
    } : undefined,

    // 提示框组件
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        animation: false,
        lineStyle: {
          color: theme === 'dark' ? '#ffffff' : '#666666',
          width: 1,
          opacity: 1,
        },
      },
      backgroundColor: themeConfig.tooltip.backgroundColor,
      borderColor: themeConfig.tooltip.borderColor,
      borderWidth: 1,
      textStyle: {
        color: themeConfig.tooltip.textStyle.color,
      },
      extraCssText: themeConfig.tooltip.extraCssText,
    },

    // 网格配置
    grid: showGrid ? {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: showLegend ? '20%' : '10%',
      containLabel: true,
    } : undefined,

    // 图例配置
    legend: showLegend ? {
      top: '5%',
      data: [],
      textStyle: {
        color: themeConfig.legend.textStyle.color,
      },
    } : undefined,

    // X轴配置
    xAxis: {
      type: 'category',
      name: xAxisName,
      nameLocation: 'middle',
      nameGap: 30,
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: themeConfig.categoryAxis.axisLine.lineStyle.color,
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: themeConfig.categoryAxis.axisLabel.color,
        fontSize: 12,
      },
      splitLine: {
        show: false,
      },
    },

    // Y轴配置
    yAxis: {
      type: 'value',
      name: yAxisName,
      nameLocation: 'middle',
      nameGap: 50,
      scale: true,  // 缩放，不从0开始
      axisLine: {
        lineStyle: {
          color: themeConfig.valueAxis.axisLine.lineStyle.color,
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: themeConfig.valueAxis.axisLabel.color,
        fontSize: 12,
        formatter: (value) => {
          // 数值格式化
          if (value >= 1e9) {
            return (value / 1e9).toFixed(1) + 'B';
          }
          if (value >= 1e6) {
            return (value / 1e6).toFixed(1) + 'M';
          }
          if (value >= 1e3) {
            return (value / 1e3).toFixed(1) + 'K';
          }
          return value.toFixed(2);
        },
      },
      splitLine: {
        lineStyle: {
          color: themeConfig.valueAxis.splitLine.lineStyle.color,
          type: 'dashed',
        },
      },
    },

    // 数据缩放配置（可选）
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'filter',
      },
      {
        type: 'slider',
        xAxisIndex: 0,
        filterMode: 'filter',
        height: 20,
        bottom: 10,
        handleSize: 0,
        brushSelect: false,
        textStyle: {
          color: themeConfig.textStyle.color,
        },
        fillerColor: theme === 'dark' ? 'rgba(23, 125, 220, 0.15)' : 'rgba(24, 144, 255, 0.15)',
        borderColor: themeConfig.grid.borderColor,
      },
    ],

    // 动画配置
    animation: true,
    animationDuration: 300,
    animationEasing: 'cubicOut',
  };
};

/**
 * K线图配置
 * @param {object} options - 配置选项
 * @param {string} options.theme - 主题名称
 * @param {Array} options.data - K线数据 [[open, close, low, high], ...]
 * @param {Array} options.categories - 时间分类标签
 * @param {number} options.height - 图表高度
 * @param {object} options.supportData - 支撑阻力位数据（可选）
 *   包含 support_levels 和 resistance_levels 数组
 * @returns {object} ECharts配置对象
 */
export const createKLineConfig = ({
  theme = 'light',
  data = [],
  categories = [],
  height = 500,
  supportData = null,
} = {}) => {
  const baseConfig = createBaseConfig({
    theme,
    xAxisName: '时间',
    yAxisName: '价格',
    height,
  });

  // 构建基础K线图数据系列
  const series = [
    {
      name: 'K线',
      type: 'candlestick',
      data: data,
      itemStyle: {
        color: '#52c41a',      // 阳线颜色（上涨）- 绿色
        color0: '#ff4d4f',     // 阴线颜色（下跌）- 红色
        borderColor: '#52c41a',
        borderColor0: '#ff4d4f',
      },
      emphasis: {
        itemStyle: {
          color: '#52c41a',
          color0: '#ff4d4f',
          borderColor: '#52c41a',
          borderColor0: '#ff4d4f',
        },
      },
    },
  ];

  // 如果有支撑阻力数据，添加支撑阻力线
  if (supportData && (supportData.support_levels || supportData.resistance_levels)) {
    const dataPoints = categories ? categories.length : 0;
    const themeConfig = getThemeConfig(theme);

    // 如果没有数据点，不显示支撑阻力线
    if (dataPoints === 0) {
      return {
        ...baseConfig,
        series,
      };
    }

    // 添加支撑位线条
    if (supportData.support_levels && supportData.support_levels.length > 0) {
      supportData.support_levels.forEach((level, index) => {
        series.push({
          name: `支撑${index + 1}`,
          type: 'line',
          data: new Array(dataPoints).fill(level.price),
          lineStyle: {
            color: '#52c41a',  // 支撑位用绿色
            width: 1.5,
            type: 'dashed',
            opacity: 0.8,
          },
          symbol: 'none',
          tooltip: {
            show: true,
            formatter: () => {
              return `
                <div>
                  <div>支撑位 ${index + 1}</div>
                  <div>价格: $${level.price.toFixed(2)}</div>
                  <div>强度: ${(level.strength * 100).toFixed(0)}%</div>
                  <div>触及次数: ${level.touches}</div>
                </div>
              `;
            },
          },
          markLine: {
            silent: true,
            symbol: 'none',
            lineStyle: {
              color: '#52c41a',
              width: 1.5,
              type: 'dashed',
              opacity: 0.6,
            },
            label: {
              show: true,
              position: 'end',
              formatter: `支撑: $${level.price.toFixed(0)}`,
              color: themeConfig.textStyle.color,
              fontSize: 11,
            },
            data: [
              {
                yAxis: level.price,
              },
            ],
          },
        });
      });
    }

    // 添加阻力位线条
    if (supportData.resistance_levels && supportData.resistance_levels.length > 0) {
      supportData.resistance_levels.forEach((level, index) => {
        series.push({
          name: `阻力${index + 1}`,
          type: 'line',
          data: new Array(dataPoints).fill(level.price),
          lineStyle: {
            color: '#ff4d4f',  // 阻力位用红色
            width: 1.5,
            type: 'dashed',
            opacity: 0.8,
          },
          symbol: 'none',
          tooltip: {
            show: true,
            formatter: () => {
              return `
                <div>
                  <div>阻力位 ${index + 1}</div>
                  <div>价格: $${level.price.toFixed(2)}</div>
                  <div>强度: ${(level.strength * 100).toFixed(0)}%</div>
                  <div>触及次数: ${level.touches}</div>
                </div>
              `;
            },
          },
          markLine: {
            silent: true,
            symbol: 'none',
            lineStyle: {
              color: '#ff4d4f',
              width: 1.5,
              type: 'dashed',
              opacity: 0.6,
            },
            label: {
              show: true,
              position: 'end',
              formatter: `阻力: $${level.price.toFixed(0)}`,
              color: themeConfig.textStyle.color,
              fontSize: 11,
            },
            data: [
              {
                yAxis: level.price,
              },
            ],
          },
        });
      });
    }
  }

  return {
    ...baseConfig,
    xAxis: {
      ...baseConfig.xAxis,
      data: categories,  // 设置X轴数据
    },
    series,
  };
};

/**
 * 折线图配置
 * @param {object} options - 配置选项
 * @param {string} options.theme - 主题名称
 * @param {Array} options.data - 折线数据
 * @param {Array} options.categories - X轴分类
 * @param {string} options.seriesName - 数据系列名称
 * @param {string} options.lineColor - 折线颜色
 * @param {number} options.height - 图表高度
 * @returns {object} ECharts配置对象
 */
export const createLineConfig = ({
  theme = 'light',
  data = [],
  categories = [],
  seriesName = '数据',
  lineColor = null,
  height = 400,
} = {}) => {
  const baseConfig = createBaseConfig({
    theme,
    height,
  });

  return {
    ...baseConfig,
    xAxis: {
      ...baseConfig.xAxis,
      data: categories,
    },
    series: [
      {
        name: seriesName,
        type: 'line',
        data: data,
        smooth: true,  // 平滑曲线
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 2,
          color: lineColor,
        },
        itemStyle: {
          color: lineColor,
        },
        areaStyle: {
          opacity: 0.1,  // 区域填充透明度
        },
        emphasis: {
          focus: 'series',
        },
      },
    ],
  };
};

/**
 * 柱状图配置
 * @param {object} options - 配置选项
 * @param {string} options.theme - 主题名称
 * @param {Array} options.data - 柱状图数据
 * @param {Array} options.categories - X轴分类
 * @param {string} options.seriesName - 数据系列名称
 * @param {string} options.barColor - 柱状图颜色
 * @param {number} options.height - 图表高度
 * @returns {object} ECharts配置对象
 */
export const createBarConfig = ({
  theme = 'light',
  data = [],
  categories = [],
  seriesName = '数据',
  barColor = null,
  height = 400,
} = {}) => {
  const baseConfig = createBaseConfig({
    theme,
    height,
  });

  return {
    ...baseConfig,
    xAxis: {
      ...baseConfig.xAxis,
      data: categories,
    },
    series: [
      {
        name: seriesName,
        type: 'bar',
        data: data,
        itemStyle: {
          color: barColor,
          borderRadius: [4, 4, 0, 0],
        },
        emphasis: {
          itemStyle: {
            opacity: 0.8,
          },
        },
      },
    ],
  };
};

/**
 * 多指标组合图配置
 * 用于展示技术指标（RSI、MACD等）
 * @param {object} options - 配置选项
 * @param {string} options.theme - 主题名称
 * @param {Array} options.series - 数据系列数组
 * @param {number} options.height - 图表高度
 * @returns {object} ECharts配置对象
 */
export const createMultiIndicatorConfig = ({
  theme = 'light',
  series = [],
  height = 400,
} = {}) => {
  const baseConfig = createBaseConfig({
    theme,
    height,
    showLegend: series.length > 1,
  });

  return {
    ...baseConfig,
    series: series.map((item, index) => ({
      name: item.name,
      type: item.type || 'line',
      data: item.data,
      yAxisIndex: item.yAxisIndex || 0,
      smooth: item.type === 'line',
      symbol: item.symbol || 'circle',
      lineStyle: {
        width: item.lineWidth || 2,
        color: item.color,
      },
      itemStyle: {
        color: item.color,
      },
      areaStyle: item.areaStyle || undefined,
      emphasis: {
        focus: 'series',
      },
    })),
  };
};

/**
 * 响应式图表配置
 * 根据容器宽度自动调整图表配置
 * @param {object} options - 配置选项
 * @param {number} options.containerWidth - 容器宽度
 * @returns {object} 响应式配置
 */
export const createResponsiveConfig = (containerWidth = 0) => {
  const isMobile = containerWidth < 768;

  return {
    grid: {
      left: isMobile ? '15%' : '10%',
      right: isMobile ? '15%' : '10%',
      bottom: isMobile ? '20%' : '15%',
      top: isMobile ? '15%' : '20%',
    },
    legend: {
      top: isMobile ? '2%' : '5%',
      textStyle: {
        fontSize: isMobile ? 10 : 12,
      },
    },
    dataZoom: isMobile ? [] : [
      {
        type: 'inside',
        xAxisIndex: 0,
      },
      {
        type: 'slider',
        xAxisIndex: 0,
        height: 20,
        bottom: 10,
      },
    ],
  };
};

const chartConfig = {
  createBaseConfig,
  createKLineConfig,
  createLineConfig,
  createBarConfig,
  createMultiIndicatorConfig,
  createResponsiveConfig,
};

export default chartConfig;