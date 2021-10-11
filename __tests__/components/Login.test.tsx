/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

global.fetch = jest.fn()

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
    }
  },
}))

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

// TODO: Next image module mapper is not working properly
jest.mock('next/image', () => {
  // eslint-disable-next-line react/display-name
  return () => <></>
})

import Login from 'components/Login'

describe('Login', () => {
  // XXX: Integration tests should be this specific
  describe('When renders', () => {
    it('shows complete field list', () => {
      render(<Login />)
      const names = [
        'fullName',
        'username',
        'email',
        'datepicker-birthday',
        'password',
        'passwordConfirm',
        'termsAgreed',
      ]
      names.forEach((name) =>
        expect(screen.getByTestId(name)).toBeInTheDocument()
      )
      expect(screen.getByTestId('submit')).toBeInTheDocument()
    })
  })

  describe('When filling the form', () => {
    // At the current stage, there's no place where major business
    // logic is being implemented. As testing third party libraries
    // is not our reposibility, we can at least test for minimum
    // schema correctness and basic submission.
    it('fails before submitting', async () => {
      const { getByTestId, getByText } = render(<Login />)

      userEvent.type(getByTestId('fullName'), 'John')
      userEvent.type(getByTestId('username'), 'admin')
      userEvent.type(getByTestId('email'), 'adminstardeos.com')
      userEvent.type(getByTestId('password'), 'qwerty123')
      userEvent.type(getByTestId('passwordConfirm'), 'not the same')

      userEvent.click(getByTestId('submit'))
      await waitFor(() => {
        expect(getByText(/must be a valid email/)).toBeInTheDocument()
        expect(getByText(/Passwords must match/)).toBeInTheDocument()
        expect(getByText(/Must accept terms/)).toBeInTheDocument()
        expect(getByTestId('submit')).toBeInTheDocument()
      })
    })

    it('submits a correct form', async () => {
      const fetch = global.fetch as any
      fetch.mockResolvedValueOnce({ status: 200 })
      const { getByTestId, getByText } = render(<Login />)
      userEvent.type(getByTestId('fullName'), 'John')
      userEvent.type(getByTestId('username'), 'admin')
      userEvent.type(getByTestId('email'), 'admin@stardeos.com')
      userEvent.type(getByTestId('datepicker-birthday'), '1990-01-01')
      userEvent.type(getByTestId('password'), 'password')
      userEvent.type(getByTestId('passwordConfirm'), 'password')
      fireEvent.click(getByTestId('termsAgreed'))

      userEvent.click(getByTestId('submit'))
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          '/api/users/',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining(
              JSON.stringify(
                {
                  fullName: 'John',
                  username: 'admin',
                  email: 'admin@stardeos.com',
                  birthday: '1990-01-01T05:00:00.000Z',
                  password: 'password',
                  passwordConfirm: 'password',
                  termsAgreed: true,
                },
                null,
                2
              )
            ),
          })
        )
      })
    })

    it('shows backend error messages', async () => {
      const fetch = global.fetch as any
      fetch.mockResolvedValueOnce({
        status: 400,
        json: () =>
          Promise.resolve({
            errors: [{ name: 'username', message: 'Already taken' }],
          }),
      })
      const { getByTestId, getByText } = render(<Login />)
      userEvent.type(getByTestId('fullName'), 'John')
      userEvent.type(getByTestId('username'), 'admin')
      userEvent.type(getByTestId('email'), 'admin@stardeos.com')
      userEvent.type(getByTestId('datepicker-birthday'), '1990-01-01')
      userEvent.type(getByTestId('password'), 'password')
      userEvent.type(getByTestId('passwordConfirm'), 'password')
      fireEvent.click(getByTestId('termsAgreed'))

      userEvent.click(getByTestId('submit'))

      await waitFor(() => {
        expect(getByText(/Already taken/)).toBeInTheDocument()
      })
    })
  })
})
