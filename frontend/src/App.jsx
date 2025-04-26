
import React, { useEffect, useState, useCallback } from 'react';
import { Spin, Input, Select, List, Avatar, Typography, Alert } from 'antd';
import axios from 'axios';
import numberWithCommas from './utils';
import {API_BASE_URL} from "./urls.jsx";
const { Search } = Input;
const { Option } = Select;
const { Text, Title } = Typography;





const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

const App = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allCurrencies, setAllCurrencies] = useState([]);
  const [filteredCurrencies, setFilteredCurrencies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('usd');

  const fetchMarketData = useCallback((currency) => {
    setLoading(true);
    setError(null);
    apiClient.get(`/api/v1/cryptocurrencies?vs_currency=${currency}`)
      .then(response => {
        const data = response.data || [];
        setAllCurrencies(data);

        const lowerCaseSearch = searchTerm.toLowerCase();
        const filtered = data.filter(c =>
            c.name.toLowerCase().includes(lowerCaseSearch) ||
            c.symbol.toLowerCase().includes(lowerCaseSearch)
        );
        setFilteredCurrencies(filtered);
      })
      .catch(err => {
        console.error("Error fetching market data:", err);
        const errorMsg = err.response?.data?.detail || err.message || 'Unknown error occurred';
        setError(`Failed to load market data: ${errorMsg}.I need pro access to the API XD`);
        setAllCurrencies([]);
        setFilteredCurrencies([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchTerm]);


  useEffect(() => {
    fetchMarketData(selectedCurrency);
  }, [selectedCurrency, fetchMarketData]);


  useEffect(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = allCurrencies.filter(currency =>
      currency.name.toLowerCase().includes(lowerCaseSearch) ||
      currency.symbol.toLowerCase().includes(lowerCaseSearch)
    );
    setFilteredCurrencies(filtered);
  }, [searchTerm, allCurrencies]);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCurrencyChange = (value) => {
    setSelectedCurrency(value);

  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Title level={2} className="m-0 whitespace-nowrap">Market Overview</Title>
        <div className='flex flex-wrap items-center gap-4'>
          <Search
            placeholder="Search by name or symbol"
            onChange={handleSearchChange}
            style={{ width: 250 }}
            allowClear
            value={searchTerm}
          />
          <Select
            value={selectedCurrency}
            style={{ width: 90 }}
            onChange={handleCurrencyChange}
          >
            <Option value="usd">USD</Option>
            <Option value="eur">EUR</Option>

          </Select>
        </div>
      </div>

      {error && <Alert message={error} type="error" showIcon className="mb-4" />}

      {loading ? (
        <div className="text-center p-10">
          <Spin size="large" />
        </div>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={filteredCurrencies}
          locale={{ emptyText: searchTerm ? 'No currencies match your search.' : 'No data available.' }}
          renderItem={(item) => {
            const price = item.current_price;
            const priceChange = item.price_change_percentage_24h;
            const priceChangeColor = priceChange >= 0 ? 'text-green-600' : 'text-red-600';
            const formattedPrice = typeof price === 'number'
              ? `${numberWithCommas(price.toFixed(2))} ${selectedCurrency.toUpperCase()}`
              : 'N/A';
            const formattedPriceChange = typeof priceChange === 'number'
              ? `${priceChange.toFixed(2)}%`
              : 'N/A';

            return (
              <List.Item
                actions={[
                  <Text strong className={priceChangeColor}>
                    {formattedPriceChange}
                  </Text>
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.image} alt={`${item.name} logo`} />}
                  title={<Text strong>{item.name} ({item.symbol.toUpperCase()})</Text>}
                  description={`Price: ${formattedPrice}`}
                />
              </List.Item>
            );
          }}
          className="bg-white rounded shadow"
        />
      )}
    </div>
  );
};

export default App;