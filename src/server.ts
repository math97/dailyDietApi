import { app } from './app'

const port = 3333

app
  .listen({
    port,
    host: 'localhost',
  })
  .then(() => {
    console.log(`🚀HTTP Server Running on ${port}`)
  })
