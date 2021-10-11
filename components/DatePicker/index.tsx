import React from 'react'
import { useField } from 'formik'
import sub from 'date-fns/sub'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import styles from './styles.module.scss'

const DatePicker: React.FC<{
  name: string
  placeholder: string
  disabled: boolean
}> = ({ children, placeholder, disabled, ...props }) => {
  const [{ value }, meta, { setValue, setTouched }] = useField({
    ...props,
  })

  return (
    <>
      <ReactDatePicker
        name={props.name}
        customInput={
          <input data-testid={`datepicker-${props.name}`} type="text" />
        }
        className={styles.picker}
        calendarClassName={styles.calendar}
        showPopperArrow={false}
        placeholderText={placeholder}
        dateFormat="yyyy-MM-dd"
        dateFormatCalendar="MMMM"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        minDate={sub(new Date(), { years: 90 })}
        maxDate={sub(new Date(), { years: 18 })}
        selected={value}
        onChange={(date) => setValue(date)}
        onBlur={() => setTouched(true)}
        disabled={disabled}
      />
      {meta.touched && meta.error && <span>{meta.error}</span>}
    </>
  )
}

export default DatePicker
