import React from 'react';
import { Typography, Row, Col, Statistic, Card, Button } from 'antd';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import millify from 'millify';
import { useGetGlobalStatsQuery, useGetCryptosQuery, useGetTrendingCoinsQuery } from '../services/cryptoApi';
import Cryptocurrencies from './Cryptocurrencies';
import Loader from '../components/Loader';

const { Title, Paragraph } = Typography;

const Homepage: React.FC = () => {
  const { data: globalStats, isFetching: isFetchingStats } = useGetGlobalStatsQuery('');
  const { data: cryptosList, isFetching: isFetchingCryptos } = useGetCryptosQuery(10);
  const { data: trendingCoins, isFetching: isFetchingTrending } = useGetTrendingCoinsQuery('');

  if (isFetchingStats || isFetchingCryptos) return <Loader />;

  const stats = globalStats?.data;

  return (
    <>
      <div className="text-center mb-8">
        <Title level={2} className="mb-2">Global Crypto Statistics</Title>
        <Paragraph className="text-gray-500 dark:text-gray-400">
          Overview of the cryptocurrency market
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={8}>
          <Card variant="outlined" className="h-full">
            <Statistic
              title="Total Cryptocurrencies"
              value={stats?.active_cryptocurrencies}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card variant="outlined" className="h-full">
            <Statistic
              title="Total Exchanges"
              value={stats?.markets}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card variant="outlined" className="h-full">
            <Statistic
              title="Total Market Cap"
              value={millify(stats?.total_market_cap?.usd || 0)}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix="$"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card variant="outlined" className="h-full">
            <Statistic
              title="Total 24h Volume"
              value={millify(stats?.total_volume?.usd || 0)}
              precision={2}
              valueStyle={{ color: '#1677ff' }}
              prefix="$"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card variant="outlined" className="h-full">
            <Statistic
              title="Bitcoin Dominance"
              value={stats?.market_cap_percentage?.btc || 0}
              precision={2}
              valueStyle={{ color: '#faad14' }}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card variant="outlined" className="h-full">
            <Statistic
              title="Market Cap Change 24h"
              value={stats?.market_cap_change_percentage_24h_usd || 0}
              precision={2}
              valueStyle={{ 
                color: (stats?.market_cap_change_percentage_24h_usd || 0) >= 0 ? '#3f8600' : '#cf1322' 
              }}
              suffix="%"
              prefix={(stats?.market_cap_change_percentage_24h_usd || 0) >= 0 ? '+' : ''}
            />
          </Card>
        </Col>
      </Row>

      {!isFetchingTrending && trendingCoins?.coins && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <Title level={2} className="mb-0">
              <div className="flex items-center">
                <TrendingUp size={24} className="mr-2 text-red-500" />
                Trending Coins
              </div>
            </Title>
          </div>
          <Row gutter={[24, 24]}>
            {trendingCoins.coins.slice(0, 4).map((coin: any) => (
              <Col xs={24} sm={12} lg={6} key={coin.item.id}>
                <Link to={`/crypto/${coin.item.id}`}>
                  <Card 
                    hoverable 
                    className="crypto-card h-full"
                    cover={
                      <img 
                        alt={coin.item.name} 
                        src={coin.item.large} 
                        className="p-4 h-48 object-contain mx-auto"
                      />
                    }
                  >
                    <Card.Meta 
                      title={`${coin.item.name} (${coin.item.symbol})`}
                      description={`Market Cap Rank: ${coin.item.market_cap_rank || 'N/A'}`}
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      )}

      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <Title level={2} className="mb-0">Top 10 Cryptocurrencies</Title>
          <Link to="/cryptocurrencies">
            <Button type="primary" icon={<ArrowRight size={16} />}>
              Show More
            </Button>
          </Link>
        </div>
        <Cryptocurrencies simplified />
      </div>
    </>
  );
};

export default Homepage;