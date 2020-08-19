import React from 'react'
import { hydrate } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { loadableReady } from '@loadable/component'
import { ThemeProvider } from '@material-ui/core/styles'
import { Provider as StateProvider } from 'react-redux'

import theme from './Theme/theme'
import createState from './State/create'
import App from './App'

/**
 * We are setting something on the window object
 * so let's modify its type
 */
declare global {
  interface Window {
    /**
     * STATE is from Redux Hydration State
     */
    __STATE__: {},
    /**
     * DEVTOOLS is a possible value from our browser
     */
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any
  }
}

/**
 * We try to read from the window object
 */
const preloadedstate = window.__STATE__

/**
 * And be sure to garbage collect it
 */
delete window.__STATE__

function Main() {
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')

    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, []);

  /**
   * This needs to mirror what is inside of `src/server/ssr`
   */
  return (
    <StateProvider store={createState(preloadedstate)}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </StateProvider>
  );
}

loadableReady(() => {
  hydrate((
    <Main />
  ), document.getElementById('mount'))
})


