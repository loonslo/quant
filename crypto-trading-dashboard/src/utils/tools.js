/**
 * 文件名: tools.js
 * 功能: 工具函数集合，包含数字格式化、时间格式化、价格颜色等功能
 * 作者: 开发者
 * 创建时间: 2024-01-01
 * 说明: 为交易仪表板提供通用的格式化和显示工具函数
 */

/**
 * 格式化数字，添加千分位分隔符
 * @param {number} num - 需要格式化的数字
 * @param {number} decimals - 保留的小数位数，默认为2位
 * @returns {string} 格式化后的数字字符串，如 "1,234.56"
 * 
 * 使用示例:
 * formatNumber(1234.567) => "1,234.57"
 * formatNumber(1234567, 0) => "1,234,567"
 * formatNumber(0.123456, 4) => "0.1235"
 */
export function formatNumber(num, decimals = 2) {
  // 检查输入是否为有效数字
  if (typeof num !== 'number' || isNaN(num)) {
    return '0.00';
  }
  
  // 使用toLocaleString格式化数字，添加千分位分隔符
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * 格式化价格数字，专门用于显示加密货币价格
 * @param {number} price - 原始价格数字
 * @param {number} decimals - 保留小数位数，默认2位
 * @returns {string} 格式化后的价格字符串，如 "$47,123.45"
 * 
 * 使用示例:
 * formatPrice(47123.456) => "$47,123.46"
 * formatPrice(0.00123456, 6) => "$0.001235"
 */
export function formatPrice(price, decimals = 2) {
  // 检查输入是否为有效数字
  if (typeof price !== 'number' || isNaN(price)) {
    return '$0.00';
  }
  
  // 对于小于1的价格，自动增加小数位数以显示有意义的数字
  if (price < 1 && price > 0 && decimals === 2) {
    decimals = 6;
  }
  
  // 格式化价格并添加美元符号
  const formattedPrice = formatNumber(price, decimals);
  return `$${formattedPrice}`;
}

/**
 * 格式化百分比数字
 * @param {number} percent - 百分比数字（如 5.25 表示 5.25%）
 * @param {number} decimals - 保留小数位数，默认2位
 * @returns {string} 格式化后的百分比字符串，如 "+5.25%" 或 "-2.10%"
 * 
 * 使用示例:
 * formatPercent(5.25) => "+5.25%"
 * formatPercent(-2.1) => "-2.10%"
 * formatPercent(0) => "0.00%"
 */
export function formatPercent(percent, decimals = 2) {
  // 检查输入是否为有效数字
  if (typeof percent !== 'number' || isNaN(percent)) {
    return '0.00%';
  }
  
  // 格式化数字
  const formattedNum = Math.abs(percent).toFixed(decimals);
  
  // 添加正负号和百分号
  if (percent > 0) {
    return `+${formattedNum}%`;
  } else if (percent < 0) {
    return `-${formattedNum}%`;
  } else {
    return `${formattedNum}%`;
  }
}

/**
 * 将时间戳转换为易读的时间格式
 * @param {number} timestamp - 时间戳（毫秒）
 * @param {string} format - 时间格式类型，可选值: 'full', 'date', 'time', 'short'
 * @returns {string} 格式化后的时间字符串
 * 
 * 格式说明:
 * - 'full': "2024年1月15日 14:30:25" (完整日期时间)
 * - 'date': "2024年1月15日" (仅日期)
 * - 'time': "14:30:25" (仅时间)
 * - 'short': "01-15 14:30" (简短格式)
 * 
 * 使用示例:
 * formatTime(1640995200000, 'full') => "2024年1月1日 08:00:00"
 * formatTime(1640995200000, 'date') => "2024年1月1日"
 * formatTime(1640995200000, 'time') => "08:00:00"
 * formatTime(1640995200000, 'short') => "01-01 08:00"
 */
export function formatTime(timestamp, format = 'full') {
  // 检查输入是否为有效时间戳
  if (typeof timestamp !== 'number' || timestamp <= 0) {
    return '无效时间';
  }
  
  // 创建Date对象
  const date = new Date(timestamp);
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return '无效时间';
  }
  
  // 根据格式类型返回相应的时间字符串
  switch (format) {
    case 'full':
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    
    case 'date':
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    
    case 'time':
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    
    case 'short':
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const minute = String(date.getMinutes()).padStart(2, '0');
      return `${month}-${day} ${hour}:${minute}`;
    
    default:
      return date.toLocaleString('zh-CN');
  }
}

