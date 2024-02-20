const { buildSchema } = require('graphql');

module.exports = buildSchema(`
        type Product {
            _id: ID!
            name: String!
            description: String!
            minQuantity: Int!
            quantity: Float!
        }

        type User {
            _id: ID!
            userName: String!
            password: String
        }
        
        input ProductInput {
            name: String!
            description: String!
            minQuantity: Int!
            quantity: Float!
        }

        input ProductQuantityUpdate {
            quantity: Float!
        }

        input UserInput {
            userName: String!
            password: String!
        }
    
        input RequiredQuantity {
            getQuantity: Float!
        }


        type RootQuery {
            products: [Product!]!
            getShoppingList: [Product]!
        }

        type RootMutation {
            createProduct(productInput: ProductInput): Product
            createUser(userInput: UserInput): User
            updateProductQuantity(id: ID!, quantityUpdate: ProductQuantityUpdate): Product
        }

        schema {
            query: RootQuery,
            mutation: RootMutation
        }
    `)