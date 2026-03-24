/**
 * Layout布局组件
 * 应用的主要布局容器，负责组织页面结构
 *
 * 布局结构：
 * <div className="layout">
 *   <Header />         // 顶部导航栏
 *   <main className="main-content">  // 主内容区域
 *     <TimeButton />   // 时间选择按钮
 *     <OverviewCards /> // 市场概览卡片
 *     <KLineChartContainer /> // K线图表
 *     <TechnicalIndicators /> // 技术指标
 *     {children}       // 页面内容（来自App.js）
 *   </main>
 * </div>
 *
 * 组件说明：
 * 1. 这个组件是干什么的：提供应用的基础布局框架
 * 2. 布局怎么设计的：采用经典的三段式布局（顶部栏 + 主内容区）
 * 3. 响应式适配：支持移动端、平板、桌面端
 * 4. 可扩展性：为不同页面预留了children插槽
 */

import React from 'react';
import Header from './Header';
import OverviewCards from '../market/OverviewCards';
import KLineChartContainer from '../charts/KLineChartContainer';
import TechnicalIndicators from '../indicators/TechnicalIndicators';
import { useAppContext } from '../../context/AppContext';

/**
 * Layout主组件
 * @param {React.ReactNode} children - 子组件内容
 *
 * 使用说明：
 * 在App.js中，我们通过<Layout />引用它，此时children为空
 * 如果需要传内容给Layout，可以这样用：
 * <Layout>
 *   <YourComponent />
 * </Layout>
 *
 * 布局适配说明：
 * - 桌面端 (>1200px): 多列布局，固定侧边栏，充足的内边距
 * - 平板端 (768px-1200px): 自适应布局，收缩边距
 * - 移动端 (<768px): 单列布局，紧凑间距，全宽显示
 */
const Layout = ({ children }) => {
  // 从全局状态获取当前时间间隔
  const { timeInterval, selectedCoin } = useAppContext();

  return (
    <div className="layout">
      {/* 顶部导航栏 */}
      <Header />

      {/* 主内容区域 */}
      <main className="main-content">
        {/* 市场概览卡片 - 显示实时市场数据 */}
        <OverviewCards />

        {/* K线图表容器 - 显示当前币种的K线图 */}
        <KLineChartContainer
          symbol={selectedCoin}
          showTimeSelector={true}  // 显示时间范围筛选器和币种切换按钮
          height={500}
        />

        {/* 技术指标 - 显示RSI、MACD、布林带、移动平均线等 */}
        <TechnicalIndicators
          symbol={selectedCoin}
          interval={timeInterval}
          activeIndicators={['rsi', 'macd']}
          layoutMode="multi"
        />

        {/* 页面内容 */}
        {children || (
          <div className="welcome-message">
            <h2>欢迎使用加密货币交易仪表板</h2>
            <p>使用顶部的时间按钮切换图表时间维度，或按键盘数字键1、2、3、4快速切换</p>
            <div className="feature-hints">
              <div className="hint-item">
                <span className="hint-label">1 小时</span>
                <span className="hint-desc">短期趋势分析</span>
              </div>
              <div className="hint-item">
                <span className="hint-label">4 小时</span>
                <span className="hint-desc">中期走势判断</span>
              </div>
              <div className="hint-item">
                <span className="hint-label">1 天</span>
                <span className="hint-desc">长期趋势研判</span>
              </div>
              <div className="hint-item">
                <span className="hint-label">1 周</span>
                <span className="hint-desc">超长周期分析</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 页脚（可选） */}
      <footer className="footer">
        <p>&copy; 2025 加密货币交易仪表板. 仅供学习使用.</p>
      </footer>
    </div>
  );
};

export default Layout;