/**
 * 根据价格变化返回对应的颜色类名
 * @param {number} change - 价格变化值或变化百分比
 * @param {string} type - 返回类型，'class' 返回CSS类名，'color' 返回颜色值
 * @returns {string} CSS类名或颜色值
 * 
 * 颜色规则:
 * - 上涨（正数）: 绿色 (#52c41a)
 * - 下跌（负数）: 红色 (#ff4d4f) 
 * - 无变化（0）: 灰色 (#666666)
 * 
 * 使用示例:
 * getPriceColor(5.25, 'class') => 'price-up'
 * getPriceColor(-2.1, 'class') => 'price-down'
 * getPriceColor(0, 'class') => 'price-neutral'
 * getPriceColor(5.25, 'color') => '#52c41a'
 */
export function getPriceColor(change, type = 'class') {
  // 检查输入是否为有效数字
  if (typeof change !== 'number' || isNaN(change)) {
    return type === 'class' ? 'price-neutral' : '#666666';
  }
  
  // 根据变化值确定颜色
  if (change > 0) {
    // 上涨 - 绿色
    return type === 'class' ? 'price-up' : '#52c41a';
  } else if (change < 0) {
    // 下跌 - 红色
    return type === 'class' ? 'price-down' : '#ff4d4f';
  } else {
    // 无变化 - 灰色
    return type === 'class' ? 'price-neutral' : '#666666';
  }
}

/**
 * 获取价格变化的趋势图标
 * @param {number} change - 价格变化值
 * @returns {string} 趋势图标字符
 * 
 * 图标说明:
 * - 上涨: ↗ 
 * - 下跌: ↘
 * - 无变化: →
 * 
 * 使用示例:
 * getPriceTrend(5.25) => '↗'
 * getPriceTrend(-2.1) => '↘'
 * getPriceTrend(0) => '→'
 */
export function getPriceTrend(change) {
  // 检查输入是否为有效数字
  if (typeof change !== 'number' || isNaN(change)) {
    return '→';
  }
  
  if (change > 0) {
    return '↗';  // 上涨箭头
  } else if (change < 0) {
    return '↘';  // 下跌箭头
  } else {
    return '→';  // 平行箭头
  }
}

/**
 * 格式化交易量，自动选择合适的单位（K, M, B）
 * @param {number} volume - 交易量数字
 * @param {number} decimals - 保留小数位数，默认1位
 * @returns {string} 格式化后的交易量字符串
 *
 * 单位说明:
 * - K: 千 (1,000)
 * - M: 百万 (1,000,000)
 * - B: 十亿 (1,000,000,000)
 *
 * 使用示例:
 * formatVolume(1234) => "1.2K"
 * formatVolume(1234567) => "1.2M"
 * formatVolume(1234567890) => "1.2B"
 */
export function formatVolume(volume, decimals = 1) {
  // 检查输入是否为有效数字
  if (typeof volume !== 'number' || isNaN(volume) || volume < 0) {
    return '0';
  }

  // 根据数值大小选择合适的单位
  if (volume >= 1000000000) {
    // 十亿以上用B
    return (volume / 1000000000).toFixed(decimals) + 'B';
  } else if (volume >= 1000000) {
    // 百万以上用M
    return (volume / 1000000).toFixed(decimals) + 'M';
  } else if (volume >= 1000) {
    // 千以上用K
    return (volume / 1000).toFixed(decimals) + 'K';
  } else {
    // 小于千直接显示
    return volume.toFixed(decimals);
  }
}

