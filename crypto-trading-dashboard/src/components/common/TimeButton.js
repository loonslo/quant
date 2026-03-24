/**
 * TimeButton时间选择按钮组件
 *
 * 功能和怎么使用：
 * 1. 作用：提供一个可交互的时间维度选择器，用于切换K线图表的时间周期
 * 2. 使用方法：在父组件中引入并传入相关props即可
 *
 * 键盘快捷键支持：
 * - 数字键 1：1小时 (1h)
 * - 数字键 2：4小时 (4h)
 * - 数字键 3：1天 (1d)
 * - 数字键 4：1周 (1w)
 *
 * 使用示例：
 * <TimeButton
 *   currentInterval="1h"
 *   onIntervalChange={(interval) => setTimeInterval(interval)}
 * />
 *
 * 按钮样式说明：
 * 1. 默认状态：浅色背景，边框圆角，文字为灰色
 * 2. 悬停状态：背景色变深，边框颜色变为主色
 * 3. 选中状态：背景使用主色（蓝色），文字变为白色，有明显的阴影效果
 * 4. 高亮效果通过CSS的:hover和:focus状态实现，背景和边框颜色平滑过渡
 */

import React, { useEffect, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';

/**
 * 时间选择按钮组件
 * @param {object} props - 组件属性
 * @param {string} props.currentInterval - 当前选中的时间间隔
 * @param {function} props.onIntervalChange - 时间间隔变化回调函数
 *
 * 时间间隔选项：
 * - '1h': 1小时
 * - '4h': 4小时
 * - '1d': 1天
 * - '1w': 1周
 */
const TimeButton = ({ currentInterval, onIntervalChange }) => {
  // 从全局状态获取选择时间间隔的方法
  const { selectTimeInterval } = useAppContext();

  /**
   * 处理时间间隔选择
   * @param {string} interval - 新的时间间隔
   */
  const handleIntervalChange = useCallback((interval) => {
    // 调用父组件传入的回调
    if (onIntervalChange) {
      onIntervalChange(interval);
    }

    // 同时更新全局状态
    selectTimeInterval(interval);

    console.log('时间间隔切换到:', interval);
  }, [onIntervalChange, selectTimeInterval]);

  /**
   * 键盘快捷键处理
   * 当用户按下数字键1、2、3、4时，自动切换到对应的时间间隔
   */
  useEffect(() => {
    /**
     * 键盘事件处理函数
     * @param {KeyboardEvent} event - 键盘事件对象
     */
    const handleKeyPress = (event) => {
      // 如果用户正在输入框中输入，忽略快捷键
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      // 键位映射：数字键 -> 时间间隔
      const keyMap = {
        '1': '1h',  // 数字1 -> 1小时
        '2': '4h',  // 数字2 -> 4小时
        '3': '1d',  // 数字3 -> 1天
        '4': '1w',  // 数字4 -> 1周
      };

      const newInterval = keyMap[event.key];
      if (newInterval && newInterval !== currentInterval) {
        event.preventDefault();  // 阻止默认行为
        handleIntervalChange(newInterval);
      }
    };

    // 添加键盘事件监听器
    window.addEventListener('keydown', handleKeyPress);

    // 组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentInterval, handleIntervalChange]);

  /**
   * 时间选项配置
   * 每个选项包含：值、标签、键盘快捷键说明
   */
  const timeOptions = [
    {
      value: '1h',
      label: '1小时',
      keyHint: '按 1',
    },
    {
      value: '4h',
      label: '4小时',
      keyHint: '按 2',
    },
    {
      value: '1d',
      label: '1天',
      keyHint: '按 3',
    },
    {
      value: '1w',
      label: '1周',
      keyHint: '按 4',
    },
  ];

  return (
    <div className="time-button-group">
      {/* 标题区域 */}
      <div className="time-button-title">
        <span className="title-text">时间维度</span>
        <span className="key-hint">快捷键：1、2、3、4</span>
      </div>

      {/* 按钮组容器 */}
      <div className="button-group">
        {/* 遍历时间选项，渲染每个按钮 */}
        {timeOptions.map((option) => {
          const isActive = currentInterval === option.value;

          return (
            <button
              key={option.value}
              className={`time-button ${isActive ? 'active' : ''}`}
              onClick={() => handleIntervalChange(option.value)}
              aria-label={`切换到${option.label} (${option.keyHint})`}
              title={`${option.label} - ${option.keyHint}`}
            >
              {/* 按钮文字 */}
              <span className="button-label">{option.label}</span>

              {/* 快捷键提示（仅在非移动端显示） */}
              <span className="key-hint-small">{option.keyHint}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeButton;