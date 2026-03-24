/**
 * ECharts主题配置
 * 统一管理图表的颜色主题、字体、样式等
 *
 * 主题功能说明：
 * 1. 定义浅色和深色两套主题
 * 2. 响应式主题切换
 * 3. 统一的颜色方案（上涨红、下跌绿，符合交易惯例）
 * 4. 专业的图表样式设计
 *
 * 使用方法：
 * 1. 在组件中导入主题
 * 2. 根据当前主题（light/dark）选择对应配置
 * 3. 传递给ECharts组件
 */

import * as echarts from 'echarts';

/**
 * 浅色主题配置
 * 适用于日间模式或浅色背景
 */
const lightTheme = {
  // 颜色调色板
  color: [
    '#1890ff',  // 主蓝色
    '#52c41a',  // 成功绿
    '#faad14',  // 警告黄
    '#ff4d4f',  // 错误红
    '#722ed1',  // 紫色
    '#13c2c2',  // 青色
    '#eb2f96',  // 粉红色
    '#fa8c16',  // 橙色
  ],

  // 背景色
  backgroundColor: '#ffffff',

  // 文本样式
  textStyle: {
    color: '#262626',       // 主文字色
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  // 标题样式
  title: {
    textStyle: {
      color: '#262626',
      fontWeight: 600,
    },
    subtextStyle: {
      color: '#8c8c8c',
    },
  },

  // 图例样式
  legend: {
    textStyle: {
      color: '#595959',
    },
  },

  // 网格样式
  grid: {
    borderColor: '#f0f0f0',
  },

  // 分类轴样式（X轴）
  categoryAxis: {
    axisLine: {
      lineStyle: {
        color: '#d9d9d9',  // 轴线颜色
      },
    },
    axisTick: {
      lineStyle: {
        color: '#d9d9d9',  // 刻度线颜色
      },
    },
    axisLabel: {
      color: '#8c8c8c',    // 刻度标签颜色
    },
    splitLine: {
      lineStyle: {
        color: ['#f0f0f0'], // 网格线颜色
      },
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)'], // 网格区域背景
      },
    },
  },

  // 数值轴样式（Y轴）
  valueAxis: {
    axisLine: {
      lineStyle: {
        color: '#d9d9d9',
      },
    },
    axisTick: {
      lineStyle: {
        color: '#d9d9d9',
      },
    },
    axisLabel: {
      color: '#8c8c8c',
    },
    splitLine: {
      lineStyle: {
        color: ['#f0f0f0'],
      },
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)'],
      },
    },
  },

  // 工具提示样式
  tooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#d9d9d9',
    borderWidth: 1,
    textStyle: {
      color: '#262626',
    },
    extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); border-radius: 6px;',
  },

  // 图表区域样式
  chart: {
    // K线图样式
    candlestick: {
      itemStyle: {
        color: '#52c41a',      // 阳线（上涨）颜色 - 绿色
        color0: '#ff4d4f',     // 阴线（下跌）颜色 - 红色
        borderColor: '#52c41a',
        borderColor0: '#ff4d4f',
      },
    },
    // 折线图样式
    line: {
      itemStyle: {
        borderWidth: 2,
      },
      lineStyle: {
        width: 2,
      },
      symbolSize: 6,
    },
    // 柱状图样式
    bar: {
      itemStyle: {
        borderRadius: [2, 2, 0, 0],
      },
    },
  },
};

/**
 * 深色主题配置
 * 适用于夜间模式或深色背景
 */
const darkTheme = {
  color: [
    '#177ddc',  // 主蓝色（深色版）
    '#49aa19',  // 成功绿（深色版）
    '#d89614',  // 警告黄（深色版）
    '#d32029',  // 错误红（深色版）
    '#b37feb',  // 紫色（深色版）
    '#36cfc9',  // 青色（深色版）
    '#ff4d91',  // 粉红色（深色版）
    '#fa8c16',  // 橙色（深色版）
  ],

  backgroundColor: '#141414',

  textStyle: {
    color: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  title: {
    textStyle: {
      color: '#ffffff',
      fontWeight: 600,
    },
    subtextStyle: {
      color: '#757575',
    },
  },

  legend: {
    textStyle: {
      color: '#a6a6a6',
    },
  },

  grid: {
    borderColor: '#424242',
  },

  categoryAxis: {
    axisLine: {
      lineStyle: {
        color: '#424242',
      },
    },
    axisTick: {
      lineStyle: {
        color: '#424242',
      },
    },
    axisLabel: {
      color: '#757575',
    },
    splitLine: {
      lineStyle: {
        color: ['#2a2a2a'],
      },
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(0, 0, 0, 0.2)', 'rgba(255, 255, 255, 0.05)'],
      },
    },
  },

  valueAxis: {
    axisLine: {
      lineStyle: {
        color: '#424242',
      },
    },
    axisTick: {
      lineStyle: {
        color: '#424242',
      },
    },
    axisLabel: {
      color: '#757575',
    },
    splitLine: {
      lineStyle: {
        color: ['#2a2a2a'],
      },
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(0, 0, 0, 0.2)', 'rgba(255, 255, 255, 0.05)'],
      },
    },
  },

  tooltip: {
    backgroundColor: 'rgba(31, 31, 31, 0.95)',
    borderColor: '#424242',
    borderWidth: 1,
    textStyle: {
      color: '#ffffff',
    },
    extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5); border-radius: 6px;',
  },

  chart: {
    candlestick: {
      itemStyle: {
        color: '#49aa19',      // 阳线（上涨）颜色 - 绿色
        color0: '#d32029',     // 阴线（下跌）颜色 - 红色
        borderColor: '#49aa19',
        borderColor0: '#d32029',
      },
    },
    line: {
      itemStyle: {
        borderWidth: 2,
      },
      lineStyle: {
        width: 2,
      },
      symbolSize: 6,
    },
    bar: {
      itemStyle: {
        borderRadius: [2, 2, 0, 0],
      },
    },
  },
};

/**
 * 获取主题配置
 * @param {string} theme - 主题名称（'light' 或 'dark'）
 * @returns {object} ECharts主题配置对象
 */
export const getThemeConfig = (theme = 'light') => {
  return theme === 'dark' ? darkTheme : lightTheme;
};

/**
 * 注册主题到ECharts
 * @param {string} theme - 主题名称
 * @param {string} themeConfig - 主题配置对象
 */
export const registerTheme = (theme = 'light', themeConfig = null) => {
  const config = themeConfig || getThemeConfig(theme);
  echarts.registerTheme(theme, config);
  console.log(`ECharts主题 "${theme}" 已注册`);
};

/**
 * 初始化主题
 * 根据当前主题自动注册对应配置
 */
export const initThemes = () => {
  registerTheme('light', lightTheme);
  registerTheme('dark', darkTheme);
  console.log('所有ECharts主题已初始化');
};

// 导出主题配置对象（用于调试或自定义）
export { lightTheme, darkTheme };

const echartsTheme = {
  getThemeConfig,
  registerTheme,
  initThemes,
  lightTheme,
  darkTheme,
};

export default echartsTheme;