import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Input, Typography, Statistic } from 'antd';
import { Star } from 'lucide-react';
import millify from 'millify';
import { useGetCryptosQuery } from '../services/cryptoApi';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmark, selectBookmarks } from '../features/bookmarks/bookmarksSlice';
import Loader from '../components/Loader';

const { Title } = Typography;

interface CryptocurrenciesProps {
  simplified?: boolean;
}

const Cryptocurrencies: React.FC<CryptocurrenciesProps> = ({ simplified = false }) => {
  const count = simplified ? 10 : 100;
  const { data: cryptosList, isFetching } = useGetCryptosQuery(count);
  const [cryptos, setCryptos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const bookmarks = useSelector(selectBookmarks);

  useEffect(() => {
    if (cryptosList) {
      const filteredData = cryptosList.filter((coin: any) => 
        coin.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCryptos(filteredData);
    }
  }, [cryptosList, searchTerm]);

  const handleBookmarkToggle = (e: React.MouseEvent, coin: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(toggleBookmark({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
    }));
  };

  const isBookmarked = (coinId: string) => {
    return bookmarks.some(bookmark => bookmark.id === coinId);
  };

  if (isFetching) return <Loader />;

  return (
    <>
      {!simplified && (
        <div className="mb-8">
          <Title level={2} className="text-center mb-6">All Cryptocurrencies</Title>
          <div className="max-w-md mx-auto">
            <Input 
              placeholder="Search Cryptocurrency" 
              onChange={(e) => setSearchTerm(e.target.value)}
              size="large"
              allowClear
            />
          </div>
        </div>
      )}

      <Row gutter={[24, 24]} className="mt-4">
        {cryptos?.map((currency) => (
          <Col xs={24} sm={12} lg={6} key={currency.id}>
            <Link to={`/crypto/${currency.id}`}>
              <Card 
                hoverable 
                className="crypto-card h-full"
                extra={
                  <Star 
                    size={18} 
                    className={`bookmark-icon ${isBookmarked(currency.id) ? 'bookmarked' : ''}`}
                    fill={isBookmarked(currency.id) ? '#faad14' : 'none'}
                    onClick={(e) => handleBookmarkToggle(e, currency)}
                  />
                }
                cover={
                  <img 
                    className="p-6 h-40 object-contain mx-auto"
                    alt={currency.name}
                    src={currency.image}
                  />
                }
              >
                <Card.Meta 
                  title={`${currency.name} (${currency.symbol.toUpperCase()})`}
                  description={`Rank #${currency.market_cap_rank}`}
                />
                <div className="mt-4">
                  <Statistic 
                    title="Price" 
                    value={currency.current_price} 
                    precision={2} 
                    prefix="$" 
                  />
                  <div className="mt-2 flex justify-between">
                    <Statistic 
                      title="24h" 
                      value={currency.price_change_percentage_24h} 
                      precision={2} 
                      valueStyle={{ 
                        color: currency.price_change_percentage_24h > 0 ? '#3f8600' : '#cf1322',
                        fontSize: '14px'
                      }}
                      suffix="%" 
                      prefix={currency.price_change_percentage_24h > 0 ? '+' : ''}
                    />
                    <Statistic 
                      title="Market Cap" 
                      value={millify(currency.market_cap)} 
                      prefix="$" 
                      valueStyle={{ fontSize: '14px' }}
                    />
                  </div>
                </div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Cryptocurrencies;