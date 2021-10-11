import type { NextPage } from 'next'

const Results: NextPage = ({ users }: any) => (
  <table>
    <thead>
      <tr>
        <th>fullName</th>
        <th>username</th>
        <th>email</th>
        <th>birthday</th>
        <th>password</th>
        <th>termsAgreed</th>
      </tr>
    </thead>
    <tbody>
      {users.map(
        (
          {
            fullName,
            username,
            email,
            birthday,
            password,
            termsAgreed,
          }: { [key: string]: string },
          key: number
        ) => (
          <tr key={key}>
            <td>{fullName}</td>
            <td>{username}</td>
            <td>{email}</td>
            <td>{birthday}</td>
            <td>{password}</td>
            <td>{termsAgreed ? 'yes' : 'no'}</td>
          </tr>
        )
      )}
    </tbody>
  </table>
)

Results.getInitialProps = async (_: any) => {
  const res = await fetch('http://localhost:3000/api/users')
  const users = await res.json()
  return { users }
}

export default Results
