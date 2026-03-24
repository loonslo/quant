/**
 * 应用主组件
 * 全局状态管理和路由入口
 */

import React from 'react';
import { AppContextProvider } from './context/AppContext';
import Layout from './components/common/Layout';
import './styles/main.css';
import './App.css';

/**
 * App主组件
 * 职责：
 * 1. 包装Context Provider，提供全局状态
 * 2. 提供应用的主要布局结构
 * 3. 全局错误边界（待实现）
 *
 * 状态流向：
 * AppContextProvider -> App -> Layout -> 各页面组件
 */
function App() {
  return (
    // AppContextProvider：提供全局状态管理
    // 包装整个应用，使所有子组件都能访问全局状态
    <AppContextProvider>
      {/* 应用主体布局 */}
      <div className="App">
        <Layout />
      </div>
    </AppContextProvider>
  );
}

export default App;
