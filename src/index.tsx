import { ColorModeScript } from "@chakra-ui/react"
import * as React from "react"
import ReactDOM from "react-dom"
import { App } from "./App"
import {ChakraProvider,  extendTheme} from "@chakra-ui/react"

const theme = extendTheme({
  sizes: {
    "screen-w": "100vw",
    "screen-h": "100vh"
  }
})

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript />
    <ChakraProvider theme={theme}><App /></ChakraProvider>
    
  </React.StrictMode>,
  document.getElementById("root"),
)
