import env from 'getenv'

import Log from './Log'
import Server from './server'

const port = env.int('PORT', 5040)

const instance = Server.listen(port, () => {
  Log.trace({ port })
})

process.on('unhandledError', err => {
  instance.close(() => {
    Log.fatal({ err })
    process.exit(1)
  })
})

process.on('uncaughtException', err => {
  process.emit('unhandledError' as any, err as any)
})

process.on('unhandledRejection', err => {
  process.emit('unhandledError' as any, err as any)
})