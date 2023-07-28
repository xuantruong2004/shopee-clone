import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import authApi from 'src/apis/auth.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponseApi } from 'src/type/utils.type'
import { Schema, schema } from 'src/utils/rules'
import { isAxiosUnprocessableEntity } from 'src/utils/utils'

type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>
const loginSchema = schema.pick(['email', 'password', 'confirm_password'])

export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        console.log(data)
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntity<ErrorResponseApi<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className=' bg-orange'>
      <div className=' container'>
        <div className='grid grid-cols-1 py-10 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className=' lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='mb-6 text-2xl'>Đăng ký</div>
              <Input
                type='email'
                name='email'
                register={register}
                placeholder='Email'
                className='mt-2'
                errorMessage={errors.email?.message}
              />

              <Input
                type='password'
                name='password'
                register={register}
                placeholder='Password'
                className='mt-2'
                errorMessage={errors.password?.message}
                autoComplete='on'
              />
              <Input
                type='password'
                name='confirm_password'
                register={register}
                placeholder='Confirm password'
                className='mt-2'
                errorMessage={errors.confirm_password?.message}
                autoComplete='on'
              />

              <div className='mt-3'>
                <Button
                  type='submit'
                  className='flex w-full cursor-pointer items-center justify-center rounded-sm bg-orange py-4 text-center uppercase text-white hover:opacity-90'
                  isLoading={registerAccountMutation.isLoading}
                  disabled={registerAccountMutation.isLoading}
                >
                  Đăng kí
                </Button>
              </div>
              <div className='mt-8'>
                <div className='text-center'>
                  <span className='text-slate-400'>Bạn đã có tài khoản?</span>
                  <Link to={path.login} className=' ml-1 text-orange'>
                    Đăng nhập
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
