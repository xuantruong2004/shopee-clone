import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import userApi, { bodyUpdateProfile } from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { ErrorResponseApi } from 'src/type/utils.type'
import { UserSchema, userSchema } from 'src/utils/rules'
import { isAxiosUnprocessableEntity } from 'src/utils/utils'

type FormData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>
const profileSchema = userSchema.pick(['password', 'new_password', 'confirm_password'])

export default function ChangePassword() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    }
    resolver: yupResolver(profileSchema)
  })
  const updateProfileMutation = useMutation({
    mutationFn: (body: bodyUpdateProfile) => userApi.updateProfile(body)
  })
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']))

      toast.success(res.data.message)
    } catch (error) {
      console.log(error)
      if (isAxiosUnprocessableEntity<ErrorResponseApi<FormData>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'Server'
            })
          })
        }
      }
    }
  })
  return (
    <div className=' rounded-sm bg-white px-7 pb-10 pt-5 shadow'>
      <div className=' text-lg font-medium capitalize'>Hồ sơ của tôi</div>
      <div className=''>Quản lý thông tin bảo mật của tài khoản</div>
      <hr className='my-4 h-[1px] w-full bg-gray-200' />
      <form className='flex flex-col gap-6  ' onSubmit={onSubmit}>
        <div className='mt-1 flex flex-col flex-wrap sm:mt-6 sm:flex-row'>
          <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Nhap mat khau cu</div>
          <div className='sm:w-[80%] sm:pl-5'>
            <Input
              type='password'
              classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
              register={register}
              className=' relative w-[300px]'
              errorMessage={errors.password?.message}
              name='password'
              placeholder=''
            />
          </div>
        </div>

        <div className='mt-1 flex flex-col flex-wrap sm:mt-2 sm:flex-row'>
          <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'> Nhap mat khau moi</div>
          <div className='sm:w-[80%] sm:pl-5'>
            <Input
              classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
              type='password'
              className=' relative w-[300px]'
              register={register}
              errorMessage={errors.new_password?.message}
              name='new_password'
              placeholder=''
            />
          </div>
        </div>
        <div className='mt-1 flex flex-col flex-wrap sm:mt-2 sm:flex-row'>
          <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'> Nhap mat lai khau moi</div>
          <div className='sm:w-[80%] sm:pl-5'>
            <Input
              classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
              type='password'
              className=' relative w-[300px]'
              register={register}
              errorMessage={errors.confirm_password?.message}
              name='confirm_password'
              placeholder=''
            />
          </div>
        </div>

        <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
          <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'></div>
          <div className='sm:w-[80%] sm:pl-5'>
            <Button type='submit' className='rounded bg-orange px-6 py-3 text-white hover:opacity-90'>
              Lưu
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
