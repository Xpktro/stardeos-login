import type { Collection } from 'mongodb'
import * as Yup from 'yup'
import sub from 'date-fns/sub'

const userSchema = (collection: Collection) =>
  Yup.object({
    fullName: Yup.string().required('Required'),
    username: Yup.string()
      .matches(/[\w\.\-]+/i, 'Must not contain invalid characters')
      .required('Required')
      .test(
        'unique',
        'Username taken',
        async (username) => (await collection.find({ username }).count()) === 0
      ),
    email: Yup.string()
      .email()
      .required('Required')
      .test(
        'unique',
        'Email already in use',
        async (email) => (await collection.find({ email }).count()) === 0
      ),
    birthday: Yup.date()
      .min(sub(new Date(), { years: 90 }), "Can't be older than 90")
      .max(sub(new Date(), { years: 18 }), "Can't be younger than 18")
      .required('Required'),
    password: Yup.string().required('Required'),
    termsAgreed: Yup.bool()
      .oneOf([true], 'Must accept terms')
      .required('Required'),
  })

export default userSchema
