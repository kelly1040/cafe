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
        
        input ProductInput {
            name: String!
            description: String!
            minQuantity: Float!
            quantity: Float!
            unit: String!
            category: String
        }

        input ProductQuantityUpdate {
            quantity: Float!
        }

        input UserInput {
            username: String!
            password: String!
        }
    
        input RequiredQuantity {
            getQuantity: Float!
        }

        input LoginInput {
            username: String!
            password: String!
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
            userLogin(loginInput: LoginInput): User
        }

        schema {
            query: RootQuery,
            mutation: RootMutation
        }
    `)