/**
 * 保存数据到浏览器本地存储
 * @param {string} key - 存储键名，用于标识存储的数据项
 * @param {any} value - 要存储的值（可以是任意类型）
 * @param {number} expireTime - 过期时间（毫秒），可选，默认无过期时间
 *
 * 数据格式说明:
 * - 所有数据会以JSON字符串格式存储在localStorage中
 * - 存储格式: { data: value, timestamp: saveTime, expire: expireTime }
 * - timestamp: 保存时的时间戳，用于判断数据是否过期
 * - expire: 可选的过期时间（毫秒），超过这个时间数据将被视为无效
 *
 * 使用示例:
 * saveToStorage('user_theme', 'dark');  // 存储主题偏好
 * saveToStorage('selected_coin', 'BTCUSDT', 24*60*60*1000);  // 存储币种选择，24小时过期
 */
export function saveToStorage(key, value, expireTime = null) {
  try {
    // 检查浏览器是否支持localStorage
    if (typeof Storage === 'undefined') {
      console.warn('浏览器不支持localStorage，数据不会持久化保存');
      return false;
    }

    // 检查键名是否有效
    if (!key || typeof key !== 'string') {
      console.error('存储键名无效:', key);
      return false;
    }

    // 构建存储对象
    const storageData = {
      data: value,           // 实际存储的数据
      timestamp: Date.now(), // 保存时的时间戳
      expire: expireTime,    // 过期时间（可为null表示永不过期）
    };

    // 转换为JSON字符串并存储
    const dataString = JSON.stringify(storageData);
    localStorage.setItem(`crypto_dashboard_${key}`, dataString);

    console.log(`数据已保存: ${key} =`, value);
    return true;
  } catch (error) {
    console.error('保存数据失败:', error);
    return false;
  }
}

/**
 * 从浏览器本地存储读取数据
 * @param {string} key - 存储键名
 * @param {any} defaultValue - 默认值，当数据不存在或过期时返回此值
 * @returns {any} 存储的数据或默认值
 *
 * 读取逻辑说明:
 * 1. 从localStorage获取JSON字符串
 * 2. 解析为对象格式: { data, timestamp, expire }
 * 3. 检查数据是否过期
 * 4. 返回data字段的值，或返回defaultValue
 *
 * 存储数据格式:
 * {
 *   data: any,        // 实际存储的数据
 *   timestamp: number, // 保存时间戳
 *   expire: number|null // 过期时间（毫秒）
 * }
 *
 * 使用示例:
 * const theme = loadFromStorage('user_theme', 'light');  // 读取主题，默认为light
 * const coin = loadFromStorage('selected_coin', 'BTCUSDT');  // 读取币种，默认为BTCUSDT
 * const settings = loadFromStorage('user_settings', {});  // 读取设置，默认为空对象
 */
export function loadFromStorage(key, defaultValue = null) {
  try {
    // 检查浏览器是否支持localStorage
    if (typeof Storage === 'undefined') {
      console.warn('浏览器不支持localStorage，使用默认值:', defaultValue);
      return defaultValue;
    }

    // 检查键名是否有效
    if (!key || typeof key !== 'string') {
      console.error('存储键名无效:', key);
      return defaultValue;
    }

    // 从localStorage获取数据
    const dataString = localStorage.getItem(`crypto_dashboard_${key}`);

    // 如果数据不存在，返回默认值
    if (!dataString) {
      console.log(`数据不存在: ${key}，使用默认值:`, defaultValue);
      return defaultValue;
    }

    // 解析JSON字符串
    let storageData;
    try {
      storageData = JSON.parse(dataString);
    } catch (parseError) {
      console.error('解析存储数据失败:', parseError);
      return defaultValue;
    }

    // 检查数据格式是否正确
    if (!storageData || typeof storageData !== 'object') {
      console.error('存储数据格式错误:', storageData);
      return defaultValue;
    }

    // 检查数据是否过期
    if (storageData.expire && storageData.timestamp) {
      const currentTime = Date.now();
      const expireTime = storageData.timestamp + storageData.expire;

      if (currentTime > expireTime) {
        // 数据已过期，删除并返回默认值
        console.log(`数据已过期: ${key}`);
        removeFromStorage(key);
        return defaultValue;
      }
    }

    // 返回存储的数据
    console.log(`数据读取成功: ${key} =`, storageData.data);
    return storageData.data;
  } catch (error) {
    console.error('读取数据失败:', error);
    return defaultValue;
  }
}

