import {Card} from "antd";
import numberWithCommas from "../utils.js";


function CryptocurrencyCard(props) {
    const { currency } = props

    console.log(currency)
    if (!currency?.market_data) {

    console.error("CryptocurrencyCard received currency without market_data:", currency);
    return <div>Data unavailable</div>;
    }
    const priceChangeColor = currency.market_data.price_change_percentage_24h_in_currency.usd > 0 ? 'text-green-400' : 'text-red-400'
    const formattedPrice = numberWithCommas(Math.round(currency.market_data.current_price.usd))
    const formattedMarketCap = numberWithCommas(Math.round(currency.market_data.market_cap.usd/1_000_000_000))
    const priceChange = Math.round(100 * currency.market_data.price_change_percentage_24h_in_currency.usd) / 100

  //const price = Math.round(currency.quote.USD.price)

  return (
    <div>
      <Card
        title={
          <div className="flex items-center gap-3">
            <img src={`${currency.image.thumb}`} alt='logo' width="50"/>
            <p className="text-3xl">{currency.name}</p>
          </div>
        }
        bordered={false}
        style={{
          width: 700,
          height: 340,
          'box-shadow': '0 3px 10px rgb(0,0,0,0.2)',
        }}
        className="text-2xl"
      >
        <p>Текущая цена: {formattedPrice}$</p>
        <span>Изменение цены за 24 часа: </span>
        <span className={priceChangeColor}>
        {priceChange}%
      </span>
        <p>Текущая капитализация: ${formattedMarketCap}B</p>
      </Card>
    </div>
  )
}

export default CryptocurrencyCard