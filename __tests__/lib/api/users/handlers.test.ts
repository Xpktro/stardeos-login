import { listUsers, createUser } from 'lib/api/users/handlers'

describe('User handlers', () => {
  describe('listUsers', () => {
    it('responds as expected', async () => {
      const toArray = jest.fn()
      const mockCollection = {
        find: jest.fn().mockReturnValue({ toArray }),
      }

      const mockResponse = {
        status: jest.fn().mockReturnValue({ json: jest.fn() }),
      }
      await listUsers(null as any, mockResponse as any, mockCollection as any)

      expect(mockCollection.find).toHaveBeenCalled()
      expect(toArray).toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(200)
    })
  })

  describe('createUser', () => {
    it('responds as expected with valid schema', async () => {
      // Schema has been tested already, this will test
      // the boilerplate
      const mockRequest = {
        body: {
          fullName: 'Admin',
          username: 'admin',
          email: 'admin@stardeos.com',
          birthday: '1990-01-01',
          password: 'test',
          termsAgreed: true,
        },
      }
      const json = jest.fn()
      const mockResponse = {
        status: jest.fn().mockReturnValue({ json }),
      }

      const mockCollection = {
        find: jest
          .fn()
          .mockReturnValue({ count: jest.fn().mockResolvedValue(0) }),
        insertOne: jest.fn().mockReturnValue({ insertedId: '_id' }),
      }

      await createUser(
        mockRequest as any,
        mockResponse as any,
        mockCollection as any
      )

      expect(json).toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(201)
    })

    it('responds as expected with invalid schema', async () => {
      const mockRequest = {
        body: {
          fullName: 'Admin',
          username: 'admin',
          email: 'admin@stardeos.com',
          birthday: '2020-01-01',
          password: 'test',
          termsAgreed: true,
        },
      }
      const json = jest.fn()
      const mockResponse = {
        status: jest.fn().mockReturnValue({ json }),
      }

      const mockCollection = {
        find: jest
          .fn()
          .mockReturnValue({ count: jest.fn().mockResolvedValue(0) }),
      }

      await createUser(
        mockRequest as any,
        mockResponse as any,
        mockCollection as any
      )

      expect(json).toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(400)
    })
  })
})
