require('dotenv').config();
const http = require('http');
const app = require('./app');
const { PORT = 4000 } = process.env;

const server = http.createServer(app);

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`CICR backend running on http://localhost:${PORT}`);
});
