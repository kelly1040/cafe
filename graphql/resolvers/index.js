const bcrypt = require('bcryptjs');

const Product = require('../../models/product');
const User = require('../../models/user');

module.exports = {
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
    users: () => {
        return User.find().then(
            users => {
                return users.map(user => {
                    return {...user._doc, _id: user.id, password: null};
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
}};