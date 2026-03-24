/**
 * API请求工具模块
 * 负责处理所有与后端API的通信，包括数据获取、错误处理等
 */

import { message } from 'antd';

// 配置的API基础URL
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9000';

/**
 * 基础请求函数
 * @param {string} endpoint - API端点路径
 * @param {object} options - 请求配置选项
 * @returns {Promise} 返回响应数据或错误
 */
const request = async (endpoint, options = {}) => {
  try {
    // 构建完整URL
    const url = `${BASE_URL}${endpoint}`;

    // 默认请求头
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // 合并请求配置
    const config = {
      method: 'GET',
      headers: { ...defaultHeaders, ...options.headers },
      ...options,
    };

    // 发起请求
    const response = await fetch(url, config);

    // 检查响应状态
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP错误! 状态: ${response.status}`);
    }

    // 解析响应数据
    const data = await response.json();

    // 检查业务逻辑是否成功（v2.0规范）
    if (data.hasOwnProperty('success') && data.success === false) {
      throw new Error(data.message || '请求失败');
    }

    // 返回 data 字段（v2.0规范）
    return data.data !== undefined ? data.data : data;

  } catch (error) {
    // 错误处理逻辑
    console.error('API请求失败:', error);

    // 网络错误处理
    if (!navigator.onLine) {
      handleNetworkError('网络连接已断开，请检查您的网络设置');
      return null;
    }

    // HTTP错误处理
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      handleNetworkError('无法连接到服务器，请稍后重试');
      return null;
    }

    // 显示错误信息
    message.error(error.message || '请求失败，请稍后重试');
    throw error;
  }
};

/**
 * 处理网络错误
 * 显示友好的错误提示消息
 * @param {string} errorMsg - 错误消息
 */
const handleNetworkError = (errorMsg) => {
  message.error({
    content: errorMsg,
    style: {
      marginTop: '20vh',
      fontSize: '16px',
    },
  });
};

/**
 * GET请求封装
 * @param {string} endpoint - API端点
 * @param {object} params - URL参数
 * @returns {Promise} 返回响应数据
 */
export const get = async (endpoint, params = {}) => {
  const searchParams = new URLSearchParams(params);
  const queryString = searchParams.toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;

  return request(url, { method: 'GET' });
};

/**
 * POST请求封装
 * @param {string} endpoint - API端点
 * @param {object} data - 请求数据
 * @returns {Promise} 返回响应数据
 */
export const post = async (endpoint, data = {}) => {
  return request(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * PUT请求封装
 * @param {string} endpoint - API端点
 * @param {object} data - 请求数据
 * @returns {Promise} 返回响应数据
 */
export const put = async (endpoint, data = {}) => {
  return request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * DELETE请求封装
 * @param {string} endpoint - API端点
 * @returns {Promise} 返回响应数据
 */
export const del = async (endpoint) => {
  return request(endpoint, { method: 'DELETE' });
};

/**
 * 创建带认证的请求头
 * @param {string} token - 认证令牌
 * @returns {object} 配置好的请求头
 */
export const createAuthHeaders = (token) => {
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * 设置请求超时
 * @param {number} timeout - 超时时间（毫秒）
 * @returns {Promise} 超时Promise
 */
export const createTimeoutPromise = (timeout = 10000) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('请求超时，请检查网络连接'));
    }, timeout);
  });
};

/**
 * 批量请求
 * @param {Array} requests - 请求配置数组 [{ endpoint, params }]
 * @returns {Promise} 返回所有请求结果
 */
export const batchRequest = async (requests) => {
  const promises = requests.map(({ endpoint, params }) =>
    get(endpoint, params).catch(error => ({ error: error.message }))
  );

  try {
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error('批量请求失败:', error);
    throw error;
  }
};

export default request;