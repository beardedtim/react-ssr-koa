import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { Context, Next } from 'koa'
import { ChunkExtractor } from '@loadable/server'
import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles'
import { Provider as StateProvider } from 'react-redux'
import createState from '../client/State/create'
import App from '../client/App'
import theme from '../client/Theme/theme'

const readFile = promisify(fs.readFile)

const ASSET_PATH = process.env.ASSET_PATH || path.resolve(__dirname, '..', 'client', 'static')

const statsFile = path.resolve(ASSET_PATH, 'loadable-stats.json')

const ssr = async (ctx: Context, next: Next) => {
  const context = {
    url: undefined,
  }

  const extractor = new ChunkExtractor({ statsFile })
  const sheets = new ServerStyleSheets()
  const store = createState()

  const jsx = extractor.collectChunks(
    sheets.collect(
      /**
       * This should mimic what is in src/client/entry.tsx
       * with the exception that we are on the server and not
       * the browser
       */
      <StateProvider store={store}>
        <StaticRouter location={ctx.url} context={context}>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </StaticRouter>
      </StateProvider>
    )
  )

  /**
   * We will have set the url to something if
   * we have rendered a <Redirect /> component
   */
  if (context.url) {
    /**
     * So let's redirect
     */
    return ctx.redirect(context.url!)
  }

  const app = renderToString(jsx)
  
  /**
   * This is for our code splitting. It tells the
   * browser about the next files it might want to
   * download in the background.
   */
  const scriptTags = extractor.getScriptTags()
  const linkTags = extractor.getLinkTags()
  const styleTags = extractor.getStyleTags()

  const css = sheets.toString()

  /**
   * This path is relative to the build. This assumes that
   * you the client build local to the server build. If this
   * is hosted on S3 or some other static service, you will need
   * to change where you get this value from.
   * 
   * This needs to be the index.html built from webpack so that
   * it will include the hashes/split code.
   * 
   * CODE OF INTEREST:
   * 
   * PATH IS RELATIVE TO FINAL BUILD, NOT LOCAL
   */
  const file = await readFile(
    path.resolve(__dirname, '..', 'client', 'index.html'),
    'utf8'
  )
  
  /**
   * We are replacing mustache-esque markup with the
   * needed values. These values _must_ be strings
   */
  const replaced = file
    .replace('{{app}}', app)
    .replace('{{links}}', linkTags)
    .replace('{{styles}}', `
      ${styleTags}
      <style id="jss-server-side">${css}</style>
    `)
    .replace('{{preloadedstate}}', JSON.stringify(store.getState()).replace(
      /</g,
      '\\u003c'
    ))
    .replace('{{scripts}}', scriptTags)
  
  /**
   * We are going to set the response body to be the string
   * that we have created by replacing the needed values
   */
  ctx.body = replaced
}

export default ssr
