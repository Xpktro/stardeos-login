// TODO: Refactor MongoDB out
import type { NextApiRequest, NextApiResponse } from 'next'

import { connection, client } from 'lib/mongo'
import { listUsers, createUser } from 'lib/api/users/handlers'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connection
  const collection = client.db('stardeos').collection('users')

  const handlers: { [method: string]: Function } = {
    GET: listUsers,
    POST: createUser,
  }

  const handler = handlers[req.method!]
  return handler ? handler(req, res, collection) : res.status(405)
}
