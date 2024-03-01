const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const mongoose = require('mongoose');

const getSchemas = require('./graphql/schema');
const getResolvers = require('./graphql/resolvers');

const cors = require('cors');

// Create express app
const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHttp({
    // schema
    schema: getSchemas,
    // resolver functions
    rootValue: getResolvers,
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}
@atlascluster.re2m0ox.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3001);
  })
  .catch((err) => {
    console.log(err);
  });
