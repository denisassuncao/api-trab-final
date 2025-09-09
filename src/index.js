require('dotenv').config();
const { app } = require('./app');

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`API Funcionando em http://localhost:${PORT}`));
}
module.exports = { app };
