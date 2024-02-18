import { app } from './app'

const port = 3333

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
