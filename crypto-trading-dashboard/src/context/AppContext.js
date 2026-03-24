/**
 * 全局应用状态管理
 * 使用React Context API实现状态在组件间的共享
 * 数据流向：AppContext Provider -> 父组件 -> 子组件 -> 孙子组件...
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/tools';

// 创建Context对象
const AppContext = createContext();

/**
 * AppContextProvider组件
 * 作为全局状态提供者，向所有子组件提供状态和方法
 *
 * @param {React.ReactNode} children - 子组件
 */
export const AppContextProvider = ({ children }) => {
  /**
   * 全局状态定义
   * 所有状态更新会触发所有消费该Context的组件重新渲染
   */

  // 1. 主题状态
  // 作用：控制整个应用的外观主题（明暗模式切换）
  // 更新时机：用户点击主题切换按钮、页面初始化时从本地存储恢复
  const [theme, setTheme] = useState(() => {
    return loadFromStorage('user_theme', 'light');
  });

  // 2. 选中币种状态
  // 作用：记录用户当前查看的加密货币交易对（如 BTCUSDT、ETHUSDT）
  // 更新时机：用户从币种列表中选择、页面初始化时恢复上次选择
  const [selectedCoin, setSelectedCoin] = useState(() => {
    return loadFromStorage('selected_coin', 'BTCUSDT');
  });

  // 3. 时间维度状态
  // 作用：控制K线图表、指标图表的时间间隔显示
  // 可选值：'1h'(1小时)、'4h'(4小时)、'1d'(1天)、'1w'(1周)
  // 更新时机：用户点击时间按钮、键盘快捷键触发、页面初始化时恢复
  const [timeInterval, setTimeInterval] = useState(() => {
    return loadFromStorage('time_interval', '1h');
  });

  // 4. 市场数据状态
  // 作用：存储从API获取的市场数据，避免重复请求
  // 更新时机：页面加载时、用户切换币种时、数据过期需要刷新时
  const [marketData, setMarketData] = useState([]);

  // 5. K线数据状态
  // 作用：存储当前币种和时间的K线数据
  // 更新时机：用户切换币种或时间维度时
  const [klineData, setKlineData] = useState([]);

  // 6. 技术指标状态
  // 作用：存储计算好的技术指标数据（RSI、MACD、布林带等）
  // 更新时机：K线数据更新后自动计算、或手动刷新时
  const [indicatorData, setIndicatorData] = useState(null);

  // 7. 支撑阻力位状态
  // 作用：存储分析出的关键价格位置
  // 更新时机：K线数据更新后自动分析
  const [supportResistanceData, setSupportResistanceData] = useState(null);

  // 8. 加载状态
  // 作用：控制数据加载时的UI显示
  // 更新时机：发起API请求时设为true，请求完成或失败时设为false
  const [loading, setLoading] = useState(false);

  // 9. 错误状态
  // 作用：存储错误信息，用于错误提示和调试
  // 更新时机：API请求失败、网络异常等情况下
  const [error, setError] = useState(null);

  /**
   * 主题更新处理
   * 1. 更新theme状态
   * 2. 保存到本地存储
   * 3. 更新DOM className以应用主题样式
   */
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveToStorage('user_theme', newTheme);

    // 更新document的class以应用主题
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  };

  /**
   * 币种选择处理
   * 1. 更新selectedCoin状态
   * 2. 保存到本地存储
   * 3. 清除旧的图表数据，触发重新加载
   */
  const selectCoin = (coin) => {
    if (!coin) return;
    setSelectedCoin(coin.toUpperCase());
    saveToStorage('selected_coin', coin.toUpperCase());

    // 清除旧的图表数据，避免数据显示混乱
    setKlineData([]);
    setIndicatorData(null);
    setSupportResistanceData(null);
  };

  /**
   * 时间维度选择处理
   * 1. 更新timeInterval状态
   * 2. 保存到本地存储
   * 3. 触发K线数据和指标数据重新加载
   */
  const selectTimeInterval = (interval) => {
    if (!interval) return;
    setTimeInterval(interval);
    saveToStorage('time_interval', interval);

    // 清除相关数据，触发重新加载
    setKlineData([]);
    setIndicatorData(null);
  };

  /**
   * 清除错误状态
   * 手动清除当前错误，常用于用户关闭错误提示后
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * 初始化主题
   * 页面加载时根据保存的主题设置DOM class
   */
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, []); // 空依赖数组，只在组件挂载时执行一次

  /**
   * Context对象值
   * 将状态和方法暴露给子组件
   * 注意：使用useMemo优化，避免不必要的重渲染
   */
  const contextValue = {
    // 状态
    theme,
    selectedCoin,
    timeInterval,
    marketData,
    klineData,
    indicatorData,
    supportResistanceData,
    loading,
    error,

    // 状态更新方法
    setMarketData,
    setKlineData,
    setIndicatorData,
    setSupportResistanceData,
    setLoading,
    setError,

    // 用户交互方法
    toggleTheme,
    selectCoin,
    selectTimeInterval,
    clearError,
  };

  /**
   * 数据流向说明：
   * Provider(根) -> App组件 -> Layout组件 -> 具体页面组件 -> 图表组件
   *
   * 子组件访问状态：
   * const { theme, selectedCoin, ... } = useAppContext();
   */
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * 自定义Hook：useAppContext
 * 简化子组件访问Context的代码
 * 使用示例：
 *   const { theme, selectedCoin, toggleTheme } = useAppContext();
 */
export const useAppContext = () => {
  const context = useContext(AppContext);

  // 防护检查：确保在Provider内部使用
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }

  return context;
};

export default AppContext;