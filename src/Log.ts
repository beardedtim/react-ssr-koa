import pino from 'pino'

export default pino({
  name: 'TWWL',
  level: 'trace',
  serializers: pino.stdSerializers,
})
