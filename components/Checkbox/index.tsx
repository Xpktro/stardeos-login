import React from 'react'
import { useField } from 'formik'

import styles from './styles.module.scss'

const Checkbox: React.FC<{ name: string; disabled: boolean }> = ({
  children,
  ...props
}) => {
  const [field, meta] = useField({ ...props, type: 'checkbox' })
  return (
    <>
      <div className={styles.checkboxInput}>
        <input type="checkbox" {...field} {...props} />
        {children}
      </div>
      {meta.touched && meta.error && <span>{meta.error}</span>}
    </>
  )
}

export default Checkbox
