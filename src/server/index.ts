import path from 'path'
import env from 'getenv'
import Koa from 'koa'
import Router from 'koa-router'
import KoaStatic from 'koa-static'
import logger from 'koa-pino-logger'
import cors from '@koa/cors'
import helmet from 'koa-helmet'

import Log from '../Log'
import DB from '../db'

import SSR from './ssr'

// BUILD_PATH is relative to final build, not local
// CODE OF INTEREST:
//
// This means that we need to build and keep the client assets
// if we want to be able to serve them from this server.
//
const BUILD_PATH = env.string('BUILD_PATH', path.resolve(__dirname, '..', 'client', 'static'))

interface Context {
  DB: typeof DB,
  Log: typeof Log
}

const server = new Koa<any, Context>()

/**
 * Anything we add to `server.context` will be
 * available in the route handler attached to
 * the ctx object
 */
server.context.Log = Log
server.context.DB = DB

const router = new Router<any, Context>()

/**
 * For any GET request to this router, serve
 * the SSR handler
 */
router.get('(.*)', SSR)

server
  .use(logger({ log: Log }))
  .use(cors())
  .use(helmet())

/**
 * If the node env is not production
 */
if (env.string('NODE_ENV', '') !== 'production') {
  /**
   * Serve static files from the BUILD_PATH
   */
  server.use(KoaStatic(BUILD_PATH))
}

/**
 * Attach this last so that other requests can be handled
 * before our catchall GET handler above
 */
server.use(router.routes())

export default server
