import { app } from './app'
import { env } from './env'

const port = env.PORT

try {
  app
    .listen({
      port,
    })
    .then((fullPath) => {
      console.log(`🚀HTTP Server Running on ${port} and path => ${fullPath}`)
    })
} catch (error) {
  console.log('err')
}
