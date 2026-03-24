/**
 * DateRangePicker日期范围选择器组件
 *
 * 功能说明：
 * 1. 提供用户友好的日期范围选择界面
 * 2. 支持预设时间范围（最近7天、30天、90天、1年）
 * 3. 支持自定义开始和结束日期
 * 4. 数据验证和错误处理
 * 5. 响应式设计，适配移动端
 *
 * 使用场景：
 * - 趋势图表时间范围筛选
 * - 市场数据查询
 * - 自定义时间段分析
 *
 * 预设时间范围：
 * - 7天：适合短期趋势分析
 * - 30天：适合月度趋势分析
 * - 90天：适合季度趋势分析
 * - 1年：适合年度趋势分析
 * - 自定义：完全自主选择时间范围
 *
 * 使用示例：
 * <DateRangePicker
 *   startDate="2025-01-01"
 *   endDate="2025-11-03"
 *   onChange={(start, end) => {}}
 *   onApply={(start, end) => {}}
 * />
 */

import React, { useState } from 'react';

/**
 * 日期范围选择器组件
 * @param {object} props - 组件属性
 * @param {string} props.startDate - 初始开始日期（YYYY-MM-DD格式）
 * @param {string} props.endDate - 初始结束日期（YYYY-MM-DD格式）
 * @param {function} props.onChange - 日期变化回调函数（实时更新）
 * @param {function} props.onApply - 应用日期回调函数（点击确定时触发）
 * @param {number} props.maxDateRange - 最大日期范围（天数），默认365天
 */
const DateRangePicker = ({
  startDate = '',
  endDate = '',
  onChange,
  onApply,
  maxDateRange = 365,
}) => {
  // 内部状态管理
  const [selectedStart, setSelectedStart] = useState(startDate);
  const [selectedEnd, setSelectedEnd] = useState(endDate);
  const [error, setError] = useState('');

  /**
   * 预设时间范围选项
   */
  const presetRanges = [
    { label: '最近7天', days: 7 },
    { label: '最近30天', days: 30 },
    { label: '最近90天', days: 90 },
    { label: '最近1年', days: 365 },
  ];

  /**
   * 获取今天的日期（YYYY-MM-DD格式）
   */
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  /**
   * 获取指定天数前的日期
   * @param {number} days - 天数
   * @returns {string} YYYY-MM-DD格式的日期字符串
   */
  const getDateBeforeDays = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  };

  /**
   * 验证日期范围
   * @param {string} start - 开始日期
   * @param {string} end - 结束日期
   * @returns {string|null} 错误信息，验证通过返回null
   */
  const validateDateRange = (start, end) => {
    if (!start || !end) {
      return '请选择开始和结束日期';
    }

    if (start > end) {
      return '开始日期不能大于结束日期';
    }

    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const diffTime = Math.abs(endDateObj - startDateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > maxDateRange) {
      return `日期范围不能超过${maxDateRange}天`;
    }

    return null;
  };

  /**
   * 处理开始日期变化
   * @param {string} newStart - 新的开始日期
   */
  const handleStartChange = (newStart) => {
    setSelectedStart(newStart);

    // 验证日期范围
    const errorMsg = validateDateRange(newStart, selectedEnd);
    setError(errorMsg);

    // 通知父组件
    if (onChange && !errorMsg) {
      onChange(newStart, selectedEnd);
    }
  };

  /**
   * 处理结束日期变化
   * @param {string} newEnd - 新的结束日期
   */
  const handleEndChange = (newEnd) => {
    setSelectedEnd(newEnd);

    // 验证日期范围
    const errorMsg = validateDateRange(selectedStart, newEnd);
    setError(errorMsg);

    // 通知父组件
    if (onChange && !errorMsg) {
      onChange(selectedStart, newEnd);
    }
  };

  /**
   * 选择预设日期范围
   * @param {number} days - 天数
   */
  const handlePresetSelect = (days) => {
    const end = getToday();
    const start = getDateBeforeDays(days);

    setSelectedStart(start);
    setSelectedEnd(end);
    setError('');

    // 通知父组件
    if (onChange) {
      onChange(start, end);
    }
  };

  /**
   * 应用当前选择的日期范围
   */
  const handleApply = () => {
    const errorMsg = validateDateRange(selectedStart, selectedEnd);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    if (onApply) {
      onApply(selectedStart, selectedEnd);
    }
  };

  return (
    <div className="date-range-picker">
      <h4 className="picker-title">选择时间范围</h4>

      {/* 预设范围选择器 */}
      <div className="preset-ranges">
        {presetRanges.map((preset) => (
          <button
            key={preset.days}
            className="preset-button"
            onClick={() => handlePresetSelect(preset.days)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* 自定义日期选择 */}
      <div className="custom-range">
        <div className="date-input-group">
          <label className="date-label">开始日期:</label>
          <input
            type="date"
            className="date-input"
            value={selectedStart}
            onChange={(e) => handleStartChange(e.target.value)}
            max={getToday()}
          />
        </div>

        <div className="date-input-group">
          <label className="date-label">结束日期:</label>
          <input
            type="date"
            className="date-input"
            value={selectedEnd}
            onChange={(e) => handleEndChange(e.target.value)}
            max={getToday()}
          />
        </div>
      </div>

      {/* 错误信息 */}
      {error && <div className="error-message">{error}</div>}

      {/* 应用按钮 */}
      <div className="picker-actions">
        <button
          className="apply-button"
          onClick={handleApply}
          disabled={!!error}
        >
          应用
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;