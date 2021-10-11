import type { NextApiRequest, NextApiResponse } from 'next'
import type { Collection } from 'mongodb'

import userSchema from './schema'

export const listUsers = async (
  _: NextApiRequest,
  res: NextApiResponse,
  collection: Collection
) => res.status(200).json(await collection.find().toArray())

export const createUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
  collection: Collection
) => {
  const schema = userSchema(collection)
  return schema
    .validate(req.body, { abortEarly: false })
    .then(async (validData) =>
      // XXX: Naive insert OP
      res.status(201).json({
        _id: (await collection.insertOne(validData)).insertedId,
        ...validData,
      })
    )
    .catch((e) =>
      res.status(400).json({
        errors: e.inner.map(
          ({ path, message }: { path: string; message: string }) => ({
            name: path,
            message,
          })
        ),
      })
    )
}
