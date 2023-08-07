import range from 'lodash/range'
import React, { useEffect, useMemo, useState } from 'react'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
  errorMessage?: string
}

export default function DateSelect({ onChange, value, errorMessage }: Props) {
  const [date, setDate] = useState({
    date: value?.getDate() || 1990,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1
  })
  const yearNow = useMemo(() => new Date().getFullYear(), [])

  useEffect(() => {
    setDate({
      date: value?.getDate() || 1990,
      month: value?.getMonth() || 0,
      year: value?.getFullYear() || 1
    })
  }, [value])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: valueGetForm, name } = event.target
    const newDate = {
      date: value?.getDate() || date.date,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: Number(valueGetForm)
    }
    setDate(newDate)
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
  }

  return (
    <div className='mt-1 flex flex-col flex-wrap sm:mt-2 sm:flex-row'>
      <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Ngày sinh</div>
      <div className='sm:w-[80%] sm:pl-5'>
        <div className='flex justify-between '>
          <select
            name='date'
            onChange={handleChange}
            className=' h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange'
            value={date.date}
          >
            <option disabled>Ngày</option>
            {range(1, 32).map((item) => (
              <option className='h-20 overflow-hidden' value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            onChange={handleChange}
            name='month'
            className=' h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange'
            value={date.month}
          >
            <option disabled>Tháng</option>
            {range(0, 12).map((item) => (
              <option value={item} key={item}>
                {item + 1}
              </option>
            ))}
          </select>
          <select
            onChange={handleChange}
            name='year'
            className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange'
            value={date.year}
          >
            <option disabled>Năm</option>
            {range(1900, yearNow + 1).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errorMessage}</div>
      </div>
    </div>
  )
}
