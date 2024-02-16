const express = require('express');
const bodyParser = require('body-parser');
const  graphqlHttp  = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Product = require('./models/product');

// Create express app 
const app = express();

const products = [];

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Product {
            _id: ID!
            name: String!
            description: String!
            minQuantity: Int!
            quantity: Float!
        }
        
        input ProductInput {
            name: String!
            description: String!
            minQuantity: Int!
            quantity: Float!
        }

        type RootQuery {
            products: [Product!]!
        }

        type RootMutation {
            createProduct(productInput: ProductInput): Product
        }

        schema {
            query: RootQuery,
            mutation: RootMutation
        }
    `),
    // resolver functions
    rootValue: {
        products: () => {
            return Product.find().then(
                products => {
                    return products.map(product => {
                        return {...product._doc, _id: product.id};
                    });
                }
            ).catch(err => {
                console.log(err);
                throw err;
            })
        },
        createProduct: (args) => {
            const product = new Product({
                name: args.productInput.name,
                description: args.productInput.description,
                minQuantity: args.productInput.minQuantity,
                quantity: +args.productInput.quantity
            });
            return  product.save().then(result => {
                console.log(result);
                return {...result._doc, _id: product.id};
            }).catch(err => {
                console.log(err);
                throw err;
            });
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}
@atlascluster.re2m0ox.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
.then(() => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});