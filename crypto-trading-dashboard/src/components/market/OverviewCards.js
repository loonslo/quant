/**
 * OverviewCards概览数据容器组件
 *
 * 功能说明：
 * 1. 作为MarketOverviewCard的容器，管理多个卡片
 * 2. 集成API数据获取（从context或直接调用API）
 * 3. 实现网格布局（桌面端多列、移动端单列）
 * 4. 处理数据加载状态和错误状态
 * 5. 响应式设计，适配不同屏幕尺寸
 *
 * 数据获取流程：
 * 1. 组件挂载时获取市场概览数据
 * 2. 调用API（getMarketData）
 * 3. 数据返回后更新状态
 * 4. 渲染MarketOverviewCard组件
 *
 * 布局适配：
 * - 桌面端：4列网格（1200px+）
 * - 平板端：2列网格（768px-1200px）
 * - 移动端：1列网格（<768px）
 */

import React, { useState, useEffect } from 'react';
import { getMarketData, getMarketOverview } from '../../api/market';
import { useAppContext } from '../../context/AppContext';
import MarketOverviewCard from './MarketOverviewCard';

/**
 * 概览数据容器组件
 * @param {object} props - 组件属性
 * @param {Array<string>} props.cardTypes - 需要显示的卡片类型数组
 *   可选值：['total_market_cap', 'bitcoin_dominance', '24h_volume', 'active_coins']
 *
 * 默认显示的卡片类型：
 * 1. 总市值 (total_market_cap)
 * 2. BTC市值占比 (bitcoin_dominance)
 * 3. 24h交易量 (24h_volume)
 * 4. 活跃币种数 (active_coins)
 */
const OverviewCards = ({ cardTypes = ['total_market_cap', 'bitcoin_dominance', '24h_volume', 'active_coins'] }) => {
  // 从全局状态获取币种选择
  const { selectedCoin } = useAppContext();

  // 组件内部状态
  const [data, setData] = useState(null);        // API返回的原始数据
  const [loading, setLoading] = useState(true);  // 加载状态
  const [error, setError] = useState(null);      // 错误信息

  /**
   * 获取市场概览数据
   * v2.0：使用 getMarketOverview 获取整个市场概览数据
   */
  const fetchMarketData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('正在获取市场概览数据...');
      // v2.0接口：使用 getMarketOverview 获取整个市场概览数据
      const marketData = await getMarketOverview();
      setData(marketData);

      console.log('市场概览数据获取成功:', marketData);
    } catch (err) {
      console.error('获取市场概览数据失败:', err);
      setError(err.message || '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 组件挂载时获取数据
   */
  useEffect(() => {
    fetchMarketData();

    // 可选：设置定时刷新（每30秒）
    // const interval = setInterval(fetchMarketData, 30000);
    // return () => clearInterval(interval);
  }, [selectedCoin]); // 当选中的币种变化时重新获取

  /**
   * 渲染加载状态
   */
  const renderLoading = () => (
    <div className="overview-loading">
      <div className="loading-spinner"></div>
      <p>正在加载市场数据...</p>
    </div>
  );

  /**
   * 渲染错误状态
   */
  const renderError = () => (
    <div className="overview-error">
      <p className="error-message">❌ {error}</p>
      <button className="retry-button" onClick={fetchMarketData}>
        重新加载
      </button>
    </div>
  );

  /**
   * 计算卡片数据（v2.0适配）
   * 根据API返回的市场概览数据，计算每个卡片的显示数据
   */
  const calculateCardData = () => {
    if (!data) {
      return [];
    }

    // v2.0：直接使用API返回的市场概览数据
    // 数据格式：{ total_market_cap, total_volume_24h, btc_dominance, eth_dominance, ... }
    const totalMarketCap = data.total_market_cap || 0;
    const totalVolume = data.total_volume_24h || 0;
    const btcDominance = data.btc_dominance || 0;
    const ethDominance = data.eth_dominance || 0;
    const fearGreedValue = data.fear_greed_value || 0;
    const fearGreedClassification = data.fear_greed_classification || 'Neutral';
    const marketTrend = data.market_trend || 'neutral';
    const riskLevel = data.risk_level || 'medium';

    // 卡片数据映射
    const cardDataMap = {
      total_market_cap: {
        title: '总市值',
        value: totalMarketCap / 1e6, // 转换为百万
        change: 0, // API未提供变化百分比
        icon: '💰',
        format: 'number',
        subtitle: '单位: 百万 USD',
      },
      bitcoin_dominance: {
        title: 'BTC市值占比',
        value: btcDominance,
        change: 0,
        icon: '₿',
        format: 'percent',
        subtitle: `ETH: ${ethDominance.toFixed(2)}%`,
      },
      '24h_volume': {
        title: '24h交易量',
        value: totalVolume / 1e6, // 转换为百万
        change: 0,
        icon: '📊',
        format: 'number',
        subtitle: '单位: 百万 USD',
      },
      active_coins: {
        title: '市场恐慌度',
        value: fearGreedValue,
        change: 0,
        icon: '😱',
        format: 'number',
        subtitle: fearGreedClassification,
      },
    };

    // 根据cardTypes过滤并返回卡片数据
    return cardTypes
      .map(type => cardDataMap[type])
      .filter(Boolean); // 过滤掉undefined
  };

  /**
   * 渲染卡片列表
   */
  const renderCards = () => {
    const cardsData = calculateCardData();

    if (cardsData.length === 0) {
      return (
        <div className="overview-empty">
          <p>暂无数据可显示</p>
        </div>
      );
    }

    return (
      <div className="overview-cards-grid">
        {cardsData.map((cardData, index) => (
          <MarketOverviewCard
            key={`${cardData.title}-${index}`}
            title={cardData.title}
            value={cardData.value}
            change={cardData.change}
            icon={cardData.icon}
            format={cardData.format}
            subtitle={cardData.subtitle}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="overview-cards-container">
      {/* 容器标题 */}
      <div className="overview-header">
        <h2 className="overview-title">市场总览</h2>
        <span className="overview-subtitle">实时更新 · {new Date().toLocaleTimeString()}</span>
      </div>

      {/* 内容区域 */}
      <div className="overview-content">
        {loading && renderLoading()}
        {error && renderError()}
        {!loading && !error && renderCards()}
      </div>
    </div>
  );
};

export default OverviewCards;