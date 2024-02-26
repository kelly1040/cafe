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
        return Product.findOne({ name: args.productInput.name }).then(product => {
            if (product) {
                throw new Error('Product exists already');
            }
            const newProduct = new Product({
                name: args.productInput.name,
                description: args.productInput.description,
                minQuantity: args.productInput.minQuantity,
                quantity: +args.productInput.quantity,
                unit: args.productInput.unit,
                category: args.productInput.category
            });
        
            return newProduct.save().then(result => {
                return { ...result._doc, _id: newProduct.id };
            }).catch(err => {
                console.log(err);
                throw err;
            });
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
    userLogin: (args) => {
        let foundUser;
    
        return User.findOne({ username: args.userInput.username })
            .then((user) => {
                if (!user) {
                    throw new Error('User does not exist');
                }
    
                foundUser = user;
    
                return bcrypt.compare(args.userInput.password, user.password);
            })
            .then((doMatch) => {
                if (!doMatch) {
                    throw new Error('Password is incorrect');
                }
    
                const token = jwt.sign(
                    { userId: foundUser._id, username: foundUser.username },
                    'somesupersecretkey',
                    { expiresIn: '10h' }
                );
    
                foundUser.token = token;
    
                return { ...foundUser._doc, _id: foundUser.id };
            })
            .catch((err) => {
                console.error(err);
                throw err;
            });
    },
}