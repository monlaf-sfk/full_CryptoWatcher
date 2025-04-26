
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, InputNumber, Table, Spin, Alert, Popconfirm, message, Typography, Tag } from 'antd';
import axios from 'axios';
import numberWithCommas from '../utils';
import {API_BASE_URL} from "../urls.jsx";

const { Option } = Select;
const { Text } = Typography;


const apiClient = axios.create({ baseURL: API_BASE_URL });

const Portfolio = () => {
    const [form] = Form.useForm();
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [availableCoins, setAvailableCoins] = useState([]);
    const [loadingCoins, setLoadingCoins] = useState(true);

    const fetchAvailableCoins = () => {
        setLoadingCoins(true);
        apiClient.get('/api/v1/cryptocurrencies?vs_currency=usd')
            .then(response => {
                setAvailableCoins(response.data || []);
                setLoadingCoins(false);
            })
            .catch(err => {
                console.error("Error fetching coin list:", err);
                setError("Could not load coin list for selection.");
                setLoadingCoins(false);
            });
    };

    const fetchPortfolio = () => {
        setLoading(true);
        setError(null);
        apiClient.get('/api/v1/portfolio')
            .then(response => {
                setPortfolio(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching portfolio:", err);
                setError(`Failed to load portfolio: ${err.response?.data?.detail || err.message}`);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchAvailableCoins();
        fetchPortfolio();
    }, []);

    const onFinish = (values) => {
        console.log('Adding item:', values);
        setLoading(true);
        apiClient.post('/api/v1/portfolio', values)
            .then(() => {
                message.success('Portfolio item added successfully!');
                form.resetFields();
                fetchPortfolio();
            })
            .catch(err => {
                console.error("Error adding portfolio item:", err);
                message.error(`Failed to add item: ${err.response?.data?.detail || err.message}`);
                setLoading(false);
            });
    };

    const handleDelete = (itemId) => {
        setLoading(true);
        apiClient.delete(`/api/v1/portfolio/${itemId}`)
            .then(() => {
                message.success('Portfolio item deleted successfully!');
                fetchPortfolio();
            })
            .catch(err => {
                console.error("Error deleting portfolio item:", err);
                message.error(`Failed to delete item: ${err.response?.data?.detail || err.message}`);
                fetchPortfolio();
            });
    };

    const columns = [
        {
            title: 'Coin',
            dataIndex: 'coin_id',
            key: 'coin_id',
            render: (text) => text.charAt(0).toUpperCase() + text.slice(1) // Capitalize
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Entry Price (USD)',
            dataIndex: 'entry_price',
            key: 'entry_price',
            render: (price) => `$${numberWithCommas(price)}`,
        },
        {
            title: 'Current Price (USD)',
            dataIndex: 'current_price',
            key: 'current_price',
            render: (price) => price !== null ? `$${numberWithCommas(price.toFixed(2))}` : <Tag color="orange">N/A</Tag>,
        },
         {
            title: 'Current Value (USD)',
            dataIndex: 'current_value',
            key: 'current_value',
            render: (value) => value !== null ? `$${numberWithCommas(value.toFixed(2))}` : <Tag color="orange">N/A</Tag>,
        },
        {
            title: 'Profit/Loss',
            dataIndex: 'profit_loss',
            key: 'profit_loss',
            render: (pl, record) => {
                if (pl === null || record.profit_loss_percent === null) return <Tag color="orange">N/A</Tag>;
                const color = pl >= 0 ? 'green' : 'red';
                const sign = pl >= 0 ? '+' : '';
                return (
                    <Tag color={color}>
                       {sign}${numberWithCommas(pl.toFixed(2))} ({record.profit_loss_percent.toFixed(2)}%)
                    </Tag>
                );
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure delete this item?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="link" danger>Delete</Button>
                </Popconfirm>
            ),
        },
    ];

    if (loadingCoins && !availableCoins.length) {
         return <div className="flex justify-center items-center h-full"><Spin tip="Loading coins..." /></div>;
    }

    return (
        <div className="p-4">
             <Typography.Title level={2}>My Portfolio</Typography.Title>

             <Form
                form={form}
                layout="inline"
                onFinish={onFinish}
                className="mb-6 p-4 bg-gray-100 rounded shadow"
                initialValues={{ quantity: 1 }}
             >
                <Form.Item
                    name="coin_id"
                    label="Coin"
                    rules={[{ required: true, message: 'Please select a coin!' }]}
                >
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Select a coin"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                          option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        loading={loadingCoins}
                        disabled={loadingCoins}
                    >
                        {availableCoins.map(coin => (
                            <Option key={coin.id} value={coin.id}>{coin.name} ({coin.symbol.toUpperCase()})</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="quantity"
                    label="Quantity"
                    rules={[{ required: true, type: 'number', min: 0.00000001, message: 'Please input quantity!' }]}
                >
                    <InputNumber style={{ width: 120 }} min={0.00000001} step={0.1} />
                </Form.Item>

                <Form.Item
                    name="entry_price"
                    label="Entry Price (USD)"
                    rules={[{ required: true, type: 'number', min: 0, message: 'Please input entry price!' }]}
                >
                    <InputNumber style={{ width: 150 }} min={0} step={100} prefix="$" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Add Asset
                    </Button>
                </Form.Item>
            </Form>


            {portfolio && !loading && (
                <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="p-4 bg-blue-100 rounded shadow text-center">
                       <Text strong>Total Entry Value</Text><br/>
                       <Text>${numberWithCommas(portfolio.total_entry_value.toFixed(2))}</Text>
                   </div>
                   <div className="p-4 bg-green-100 rounded shadow text-center">
                       <Text strong>Total Current Value</Text><br/>
                       <Text>${numberWithCommas(portfolio.total_current_value.toFixed(2))}</Text>
                   </div>
                   <div className={`p-4 rounded shadow text-center ${portfolio.total_profit_loss >= 0 ? 'bg-green-200' : 'bg-red-200'}`}>
                       <Text strong>Total Profit/Loss</Text><br/>
                       <Text strong className={portfolio.total_profit_loss >= 0 ? 'text-green-700' : 'text-red-700'}>
                           {portfolio.total_profit_loss >= 0 ? '+' : ''}${numberWithCommas(portfolio.total_profit_loss.toFixed(2))}
                           ({portfolio.total_profit_loss_percent.toFixed(2)}%)
                       </Text>
                   </div>
                </div>
            )}


            <Typography.Title level={3}>Assets</Typography.Title>
            {error && <Alert message={error} type="error" showIcon className="mb-4" />}
            <Table
                columns={columns}
                dataSource={portfolio?.items || []}
                rowKey="id"
                loading={loading}
                pagination={false}
                className="shadow"
            />
        </div>
    );
};

export default Portfolio;