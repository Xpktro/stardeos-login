import React from 'react'
import styles from './styles.module.scss'

const Layout: React.FC = ({ children }) => (
  <div className={styles.container}>{children}</div>
)

export default Layout
