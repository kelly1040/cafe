const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Product = require('../../models/product');
const User = require('../../models/user');

module.exports = CreateResolvers = {
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
    userLogin: () => {
        return User.findById(args.id).then(
            users => {
                return users.map(user => {
                    return {...user._doc, _id: user.id};
                });
            }
        ).catch(err => {
            console.log(err);
            throw err;
        })
    },
    getShoppingList: () => {
            return Product.find().then(
                products => {
                    return products
                    .filter(product => product.quantity < product.minQuantity)
                    .map(product => ({ ...product._doc, _id: product.id }));
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
            quantity: +args.productInput.quantity,
            unit: args.productInput.unit,
            category: args.productInput.category
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
        return User.findOne({username: args.userInput.username}).then(user => {
            if (user) {
                throw new Error('User exists already');
            }
            return bcrypt.hash(args.userInput.password, 12)
        })
        .then(hashedPassword => {
            const user = new User({
                username: args.userInput.username,
                password: hashedPassword,
            });
            return user.save();
        })
    },
}