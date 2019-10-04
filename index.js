const express = require('express');
const routes = require('./routes');
const { config } = require('dotenv');

config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/v1', routes);

app.listen(port, () => console.log('Server now listening on port 5000'));
