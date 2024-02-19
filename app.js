const express = require('express');
const bodyParser = require('body-parser');
const  graphqlHttp  = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const getSchemas = require('./graphql/schema');

const Product = require('./models/product');
const User = require('./models/user');
const cors = require('cors');

// Create express app 
const app = express();

app.use(cors());

const products = [];

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    // schema
    schema: getSchemas,
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
        },
        updateProductQuantity: (args) => {
            return Product.findById(args.id).then(product => {
                if (!product) {
                    throw new Error('Product not found');
                }
                product.quantity = args.quantityUpdate.quantity;
                return product.save();
            }).then(result => { 
                return {...result._doc, _id: result.id};
            }
            ).catch(err => {
                console.log(err);
                throw err;
            });
        },
        createUser: (args) => {
            return User.findOne({userName: args.userInput.userName}).then(user => {
                if (user) {
                    throw new Error('User exists already');
                }
                return bcrypt.hash(args.userInput.password, 12)
            })
            .then(hashedPassword => {
                const user = new User({
                    userName: args.userInput.userName,
                    password: hashedPassword
                });
                return user.save();
            })
            .then(result => {
                return {...result._doc, password: null, _id: result.id};
            })
            .catch(err => {
                throw err;
            });
        },
    },
    graphiql: true
}));


mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}
@atlascluster.re2m0ox.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
.then(() => {
    app.listen(3001);
})
.catch(err => {
    console.log(err);
});