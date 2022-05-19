import App from './App'
import 'dotenv/config'

(async () => {
  const app = new App()
  await app.main()
})()
