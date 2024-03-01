const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Product = require('../../models/product');
const User = require('../../models/user');
const { GraphQLError } = require('graphql');

module.exports = CreateResolvers = {
  getProducts: async () => {
    try {
      const products = await Product.find();
      return products.map((product) => {
        return { ...product._doc, _id: product.id };
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  getShoppingList: async () => {
    try {
      const products = await Product.find();
      return products
        .filter((product) => product.quantity < product.minQuantity)
        .map((product) => ({ ...product._doc, _id: product.id }));
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createProduct: async (args) => {
    try {
      const product = await Product.findOne({ name: args.productInput.name });
      if (product) {
        throw new GraphQLError('Product already exists', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        });
      }
      const newProduct = new Product({
        name: args.productInput.name,
        description: args.productInput.description,
        minQuantity: args.productInput.minQuantity,
        quantity: +args.productInput.quantity,
        unit: args.productInput.unit,
        category: args.productInput.category
      });
      await newProduct.save();
      return {
        product: { ...newProduct._doc, _id: newProduct.id },
        errors: []
      };
    } catch (err) {
      console.log(err);
      return {
        user: null,
        errors: [
          {
            message: err.message || 'An error occurred',
            code:
              err.extensions && err.extensions.code
                ? err.extensions.code
                : 'INTERNAL_SERVER_ERROR'
          }
        ]
      };
    }
  },
  updateProductQuantity: async (args) => {
    try {
      product = await Product.findById(args.id);
      if (!product) {
        throw (
          (new GraphQLError('Product not found'),
          {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })
        );
      }
      product.quantity = args.quantityUpdate.quantity;
      await product.save();
      return {
        product: { ...product._doc, _id: product.id },
        errors: []
      };
    } catch (err) {
      return {
        product: null,
        errors: [
          {
            message: err.message || 'An error occurred',
            code: err.extensions.code || 'INTERNAL_SERVER_ERROR'
          }
        ]
      };
    }
  },
  updateProduct: async (args) => {
    try {
      const product = await Product.findById(args.id);
      if (!product) {
        throw (
          (new GraphQLError('Product not found'),
          {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })
        );
      }
      if (args.productUpdateInput.name != undefined) {
        product.name = args.productUpdateInput.name;
      }
      if (args.productUpdateInput.description != undefined) {
        product.description = args.productUpdateInput.description;
      }
      if (args.productUpdateInput.quantity != undefined) {
        product.quantity = args.productUpdateInput.quantity;
      }
      if (args.productUpdateInput.minQuantity != undefined) {
        product.minQuantity = args.productUpdateInput.minQuantity;
      }
      if (args.productUpdateInput.unit != undefined) {
        product.unit = args.productUpdateInput.unit;
      }
      await product.save();
      return {
        product: { ...product._doc, _id: product.id },
        errors: []
      };
    } catch (err) {
      return {
        product: null,
        errors: [
          {
            message: err.message || 'An error occurred',
            code: err.extensions.code || 'INTERNAL_SERVER_ERROR'
          }
        ]
      };
    }
  },
  deleteProduct: async (args) => {
    const productId = args.id;
    if (!productId) {
      throw new Error('Invalid or missing product ID');
    }
    try {
      await Product.findByIdAndDelete(productId);
      return true;
    } catch (err) {
      console.log(err);
      throw new Error('Error deleting product');
    }
  },
  createUser: async (_, args) => {
    const existingUser = await User.findOne({
      username: args.userInput.username
    });
    if (existingUser) {
      throw new Error('User exists already');
    }
    const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
    const user = new User({
      username: args.userInput.username,
      password: hashedPassword
    });
    await user.save();
    return user;
  },
  loginUser: async (args) => {
    try {
      const user = await User.findOne({ username: args.userInput.username });
      if (!user) {
        throw new GraphQLError('User does not exist', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        });
      }
      const doMatch = await bcrypt.compare(
        args.userInput.password,
        user.password
      );
      if (!doMatch) {
        throw new GraphQLError('Password is incorrect', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
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
          password: null
        },
        errors: []
      };
    } catch (err) {
      console.error(err);
      return {
        user: null,
        errors: [
          {
            message: err.message || 'An error occurred during login',
            code: err.extensions.code || 'INTERNAL_SERVER_ERROR'
          }
        ]
      };
    }
  }
};
