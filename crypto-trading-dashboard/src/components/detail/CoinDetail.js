/**
 * CoinDetail币种详情页面组件（v2.0适配）
 *
 * 功能说明：
 * 1. 展示特定币种的完整详情页面
 * 2. 包含币种信息卡片
 * 3. 详细的K线图表展示
 * 4. 完整的技术指标展示（v2.0新增EMA指标）
 * 5. 返回导航功能
 *
 * 页面结构：
 * <div className="coin-detail-page">
 *   <div className="detail-header">
 *     <button onClick={handleBack}>返回</button>
 *     <h1>币种详情</h1>
 *   </div>
 *   <CoinInfoCard />           // 币种信息
 *   <KLineChartContainer />    // 详细K线图
 *   <TechnicalIndicators />    // 技术指标（含EMA）
 * </div>
 *
 * 使用示例：
 * <CoinDetail
 *   symbol="BTCUSDT"
 *   onBack={() => setShowDetail(false)}
 * />
 */

import React, { useState, useEffect } from 'react';
import { getMarketData } from '../../api/market';
import { useAppContext } from '../../context/AppContext';
import CoinInfoCard from './CoinInfoCard';
import KLineChartContainer from '../charts/KLineChartContainer';
import TechnicalIndicators from '../indicators/TechnicalIndicators';
import TrendChartContainer from '../charts/TrendChartContainer';

/**
 * 币种详情页面组件（v2.0适配）
 * @param {object} props - 组件属性
 * @param {string} props.symbol - 币种符号（v2.0需使用USDT后缀格式）
 * @param {function} props.onBack - 返回回调函数
 */
const CoinDetail = ({
  symbol = 'BTCUSDT', // v2.0需使用USDT后缀格式
  onBack,
}) => {
  const { selectedCoin } = useAppContext();

  // 使用传入的symbol或全局选中的币种
  const currentSymbol = symbol || selectedCoin;

  // 组件内部状态
  const [coinData, setCoinData] = useState(null);     // 币种数据
  const [loading, setLoading] = useState(true);       // 加载状态
  const [error, setError] = useState(null);           // 错误信息
  const [activeTab, setActiveTab] = useState('chart'); // 当前标签页

  /**
   * 获取币种详情数据
   */
  const fetchCoinDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`正在获取币种详情: ${currentSymbol}`);
      // v2.0接口：getMarketData接受币种符号数组
      const data = await getMarketData([currentSymbol]);
      setCoinData(Array.isArray(data) ? data[0] : data);
      console.log('币种详情获取成功:', data);
    } catch (err) {
      console.error('获取币种详情失败:', err);
      setError(err.message || '获取币种详情失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 组件挂载时获取数据
   */
  useEffect(() => {
    fetchCoinDetail();
  }, [currentSymbol]);

  /**
   * 处理返回按钮点击
   */
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      console.log('返回上一页');
    }
  };

  /**
   * 标签页配置
   */
  const tabs = [
    { key: 'chart', label: 'K线图表' },
    { key: 'indicators', label: '技术指标' },
    { key: 'trend', label: '趋势分析' },
  ];

  /**
   * 渲染加载状态
   */
  const renderLoading = () => (
    <div className="detail-loading">
      <div className="loading-spinner"></div>
      <p className="loading-text">正在加载币种详情...</p>
    </div>
  );

  /**
   * 渲染错误状态
   */
  const renderError = () => (
    <div className="detail-error">
      <p className="error-message">❌ {error}</p>
      <button className="retry-button" onClick={fetchCoinDetail}>
        重新加载
      </button>
    </div>
  );

  return (
    <div className="coin-detail-page">
      {/* 页面头部 */}
      <div className="detail-header">
        <button className="back-button" onClick={handleBack}>
          ← 返回
        </button>
        <h1 className="page-title">{currentSymbol} 详情</h1>
        <div className="header-placeholder"></div>
      </div>

      {/* 主要内容区域 */}
      <div className="detail-content">
        {loading && renderLoading()}
        {error && renderError()}

        {!loading && !error && (
          <>
            {/* 币种信息卡片 */}
            <div className="detail-section">
              <CoinInfoCard coin={coinData} />
            </div>

            {/* 标签页导航 */}
            <div className="detail-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 标签页内容 */}
            <div className="tab-content">
              {activeTab === 'chart' && (
                <KLineChartContainer
                  symbol={currentSymbol}
                  showTimeSelector={true}
                  height={500}
                />
              )}

              {activeTab === 'indicators' && (
                <TechnicalIndicators
                  symbol={currentSymbol}
                  interval="1h"
                  activeIndicators={['rsi', 'macd', 'bollinger', 'ma', 'ema']} // v2.0新增ema
                  layoutMode="multi"
                />
              )}

              {activeTab === 'trend' && (
                <TrendChartContainer
                  availableCoins={[currentSymbol, 'BTCUSDT', 'ETHUSDT']} // v2.0需使用USDT后缀格式
                  defaultCoins={[currentSymbol]}
                  height={400}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CoinDetail;