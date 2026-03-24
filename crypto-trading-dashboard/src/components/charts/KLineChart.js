/**
 * KLineChart K线图表组件
 *
 * 功能说明：
 * 1. 基于ECharts实现的K线图（蜡烛图）
 * 2. 支持数据渲染和格式化显示
 * 3. 图表交互功能（缩放、平移、提示框）
 * 4. 主题适配（浅色/深色主题）
 * 5. 响应式设计，适配不同屏幕尺寸
 *
 * 图表特点：
 * - 阳线（上涨）：绿色，显示为实心柱
 * - 阴线（下跌）：红色，显示为空心柱
 * - 支持鼠标悬停显示详细数据
 * - 支持拖拽缩放查看历史数据
 * - 自动计算价格刻度，优化显示
 *
 * 使用示例：
 * <KLineChart
 *   data={klineData}
 *   theme="light"
 *   height={500}
 *   loading={false}
 * />
 *
 * 数据格式：
 * [
 *   { time: 1640995200000, open: 45000, high: 46000, low: 44000, close: 45500, volume: 125.5 },
 *   ...
 * ]
 */

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { initThemes } from './echartsTheme';
import { createKLineConfig } from './chartConfig';

/**
 * K线图表组件
 * @param {object} props - 组件属性
 * @param {Array} props.data - K线数据数组
 *   每个元素包含：time(时间戳)、open(开盘价)、high(最高价)、low(最低价)、close(收盘价)、volume(成交量)
 * @param {object} props.supportData - 支撑阻力位数据对象（可选）
 *   包含support_levels和resistance_levels数组
 * @param {string} props.theme - 主题名称（'light'|'dark'），默认从context获取
 * @param {number} props.height - 图表高度（像素），默认500
 * @param {boolean} props.loading - 是否显示加载状态
 * @param {string} props.loadingText - 加载提示文字
 * @param {function} props.onEvents - 图表事件回调对象
 *   例如：{ 'click': (params) => {}, 'mouseover': (params) => {} }
 * @param {object} props.customConfig - 自定义ECharts配置
 */
const KLineChart = ({
  data = [],
  supportData = null,
  theme = 'light',
  height = 500,
  loading = false,
  loadingText = '正在加载K线数据...',
  onEvents = {},
  customConfig = {},
}) => {
  /**
   * 初始化ECharts主题
   * 在组件挂载时注册主题
   */
  React.useEffect(() => {
    initThemes();
  }, []);

  /**
   * 处理和格式化K线数据
   * 将数据转换为ECharts需要的格式
   * @returns {object} 包含处理后的data和categories
   */
  const processedData = useMemo(() => {
    console.log('KLineChart 原始数据:', data);

    if (!data || data.length === 0) {
      console.log('KLineChart 数据为空');
      return {
        klineData: [],
        categories: [],
      };
    }

    // 转换K线数据格式为 [open, close, low, high]
    const klineData = data.map(item => [
      item.open,
      item.close,
      item.low,
      item.high,
    ]);

    console.log('KLineChart 转换后的klineData:', klineData);

    // 生成时间分类标签
    // 注意：API返回的是timestamp字段，格式为 "2025-10-29 22:00:00"
    const categories = data.map(item => {
      // 直接使用timestamp字符串，并提取时间部分（小时:分钟）
      const timestamp = item.timestamp || '';
      // 提取日期和小时:分钟，格式如 "10-29 22:00"
      const timeStr = timestamp.split(' ')[1] || '';
      return timeStr;
    });

    console.log('KLineChart categories:', categories);

    // 确保categories不为空
    if (!categories || categories.length === 0) {
      console.log('KLineChart categories为空');
      return {
        klineData,
        categories: [],
      };
    }

    const result = { klineData, categories };
    console.log('KLineChart 最终处理结果:', result);
    return result;
  }, [data]);

  /**
   * 生成图表配置
   * 合并基础配置和自定义配置
   */
  const chartConfig = useMemo(() => {
    console.log('KLineChart 图表配置数据:', {
      klineData: processedData.klineData,
      categories: processedData.categories,
      supportData: supportData
    });

    const baseConfig = createKLineConfig({
      theme,
      data: processedData.klineData,
      categories: processedData.categories,
      height,
      supportData,
    });

    console.log('KLineChart 生成的baseConfig:', baseConfig);

    // 合并自定义配置
    const mergedConfig = {
      ...baseConfig,
      ...customConfig,
      series: customConfig.series || baseConfig.series,
    };

    console.log('KLineChart 最终图表配置:', mergedConfig);
    return mergedConfig;
  }, [theme, processedData, height, supportData, customConfig]);

  /**
   * 图表事件配置
   * 合并用户自定义事件和默认事件
   */
  const events = {
    ...onEvents,
  };

  return (
    <div className="kline-chart-container">
      <ReactECharts
        option={chartConfig}
        style={{ height: `${height}px`, width: '100%' }}
        showLoading={loading}
        loadingOption={{
          text: loadingText,
          color: theme === 'dark' ? '#177ddc' : '#1890ff',
          textColor: theme === 'dark' ? '#ffffff' : '#000000',
          maskColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
        }}
        onEvents={events}
        notMerge={true}  // 不合并配置，每次更新都完全替换
        lazyUpdate={true} // 延迟更新，提升性能
        opts={{
          renderer: 'canvas',  // 使用Canvas渲染
        }}
      />
    </div>
  );
};

export default KLineChart;