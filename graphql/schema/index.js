const { buildSchema } = require('graphql');

module.exports = buildSchema(`
        type Product {
            _id: ID!
            name: String!
            description: String!
            minQuantity: Float!
            quantity: Float!
            unit: String!
            category: String
        }

        type User {
            _id: ID!
            username: String!
            password: String!
            token: String
        }
        
        type AuthPayload {
            user: User
            errors: [Error]
        }

        type Error {
            message: String!
            code: String
          }
        
          input UserInput {
            username: String!
            password: String!
          }

        input ProductInput {
            name: String!
            description: String!
            minQuantity: Float!
            quantity: Float!
            unit: String!
            category: String
        }

        input ProductUpdateInput {
            name: String
            description: String
            minQuantity: Float
            quantity: Float
            unit: String
            category: String
        }

        input ProductQuantityUpdate {
            quantity: Float!
        }

        type RootQuery {
            products: [Product!]!
            getShoppingList: [Product]!
            users: [User]!
        }

        type RootMutation {
            createProduct(productInput: ProductInput): Product
            createUser(userInput: UserInput): User
            updateProductQuantity(id: ID!, quantityUpdate: ProductQuantityUpdate): Product
            updateProduct(id: ID!, productUpdateInput: ProductUpdateInput): Product
            loginUser(userInput: UserInput): AuthPayload
            deleteProduct(id:ID!): Boolean
        }

        schema {
            query: RootQuery,
            mutation: RootMutation
        }
    `)