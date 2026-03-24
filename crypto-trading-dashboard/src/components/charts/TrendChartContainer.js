/**
 * TrendChartContainer趋势图表容器组件
 *
 * 功能说明：
 * 1. 整合趋势图表和日期选择器
 * 2. 实现自定义时间范围查询
 * 3. 数据验证和错误处理
 * 4. 支持币种筛选功能
 *
 * 数据流向：
 * 1. 用户选择日期范围
 * 2. 组件调用API获取数据
 * 3. 数据返回后更新图表
 *
 * 使用示例：
 * <TrendChartContainer
 *   availableCoins={['BTCUSDT', 'ETHUSDT', 'LTCUSDT']}
 *   defaultCoins={['BTCUSDT', 'ETHUSDT']}
 * />
 */

import React, { useState, useEffect } from 'react';
import { getTrendData } from '../../api/market';
import TrendChart from './TrendChart';
import DateRangePicker from '../common/DateRangePicker';

/**
 * 趋势图表容器组件（v2.0适配）
 * v2.0使用预设周期（1d, 7d, 30d）替代自定义日期范围
 * @param {object} props - 组件属性
 * @param {Array<string>} props.availableCoins - 可选择的币种列表（v2.0需使用USDT后缀格式）
 * @param {Array<string>} props.defaultCoins - 默认选中的币种
 * @param {number} props.height - 图表高度
 */
const TrendChartContainer = ({
  availableCoins = ['BTCUSDT', 'ETHUSDT', 'LTCUSDT'], // v2.0需使用USDT后缀格式
  defaultCoins = ['BTCUSDT', 'ETHUSDT'], // v2.0需使用USDT后缀格式
  height = 400,
}) => {
  // 组件内部状态
  const [trendData, setTrendData] = useState(null);        // 趋势数据
  const [loading, setLoading] = useState(false);           // 加载状态
  const [error, setError] = useState(null);                // 错误信息
  const [startDate, setStartDate] = useState('');          // 开始日期
  const [endDate, setEndDate] = useState('');              // 结束日期
  const [selectedCoins, setSelectedCoins] = useState(defaultCoins); // 选中的币种

  /**
   * 获取趋势数据（v2.0适配）
   * v2.0使用period参数替代自定义日期范围
   * @param {Array<string>} coins - 币种列表（v2.0不支持多币种批量查询）
   * @param {string} period - 周期（1d, 7d, 30d）
   */
  const fetchTrendData = async (coins, period = '7d') => {
    try {
      setLoading(true);
      setError(null);

      // v2.0：一次只能查询一个币种
      const symbol = coins && coins.length > 0 ? coins[0] : null;

      console.log(`正在获取趋势数据: 币种: ${symbol}, 周期: ${period}`);

      const data = await getTrendData({
        symbol, // v2.0不支持多币种，传递单个币种
        period, // v2.0使用period替代start_date和end_date
      });

      setTrendData(data);
      console.log('趋势数据获取成功:', data);
    } catch (err) {
      console.error('获取趋势数据失败:', err);
      setError(err.message || '获取趋势数据失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 组件挂载时获取默认数据（最近7天）
   * v2.0：使用period参数替代自定义日期范围
   */
  useEffect(() => {
    // v2.0：默认使用7天周期
    fetchTrendData(selectedCoins, '7d');
  }, []);

  /**
   * 处理币种变化（v2.0适配）
   * @param {Array<string>} newCoins - 新选中的币种列表
   */
  const handleCoinChange = async (newCoins) => {
    setSelectedCoins(newCoins);

    // v2.0：重新获取当前周期的数据
    // 注意：这里简化处理，只使用默认的7d周期
    // 实际项目中可以增加周期选择逻辑
    if (newCoins && newCoins.length > 0) {
      await fetchTrendData(newCoins, '7d');
    }
  };

  /**
   * 处理周期变化（v2.0新增）
   * @param {string} period - 新的周期（1d, 7d, 30d）
   */
  const handlePeriodChange = async (period) => {
    if (selectedCoins && selectedCoins.length > 0) {
      await fetchTrendData(selectedCoins, period);
    }
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
      <p className="error-message">❌ {error}</p>
      <button
        className="retry-button"
        onClick={() => fetchTrendData(selectedCoins, '7d')}
      >
        重新加载
      </button>
    </div>
  );

  return (
    <div className="trend-chart-container-wrapper">
      {/* 周期选择器（v2.0新增） */}
      <div className="trend-header">
        <h3 className="trend-title">价格趋势分析</h3>
        <div className="period-selector">
          <button
            className="period-button"
            onClick={() => handlePeriodChange('1d')}
          >
            1天
          </button>
          <button
            className="period-button"
            onClick={() => handlePeriodChange('7d')}
          >
            7天
          </button>
          <button
            className="period-button"
            onClick={() => handlePeriodChange('30d')}
          >
            30天
          </button>
        </div>
      </div>

      {/* 趋势图表区域 */}
      <div className="trend-chart-content">
        {loading && renderLoading()}
        {error && renderError()}
        {!loading && !error && (
          <TrendChart
            data={trendData}
            theme="light"
            height={height}
            showCoinFilter={true}
            selectedCoins={selectedCoins}
            onCoinChange={handleCoinChange}
          />
        )}
      </div>
    </div>
  );
};

export default TrendChartContainer;