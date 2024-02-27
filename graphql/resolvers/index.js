const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Product = require('../../models/product');
const User = require('../../models/user');
const { GraphQLError } = require('graphql');

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
    updateProduct:(args) => {
        return Product.findById(args.id).then(product => {
            if (!product) {
                throw new Error('Product not found');
            }
            if (args.productUpdateInput.name != undefined){
                product.name = args.productUpdateInput.name
            }
            if (args.productUpdateInput.description != undefined){
                product.description = args.productUpdateInput.description
            }
            if (args.productUpdateInput.quantity != undefined){
                product.quantity = args.productUpdateInput.quantity
            }
            if (args.productUpdateInput.minQuantity != undefined){
                product.minQuantity = args.productUpdateInput.minQuantity
            }
            if (args.productUpdateInput.unit != undefined){
                product.unit = args.productUpdateInput.unit
            }
            return product.save();
            }).then(result => { 
                return {...result._doc, _id: result.id};
            }
            ).catch(err => {
                console.log(err);
                throw err;
            });            
    },
    deleteProduct: (args) => {
        const productId = args.id;
        if (!productId) {
          throw new Error("Invalid or missing product ID");
        }
        return Product.findByIdAndDelete({ _id: productId })
          .then(() => true)
          .catch((err) => {
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
    loginUser: async (args) => {
        try {
          const user = await User.findOne({ username: args.userInput.username });
          if (!user) {
            throw new GraphQLError('User does not exist', {
                extensions: {
                  code: 'BAD_USER_INPUT',
                },
              });
          }
          const doMatch = await bcrypt.compare(args.userInput.password, user.password);
          if (!doMatch) {
            throw new GraphQLError('Password is incorrect', {
              extensions: {
                code: 'BAD_USER_INPUT',
              },
            });
          }
          const token = jwt.sign(
            { userId: user._id, username: user.username },
            'somesupersecretkey',
            { expiresIn: '10h' }
          );
          user.token = token;
          return {
            user: {
              ...user._doc,
              _id: user.id,
              password: null,
            },
            errors: [],
          };
        } catch (err) {
          console.error(err);
          return {
            user: null,
            errors: [
              {
                message: err.message || 'An error occurred during login',
                code: err.extensions.code || 'INTERNAL_SERVER_ERROR',
              },
            ],
          };
        }
      },
}