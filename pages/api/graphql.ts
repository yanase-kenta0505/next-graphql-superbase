import { ApolloServer, gql } from "apollo-server-micro";
import { NextApiRequest, NextApiResponse } from "next";
// import { ApolloServer } from "apollo-server-express";

const typeDefs = gql`
type User {
  id: ID!
  name: String!
  email: String
}
type Query {
  hello: String
  users: [User]
}
`

const users = [
  { id: '1', name: 'Jone Doe', email: 'jone@test.com'},
  { id: '2', name: 'jane Doe', email: 'jane@test.com'}
]

const resolvers = {
  Query: {
    hello: () => 'hello world',
    users: () => users
  }
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers
})

const startServer = apolloServer.start()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://studio.apollographql.com'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-with, Content-Type, Accept'
  )
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }

  await startServer
  await apolloServer.createHandler({
    path: '/api/graphql'
  })(req,res)
}

export const config = {
  api: {
    bodyParser: false
  }
}