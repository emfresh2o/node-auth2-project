require('dotenv').config();

const server = require('./api/server.js');

const PORT = process.env.PORT || 6500;

server.listen(PORT, () => {
  console.log(`\n** Server running on port ${PORT} **\n`);
});
