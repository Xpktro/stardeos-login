import React from 'react'
import { useRouter } from 'next/router'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import sub from 'date-fns/sub'
import Image from 'next/image'

import logo from 'public/img/stardeos.png'
import Checkbox from 'components/Checkbox'
import DatePicker from 'components/DatePicker'

import styles from './styles.module.scss'

interface LoginFormFields {
  fullName: string
  username: string
  email: string
  birthday: string
  password: string
  passwordConfirm: string
  termsAgreed: boolean
}

const Login = () => {
  const router = useRouter()

  const initialValues: LoginFormFields = {
    fullName: '',
    username: '',
    email: '',
    birthday: '',
    password: '',
    passwordConfirm: '',
    termsAgreed: false,
  }

  return (
    <main className={styles.main}>
      <header className={styles.logo}>
        <Image src={logo} alt="logo" />
      </header>

      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          fullName: Yup.string().required('Required'),
          username: Yup.string()
            .matches(/[\w\.\-]+/i, 'Must not contain invalid characters')
            .required('Required'),
          email: Yup.string().email().required('Required'),
          birthday: Yup.date()
            .min(sub(new Date(), { years: 90 }), "Can't be older than 90")
            .max(sub(new Date(), { years: 18 }), "Can't be younger than 18")
            .required('Required'),
          password: Yup.string().required('Required'),
          passwordConfirm: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required'),
          termsAgreed: Yup.bool().oneOf([true], 'Must accept terms'),
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          const response = await fetch('/api/users/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values, null, 2),
          })

          if (response.status === 400) {
            const { errors } = await response.json()
            setErrors(
              errors.reduce(
                (
                  errorMap: object,
                  { name, message }: { name: string; message: string }
                ) => ({
                  ...errorMap,
                  [name]: message,
                }),
                {}
              )
            )
          }

          if (response.status === 201) {
            router.push('/results')
          }
          setSubmitting(false)
        }}
      >
        {(formik) => (
          <Form>
            <Field
              name="fullName"
              data-testid="fullName"
              placeholder="Full Name"
              disabled={formik.isSubmitting}
            />
            <span>
              <ErrorMessage name="fullName" className="error" />
            </span>

            <Field
              name="username"
              data-testid="username"
              placeholder="Username"
              disabled={formik.isSubmitting}
            />
            <span>
              <ErrorMessage name="username" />
            </span>

            <Field
              name="email"
              data-testid="email"
              type="email"
              placeholder="Email"
              disabled={formik.isSubmitting}
            />
            <span>
              <ErrorMessage name="email" />
            </span>

            <DatePicker
              name="birthday"
              placeholder="Birthday"
              disabled={formik.isSubmitting}
            />

            <Field
              name="password"
              data-testid="password"
              type="password"
              placeholder="Password"
              disabled={formik.isSubmitting}
            />
            <span>
              <ErrorMessage name="password" />
            </span>

            <Field
              name="passwordConfirm"
              data-testid="passwordConfirm"
              type="password"
              placeholder="Password confirmation"
              disabled={formik.isSubmitting}
            />
            <span>
              <ErrorMessage name="passwordConfirm" />
            </span>

            <Checkbox
              name="termsAgreed"
              disabled={formik.isSubmitting}
              data-testid="termsAgreed"
            >
              I Agree To Terms &amp; Conditions
            </Checkbox>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              data-testid="submit"
            >
              SIGN UP
            </button>
          </Form>
        )}
      </Formik>
    </main>
  )
}

export default Login
