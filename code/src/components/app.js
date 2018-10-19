import React from "react"
import { Legend, LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import openGdaxWebsocket from "../gdax-websocket"

class App extends React.Component {

  state = {
    tickerMessages: [],
    dataArray: [],
    tickerTime: new Date().toLocaleTimeString()
  }

  componentDidMount() {
    this.websocket = openGdaxWebsocket(["BTC-EUR", "ETH-EUR"], this.handleNewTickerMessage)
  }

  componentWillUnmount() {
    this.websocket.close()
  }

  handleNewTickerMessage = newTickerMessage => {
    this.setState(previousState => {
      const entryLog = { timestamp: this.state.tickerTime }

      const previousEntry = previousState.dataArray[previousState.dataArray.length - 1]

      if (newTickerMessage.product_id === "BTC-EUR") {
        entryLog["BTC-EUR"] = newTickerMessage.price

        if (previousEntry) {
          entryLog["ETH-EUR"] = previousEntry["ETH-EUR"]
        }
      } else {
        entryLog["ETH-EUR"] = newTickerMessage.price

        if (previousEntry) {
          entryLog["BTC-EUR"] = previousEntry["BTC-EUR"]
        }
      }

      if (this.state.tickerMessages.length > 9) {
        previousState.tickerMessages.shift()
        previousState.dataArray.shift()
      }

      return {
        tickerMessages: previousState.tickerMessages.concat([newTickerMessage]),
        dataArray: previousState.dataArray.concat([entryLog])
      }
    })
  }

  render() {
    return (
      <div className="wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={this.state.dataArray}
            margin={{
              top: 0, right: 10, left: -10, bottom: 40
            }}>
            <Line type="monotone" dataKey="BTC-EUR" stroke="orange" />
            <Line type="monotone" dataKey="ETH-EUR" stroke="red" />
            <Legend verticalAlign="top" height={30} />
            <Tooltip />
            <XAxis
              tick={{ fill: "gray", fontSize: 14 }}
              angle={-65}
              textAnchor="end"
              dataKey="timestamp" />
            <YAxis
              type="number"
              tick={{ fill: "gray", fontSize: 14 }}
              domain={[0, dataMax => Math.floor((dataMax + 1000))]} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

}

export default App
