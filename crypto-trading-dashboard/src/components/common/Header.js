/**
 * Header头部组件
 * 负责显示应用标题、主题切换、币种选择等功能
 * 布局设计：顶部固定栏，左侧标题，右侧操作按钮
 */

import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import {
  SiBitcoin,
  SiEthereum,
  SiBinance,
  SiCardano,
  SiSolana,
  SiRipple,
  SiPolkadot,
  SiDogecoin,
} from 'react-icons/si';

/**
 * Header组件
 * 职责：
 * 1. 显示应用标题和Logo
 * 2. 提供主题切换功能
 * 3. 提供币种选择器功能
 * 4. 响应式设计，移动端优化显示
 *
 * 布局说明：
 * - 桌面端：水平布局，标题在左，操作区在右
 * - 移动端：垂直布局，标题在上，操作区在下，间距紧凑
 * - 固定在页面顶部，不随滚动消失
 */
const Header = () => {
  // 从全局状态获取主题和选中币种
  const { theme, selectedCoin, toggleTheme, selectCoin } = useAppContext();

  // 币种选择器下拉菜单状态
  const [isCoinDropdownOpen, setIsCoinDropdownOpen] = useState(false);

  // 可选择的币种列表 - 使用react-icons图标库
  const availableCoins = [
    { symbol: 'BTCUSDT', name: 'Bitcoin', icon: SiBitcoin },
    { symbol: 'ETHUSDT', name: 'Ethereum', icon: SiEthereum },
    { symbol: 'BNBUSDT', name: 'BNB', icon: SiBinance },
    { symbol: 'ADAUSDT', name: 'Cardano', icon: SiCardano },
    { symbol: 'SOLUSDT', name: 'Solana', icon: SiSolana },
    { symbol: 'XRPUSDT', name: 'Ripple', icon: SiRipple },
    { symbol: 'DOTUSDT', name: 'Polkadot', icon: SiPolkadot },
    { symbol: 'DOGEUSDT', name: 'Dogecoin', icon: SiDogecoin },
  ];

  /**
   * 处理币种选择
   * @param {string} coin - 选中的币种符号
   */
  const handleCoinSelect = (coin) => {
    if (coin !== selectedCoin) {
      selectCoin(coin);
      console.log(`币种切换到: ${coin}`);
    }
    setIsCoinDropdownOpen(false); // 关闭下拉菜单
  };

  /**
   * 切换币种选择器下拉菜单
   */
  const toggleCoinDropdown = () => {
    setIsCoinDropdownOpen(!isCoinDropdownOpen);
  };

  /**
   * 获取当前选中的币种信息
   */
  const getCurrentCoinInfo = () => {
    return availableCoins.find(coin => coin.symbol === selectedCoin) || availableCoins[0];
  };

  const currentCoin = getCurrentCoinInfo();

  return (
    <header className="header">
      {/* 左侧：应用标题和Logo */}
      <div className="header-left">
        <h1 className="app-title">
          {/* 应用图标 - 可替换为实际Logo */}
          <span className="app-icon">₿</span>
          {/* 应用标题 */}
          <span className="title-text">加密货币交易仪表板</span>
        </h1>
      </div>

      {/* 右侧：操作按钮区域 */}
      <div className="header-right">
        {/* 币种选择器 */}
        <div className="coin-selector-wrapper">
          <button
            className="coin-selector-button"
            onClick={toggleCoinDropdown}
            aria-label="选择币种"
            title="点击选择币种"
          >
            <span className="coin-info">
              <span><currentCoin.icon size={20} /></span>
              <span className="coin-symbol">{selectedCoin}</span>
            </span>
            <span className={`dropdown-arrow ${isCoinDropdownOpen ? 'open' : ''}`}>
              ▼
            </span>
          </button>

          {/* 币种下拉菜单 */}
          {isCoinDropdownOpen && (
            <div className="coin-dropdown-menu">
              {availableCoins.map((coin) => (
                <button
                  key={coin.symbol}
                  className={`coin-option ${coin.symbol === selectedCoin ? 'selected' : ''}`}
                  onClick={() => handleCoinSelect(coin.symbol)}
                >
                  <span className="option-icon"><coin.icon size={20} /></span>
                  <span className="option-symbol">{coin.symbol}</span>
                  <span className="option-name">{coin.name}</span>
                  {coin.symbol === selectedCoin && <span className="check-mark">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 主题切换按钮 */}
        <button
          className={`theme-toggle ${theme}`}
          onClick={toggleTheme}
          aria-label={`切换到${theme === 'light' ? '深色' : '浅色'}主题`}
          title={`当前: ${theme === 'light' ? '浅色' : '深色'}主题，点击切换`}
        >
          {/* 主题图标：根据当前主题显示不同图标 */}
          {theme === 'light' ? (
            <span className="icon">🌙</span>  // 浅色主题显示月亮图标
          ) : (
            <span className="icon">☀️</span>  // 深色主题显示太阳图标
          )}
          <span className="toggle-text">
            {theme === 'light' ? '深色模式' : '浅色模式'}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;