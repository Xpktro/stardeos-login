import type { NextPage } from 'next'
import Head from 'next/head'

import Login from 'components/Login'

import styles from 'styles/Home.module.scss'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Stardeos - Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Login />
    </div>
  )
}

export default Home
