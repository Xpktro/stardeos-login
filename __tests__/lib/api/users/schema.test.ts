import userSchema from 'lib/api/users/schema'

const collectionMock = (n: number) => ({
  find: jest.fn().mockReturnValue({ count: jest.fn().mockResolvedValue(n) }),
})

// Once again we're not responsible to test Yup behavior
// but we can sanity-check specific schema validatio scenarios
describe('userSchema', () => {
  describe('positive cases', () => {
    test('validates correct information', async () => {
      const schema = userSchema(collectionMock(0) as any)
      await expect(
        schema.validate(
          {
            fullName: 'Admin',
            username: 'admin',
            email: 'admin@stardeos.com',
            birthday: '1990-01-01',
            password: 'test',
            termsAgreed: true,
          },
          { abortEarly: false }
        )
      ).resolves.toBeTruthy()
    })
  })

  describe('negative cases', () => {
    test('required fields', async () => {
      const schema = userSchema(collectionMock(0) as any)
      await expect(
        schema.validate(
          {
            fullName: '',
            username: '',
            email: '',
            password: '',
          },
          { abortEarly: false }
        )
      ).rejects.toBeTruthy()
    })

    test('invalid email', async () => {
      const schema = userSchema(collectionMock(0) as any)
      await expect(
        schema.validate(
          {
            fullName: 'Admin',
            username: 'admin',
            email: 'admin@stardeos',
            birthday: '1990-01-01',
            password: 'test',
            termsAgreed: true,
          },
          { abortEarly: false }
        )
      ).rejects.toBeTruthy()
    })

    test('invalid username', async () => {
      const schema = userSchema(collectionMock(0) as any)
      await expect(
        schema.validate(
          {
            fullName: 'Admin',
            username: 'not a val!d username?',
            email: 'admin@stardeos',
            birthday: '1990-01-01',
            password: 'test',
            termsAgreed: true,
          },
          { abortEarly: false }
        )
      ).rejects.toBeTruthy()
    })

    test('near date', async () => {
      const schema = userSchema(collectionMock(0) as any)
      await expect(
        schema.validate(
          {
            fullName: 'Admin',
            username: 'admin',
            email: 'admin@stardeos.com',
            birthday: '2020-01-01',
            password: 'test',
            termsAgreed: true,
          },
          { abortEarly: false }
        )
      ).rejects.toBeTruthy()
    })

    test('far date', async () => {
      const schema = userSchema(collectionMock(0) as any)
      await expect(
        schema.validate(
          {
            fullName: 'Admin',
            username: 'admin',
            email: 'admin@stardeos.com',
            birthday: '1901-01-01',
            password: 'test',
            termsAgreed: true,
          },
          { abortEarly: false }
        )
      ).rejects.toBeTruthy()
    })

    test('duplicate records', async () => {
      const schema = userSchema(collectionMock(1) as any)
      await expect(
        schema.validate(
          {
            fullName: 'Admin',
            username: 'admin',
            email: 'admin@stardeos.com',
            birthday: '1990-01-01',
            password: 'test',
            termsAgreed: true,
          },
          { abortEarly: false }
        )
      ).rejects.toBeTruthy()
    })
  })
})
