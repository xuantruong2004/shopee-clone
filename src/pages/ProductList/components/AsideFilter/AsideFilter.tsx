import React, { useEffect, useState } from 'react'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import path from 'src/constants/path'
import { category } from 'src/type/category.type'
import { QueryConfig } from '../../ProductList'
import useQueryParams from 'src/hooks/useQueryParams'
import InputNumber from 'src/components/InputNumber'
import { Controller, useForm } from 'react-hook-form'
import { schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import RatingStart from '../RatingStart'
import { omit } from 'lodash'

interface Props {
  categoryList: category[]
  queryConfig: QueryConfig
}

type FormData = {
  price_min: string
  price_max: string
}

const priceSchema = schema.pick(['price_min', 'price_max'])

export default function AsideFilter({ categoryList, queryConfig }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceSchema),
    shouldFocusError: false
  })
  const queryParams: QueryConfig = useQueryParams()

  const navigate = useNavigate()
  const isActive = (value: string) => {
    return value === queryParams.category ? true : false
  }

  const handlerSortCategory = (id: string) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        category: id
      }).toString()
    })
  }

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_min: data.price_min,
        price_max: data.price_max
      }).toString()
    })
  })

  const handleRemoveAll = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['category', 'price_min', 'price_max', 'rating_filter'])).toString()
    })
  }

  return (
    <div className='py-4'>
      <Link to={path.home} className='flex items-center font-bold'>
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>

        <div className=''>TẤT CẢ DANH MỤC</div>
      </Link>
      <hr className=' my-3 h-[1px] bg-gray-300' />

      <ul>
        {categoryList &&
          categoryList.map((category) => (
            <li key={category._id} className=' py-1 pl-2 text-sm'>
              <button
                onClick={() => handlerSortCategory(category._id)}
                className={
                  isActive(category._id) ? ' relative px-2 font-semibold text-orange' : 'relative px-2 font-semibold'
                }
              >
                {isActive(category._id) && (
                  <svg viewBox='0 0 4 7' className='absolute left-[-10px] top-1 h-2 w-2 fill-orange'>
                    <polygon points='4 3.5 0 0 0 7' />
                  </svg>
                )}
                {category.name}
              </button>
            </li>
          ))}
      </ul>

      <Link to={path.home} className='mt-4 flex items-center font-bold uppercase'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='mr-3 h-4 w-3 fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        Bộ lọc tìm kiếm
      </Link>
      <hr className=' my-4 h-[1px] bg-gray-300' />
      <div className='my-5'>
        <div>Khoảng giá</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='₫ TỪ'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    classNameError='hidden'
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_max')
                    }}
                    value={field.value}
                    ref={field.ref}
                  />
                )
              }}
            />
            <div className='mx-2 mt-2 shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='₫ ĐẾN'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    classNameError='hidden'
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_min')
                    }}
                    value={field.value}
                    ref={field.ref}
                  />
                )
              }}
            />
          </div>
          <div className='my-2 text-xs text-red-600'>{errors.price_min?.message}</div>
          <Button className='my-4 flex w-full cursor-pointer items-center justify-center rounded-sm bg-orange py-2  text-center uppercase text-white hover:opacity-90'>
            ÁP DỤNG
          </Button>
        </form>
        <hr className=' my-4 h-[1px] bg-gray-300' />
        <div className='text-sm'>Đánh giá</div>
        <RatingStart queryConfig={queryConfig} />
        <div className='my-4 h-[1px] bg-gray-300' />
        <Button
          onClick={handleRemoveAll}
          className='my-4 flex w-full cursor-pointer items-center justify-center rounded-sm bg-orange py-2  text-center uppercase text-white hover:opacity-90'
        >
          Xoá tất cả
        </Button>
      </div>
    </div>
  )
}
