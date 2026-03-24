/**
 * CoinInfoCard币种信息卡片组件
 *
 * 功能说明：
 * 1. 展示币种的详细信息
 * 2. 包括价格、市值、交易量、24h变化等
 * 3. 支持涨跌幅颜色显示（绿涨红跌）
 * 4. 响应式设计，适配移动端
 *
 * 显示的信息：
 * - 币种名称和符号
 * - 当前价格
 * - 24h涨跌百分比
 * - 24h交易量
 * - 市值排名
 * - 市值
 * - 流通供给量
 * - 总供给量
 *
 * 使用示例：
 * <CoinInfoCard
 *   coin={{
 *     id: 'bitcoin',
 *     symbol: 'BTCUSDT',
 *     name: 'Bitcoin',
 *     current_price: 45000,
 *     price_change_percentage_24h: 2.5,
 *     market_cap: 850000000000,
 *     total_volume: 25000000000,
 *     market_cap_rank: 1
 *   }}
 * />
 */

import React from 'react';
import { formatPrice, formatPercent, formatVolume, getPriceColor } from '../../utils/tools';

/**
 * 币种信息卡片组件
 * @param {object} props - 组件属性
 * @param {object} props.coin - 币种信息对象
 * @param {string} props.theme - 主题名称
 */
const CoinInfoCard = ({
  coin = {},
  theme = 'light',
}) => {
  if (!coin || !coin.symbol) {
    return (
      <div className="coin-info-card empty">
        <p>暂无币种信息</p>
      </div>
    );
  }

  const {
    id = '',
    symbol = '',
    name = '',
    current_price = 0,
    price_change_percentage_24h = 0,
    market_cap = 0,
    total_volume = 0,
    market_cap_rank = 0,
    circulating_supply = 0,
    total_supply = 0,
    max_supply = 0,
  } = coin;

  const priceChangeColor = getPriceColor(price_change_percentage_24h, 'color');
  const priceChangeIcon = price_change_percentage_24h >= 0 ? '↗' : '↘';

  return (
    <div className="coin-info-card">
      {/* 币种基本信息 */}
      <div className="coin-header">
        <div className="coin-identity">
          {id && (
            <img
              src={`https://assets.coingecko.com/coins/images/${id}/small.png`}
              alt={name}
              className="coin-icon"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <div className="coin-names">
            <h2 className="coin-name">{name}</h2>
            <span className="coin-symbol">{symbol.toUpperCase()}</span>
            {market_cap_rank > 0 && (
              <span className="coin-rank">#{market_cap_rank}</span>
            )}
          </div>
        </div>
        <div className="coin-price">
          <div className="current-price">
            {formatPrice(current_price)}
          </div>
          <div
            className="price-change"
            style={{ color: priceChangeColor }}
          >
            <span className="change-icon">{priceChangeIcon}</span>
            <span className="change-value">
              {formatPercent(price_change_percentage_24h)}
            </span>
            <span className="change-label">24h</span>
          </div>
        </div>
      </div>

      {/* 详细信息 */}
      <div className="coin-details">
        <div className="detail-row">
          <div className="detail-item">
            <span className="detail-label">市值</span>
            <span className="detail-value">{formatPrice(market_cap)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">24h交易量</span>
            <span className="detail-value">{formatVolume(total_volume)}</span>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-item">
            <span className="detail-label">流通供给量</span>
            <span className="detail-value">
              {circulating_supply
                ? `${formatVolume(circulating_supply)} ${symbol.toUpperCase()}`
                : 'N/A'}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">总供给量</span>
            <span className="detail-value">
              {total_supply
                ? `${formatVolume(total_supply)} ${symbol.toUpperCase()}`
                : max_supply
                ? `${formatVolume(max_supply)} ${symbol.toUpperCase()}`
                : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* 额外信息（可扩展） */}
      <div className="coin-footer">
        <div className="info-tags">
          {market_cap_rank > 0 && (
            <span className="tag">市值排名 #{market_cap_rank}</span>
          )}
          <span className="tag">{symbol.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};

export default CoinInfoCard;