/**
 * 从浏览器本地存储删除数据
 * @param {string} key - 存储键名
 * @returns {boolean} 删除是否成功
 *
 * 使用示例:
 * removeFromStorage('user_theme');  // 删除主题设置
 * removeFromStorage('selected_coin');  // 删除币种选择
 */
export function removeFromStorage(key) {
  try {
    // 检查浏览器是否支持localStorage
    if (typeof Storage === 'undefined') {
      console.warn('浏览器不支持localStorage');
      return false;
    }

    // 检查键名是否有效
    if (!key || typeof key !== 'string') {
      console.error('存储键名无效:', key);
      return false;
    }

    // 从localStorage删除数据
    localStorage.removeItem(`crypto_dashboard_${key}`);
    console.log(`数据已删除: ${key}`);
    return true;
  } catch (error) {
    console.error('删除数据失败:', error);
    return false;
  }
}

/**
 * 清空所有应用相关的本地存储数据
 * @returns {boolean} 清空是否成功
 *
 * 清空范围:
 * - 只删除以 'crypto_dashboard_' 前缀开头的数据
 * - 保留其他应用的数据
 *
 * 使用示例:
 * clearAllStorage();  // 清空所有仪表板数据
 */
export function clearAllStorage() {
  try {
    // 检查浏览器是否支持localStorage
    if (typeof Storage === 'undefined') {
      console.warn('浏览器不支持localStorage');
      return false;
    }

    // 获取所有localStorage键名
    const keys = Object.keys(localStorage);

    // 统计删除的数据数量
    let deletedCount = 0;

    // 遍历并删除以 'crypto_dashboard_' 开头的键
    keys.forEach(key => {
      if (key.startsWith('crypto_dashboard_')) {
        localStorage.removeItem(key);
        deletedCount++;
      }
    });

    console.log(`清空完成，共删除 ${deletedCount} 项数据`);
    return true;
  } catch (error) {
    console.error('清空存储数据失败:', error);
    return false;
  }
}

/**
 * 获取存储统计信息
 * @returns {object} 存储统计对象
 *
 * 统计信息包括:
 * - totalItems: 总存储项数
 * - totalSize: 总存储大小（字节）
 * - dashboardItems: 仪表板相关项数
 * - dashboardSize: 仪表板存储大小（字节）
 *
 * 使用示例:
 * const stats = getStorageStats();
 * console.log(`总计 ${stats.totalItems} 项数据，占用 ${stats.totalSize} 字节`);
 */
export function getStorageStats() {
  try {
    // 检查浏览器是否支持localStorage
    if (typeof Storage === 'undefined') {
      return {
        totalItems: 0,
        totalSize: 0,
        dashboardItems: 0,
        dashboardSize: 0,
      };
    }

    // 获取所有localStorage键名
    const keys = Object.keys(localStorage);

    // 统计变量
    let totalSize = 0;
    let dashboardItems = 0;
    let dashboardSize = 0;

    // 遍历统计
    keys.forEach(key => {
      const value = localStorage.getItem(key) || '';
      const size = key.length + value.length; // 估算大小

      totalSize += size;

      if (key.startsWith('crypto_dashboard_')) {
        dashboardItems++;
        dashboardSize += size;
      }
    });

    return {
      totalItems: keys.length,
      totalSize,
      dashboardItems,
      dashboardSize,
    };
  } catch (error) {
    console.error('获取存储统计失败:', error);
    return {
      totalItems: 0,
      totalSize: 0,
      dashboardItems: 0,
      dashboardSize: 0,
    };
  }
}