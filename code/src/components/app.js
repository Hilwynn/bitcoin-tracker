import React from "react"
import { LineChart, Line, Tooltip, XAxis, YAxis } from "recharts"
import openGdaxWebsocket from "../gdax-websocket"

class App extends React.Component {

  state = {
    tickerMessages: [],
    dataArray: []
  }

  componentDidMount() {
    this.websocket = openGdaxWebsocket(["BTC-EUR", "ETH-EUR"], this.handleNewTickerMessage)
  }

  componentWillUnmount() {
    this.websocket.close()
  }

  handleNewTickerMessage = newTickerMessage => {
    this.setState(previousState => {
      const entryLog = { timestamp: new Date() }

      const previousEntry = previousState.dataArray[previousState.dataArray.length - 1]
      console.log(previousEntry)

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

      return {

        tickerMessages: previousState.tickerMessages.concat([newTickerMessage]),
        dataArray: previousState.dataArray.concat([entryLog])

      }
    })
  }

  render() {
    return (
      <div>
        <LineChart width={400} height={400} data={this.state.dataArray}>
          <Line type="monotone" dataKey="BTC-EUR" stroke="#8884d8" />
          <Line type="monotone" dataKey="ETH-EUR" stroke="#8884d8" />
          <Tooltip />
          <XAxis />
          <YAxis type="number" domain={[0, "dataMax + 1000"]} />
        </LineChart>
      </div>
    )
  }

}

export default App
