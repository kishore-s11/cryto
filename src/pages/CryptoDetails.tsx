import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Row, Col, Select, Card, Statistic, Divider, Button, Tag } from 'antd';
import { 
  DollarSign, 
  Hash, 
  Trophy, 
  Check, 
  Info, 
  BarChart2, 
  Globe, 
  Star,
  ExternalLink
} from 'lucide-react';
import millify from 'millify';
import { 
  useGetCryptoDetailsQuery, 
  useGetCryptoHistoryQuery 
} from '../services/cryptoApi';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmark, selectBookmarks } from '../features/bookmarks/bookmarksSlice';
import LineChart from '../components/LineChart';
import Loader from '../components/Loader';

const { Title, Text } = Typography;
const { Option } = Select;

const CryptoDetails: React.FC = () => {
  const { coinId } = useParams<{ coinId: string }>();
  const [timeframe, setTimeframe] = useState<number>(365);
  const { data: cryptoDetails, isFetching } = useGetCryptoDetailsQuery(coinId);
  const { data: coinHistory, isFetching: isFetchingHistory } = useGetCryptoHistoryQuery({ 
    coinId, 
    days: timeframe 
  });
  const dispatch = useDispatch();
  const bookmarks = useSelector(selectBookmarks);

  const isBookmarked = (id: string) => {
    return bookmarks.some(bookmark => bookmark.id === id);
  };

  const handleBookmarkToggle = () => {
    if (cryptoDetails) {
      dispatch(toggleBookmark({
        id: cryptoDetails.id,
        name: cryptoDetails.name,
        symbol: cryptoDetails.symbol,
        image: cryptoDetails.image.large,
      }));
    }
  };

  if (isFetching) return <Loader />;

  const stats = [
    { 
      title: 'Price to USD', 
      value: `$ ${cryptoDetails?.market_data.current_price.usd && millify(cryptoDetails?.market_data.current_price.usd)}`, 
      icon: <DollarSign size={20} /> 
    },
    { 
      title: 'Rank', 
      value: cryptoDetails?.market_cap_rank, 
      icon: <Hash size={20} /> 
    },
    { 
      title: '24h Volume', 
      value: `$ ${cryptoDetails?.market_data.total_volume.usd && millify(cryptoDetails?.market_data.total_volume.usd)}`, 
      icon: <BarChart2 size={20} /> 
    },
    { 
      title: 'Market Cap', 
      value: `$ ${cryptoDetails?.market_data.market_cap.usd && millify(cryptoDetails?.market_data.market_cap.usd)}`, 
      icon: <DollarSign size={20} /> 
    },
    { 
      title: 'All-time-high (daily avg.)', 
      value: `$ ${cryptoDetails?.market_data.ath.usd && millify(cryptoDetails?.market_data.ath.usd)}`, 
      icon: <Trophy size={20} /> 
    },
  ];

  const genericStats = [
    { 
      title: 'Number Of Markets', 
      value: cryptoDetails?.tickers?.length, 
      icon: <BarChart2 size={20} /> 
    },
    { 
      title: 'Circulating Supply', 
      value: `${cryptoDetails?.market_data.circulating_supply && millify(cryptoDetails?.market_data.circulating_supply)}`, 
      icon: <Info size={20} /> 
    },
    { 
      title: 'Total Supply', 
      value: `${cryptoDetails?.market_data.total_supply && millify(cryptoDetails?.market_data.total_supply)}`, 
      icon: <Info size={20} /> 
    },
    { 
      title: 'Max Supply', 
      value: `${cryptoDetails?.market_data.max_supply ? millify(cryptoDetails?.market_data.max_supply) : 'No max supply'}`, 
      icon: <Info size={20} /> 
    },
  ];

  return (
    <div className="coin-detail-container">
      <div className="coin-heading-container">
        <div className="flex items-center">
          {cryptoDetails?.image?.large && (
            <img 
              src={cryptoDetails.image.large} 
              alt={cryptoDetails.name} 
              className="w-12 h-12 mr-4"
            />
          )}
          <Title level={2} className="coin-name">
            {cryptoDetails?.name} ({cryptoDetails?.symbol.toUpperCase()})
          </Title>
        </div>
        <Button
          type={isBookmarked(coinId || '') ? 'primary' : 'default'}
          icon={<Star size={16} />}
          onClick={handleBookmarkToggle}
          className="ml-auto"
        >
          {isBookmarked(coinId || '') ? 'Bookmarked' : 'Bookmark'}
        </Button>
      </div>

      <div className="mt-6">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card variant="outlined">
              {cryptoDetails?.description?.en && (
                <div className="mb-6">
                  <Title level={4}>What is {cryptoDetails.name}?</Title>
                  <div 
                    dangerouslySetInnerHTML={{ __html: cryptoDetails.description.en.split('. ').slice(0, 3).join('. ') + '.' }} 
                    className="text-base"
                  />
                </div>
              )}
              
              {!isFetchingHistory && coinHistory && (
                <LineChart 
                  coinHistory={coinHistory} 
                  currentPrice={millify(cryptoDetails?.market_data.current_price.usd || 0)} 
                  coinName={cryptoDetails?.name || ''} 
                  coinColor={cryptoDetails?.market_data.price_change_percentage_24h >= 0 ? '#3f8600' : '#cf1322'}
                  onTimeframeChange={setTimeframe}
                />
              )}
            </Card>
          </Col>
          
          <Col xs={24} lg={8}>
            <Card variant="outlined" className="mb-6">
              <Title level={4}>{cryptoDetails?.name} Value Statistics</Title>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                An overview showing the stats of {cryptoDetails?.name}
              </p>
              {stats.map(({ icon, title, value }) => (
                <div key={title} className="flex justify-between items-center py-3 border-b last:border-b-0">
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-500">{icon}</span>
                    <Text>{title}</Text>
                  </div>
                  <Text strong>{value}</Text>
                </div>
              ))}
            </Card>
            
            <Card variant="outlined" className="mb-6">
              <Title level={4}>Other Statistics</Title>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Additional statistics about {cryptoDetails?.name}
              </p>
              {genericStats.map(({ icon, title, value }) => (
                <div key={title} className="flex justify-between items-center py-3 border-b last:border-b-0">
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-500">{icon}</span>
                    <Text>{title}</Text>
                  </div>
                  <Text strong>{value}</Text>
                </div>
              ))}
            </Card>
            
            {cryptoDetails?.categories && cryptoDetails.categories.length > 0 && (
              <Card variant="outlined" className="mb-6">
                <Title level={4}>Categories</Title>
                <div className="flex flex-wrap gap-2 mt-4">
                  {cryptoDetails.categories.map((category: string) => (
                    <Tag key={category} color="blue">{category}</Tag>
                  ))}
                </div>
              </Card>
            )}
            
            <Card variant="outlined">
              <Title level={4}>Links</Title>
              {cryptoDetails?.links?.homepage && (
                <div className="coin-link">
                  <div className="flex items-center">
                    <Globe size={16} className="mr-2" />
                    <Text className="link-name">Website</Text>
                  </div>
                  <a 
                    href={cryptoDetails.links.homepage[0]} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center text-blue-500"
                  >
                    {cryptoDetails.links.homepage[0].replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0]}
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              )}
              
              {cryptoDetails?.links?.blockchain_site && cryptoDetails.links.blockchain_site[0] && (
                <div className="coin-link">
                  <div className="flex items-center">
                    <Check size={16} className="mr-2" />
                    <Text className="link-name">Explorer</Text>
                  </div>
                  <a 
                    href={cryptoDetails.links.blockchain_site[0]} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center text-blue-500"
                  >
                    {cryptoDetails.links.blockchain_site[0].replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0]}
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              )}
              
              {cryptoDetails?.links?.subreddit_url && (
                <div className="coin-link">
                  <div className="flex items-center">
                    <Check size={16} className="mr-2" />
                    <Text className="link-name">Reddit</Text>
                  </div>
                  <a 
                    href={cryptoDetails.links.subreddit_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center text-blue-500"
                  >
                    {cryptoDetails.links.subreddit_url.replace('https://', '').replace('http://', '').replace('www.', '')}
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              )}
              
              {cryptoDetails?.links?.repos_url?.github && cryptoDetails.links.repos_url.github.length > 0 && (
                <div className="coin-link">
                  <div className="flex items-center">
                    <Check size={16} className="mr-2" />
                    <Text className="link-name">GitHub</Text>
                  </div>
                  <a 
                    href={cryptoDetails.links.repos_url.github[0]} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center text-blue-500"
                  >
                    {cryptoDetails.links.repos_url.github[0].replace('https://', '').replace('http://', '').replace('www.', '')}
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CryptoDetails;