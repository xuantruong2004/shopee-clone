import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import userApi, { bodyUpdateProfile } from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { AppContext } from 'src/contexts/app.context'
import { setProfileToLS } from 'src/utils/auth'
import { UserSchema, userSchema } from 'src/utils/rules'
import DateSelect from '../../components/DateSelect'
const srcApi = 'https://api-ecom.duthanhduoc.com/images/'

type FormData = Pick<UserSchema, 'name' | 'address' | 'date_of_birth' | 'avatar' | 'phone'>
const profileSchema = userSchema.pick(['name', 'address', 'phone', 'avatar', 'date_of_birth'])
export default function Profile() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { setProfile } = useContext(AppContext)
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : ''
  }, [file])
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userApi.getProfile()
  })
  const profile = profileData?.data.data

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })
  console.log(profile)
  useEffect(() => {
    if (profile) {
      // console.log( new Date(profile?.date_of_birth))
      setValue('name', profile?.name || '')
      setValue('phone', profile?.phone || '')
      setValue('address', profile?.address || '')
      setValue('avatar', profile?.avatar || '')
      setValue('date_of_birth', profile?.date_of_birth ? new Date(profile?.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])

  const updateProfileMutation = useMutation({
    mutationFn: (body: bodyUpdateProfile) => userApi.updateProfile(body)
  })
  const updateAvatarMutation = useMutation(userApi.uploadAvatar)

  const onSubmit = handleSubmit(async (data) => {
    // console.log(data)
    try {
      if (file) {
        const form = new FormData()
        form.append('image', file)
        await updateAvatarMutation.mutateAsync(form, {
          onSuccess: (data) => {
            console.log('image', data.data.data)
            setValue('avatar', srcApi + data.data.data)
          }
        })
      }
      await updateProfileMutation.mutateAsync(
        { ...data, date_of_birth: data.date_of_birth?.toISOString() },
        {
          onSuccess: (data) => {
            refetch()
            toast.success(data.data.message)
            setProfile(data.data.data)
            setProfileToLS(data.data.data)
          }
        }
      )
    } catch (error) {
      // if (isAxiosUnprocessableEntity<ErrorResponseApi<FormData>>(error)) {
      //   const formError = error.response?.data.data
      //   if (formError) {
      //     Object.keys(formError).forEach((key) => {
      //       // setError(key as keyof FormData, {
      //       //   message: formError[key as keyof FormData],
      //       //   type: 'Server'
      //       // })
      //     })
      //   }
      // }
    }
  })
  const avatar = watch('avatar')
  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const image = event.target?.files?.[0]
    setFile(image)
  }
  const handleUpload = () => {
    fileInputRef.current?.click()
  }
  return (
    <div className=' rounded-sm bg-white px-7 pb-10 pt-5 shadow'>
      <div className=' text-lg font-medium capitalize'>Hồ sơ của tôi</div>
      <div className=''>Quản lý thông tin bảo mật của tài khoản</div>
      <hr className='my-4 h-[1px] w-full bg-gray-200' />
      <form className='flex flex-col-reverse gap-6 md:flex-row md:items-start' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow pr-12 md:mt-0'>
          <div className='flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Email</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <div className='pt-3 text-gray-700'>{profile?.email}</div>
            </div>
          </div>
          <div className='mt-1 flex flex-col flex-wrap sm:mt-6 sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Tên</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                register={register}
                errorMessage={errors.name?.message}
                name='name'
                placeholder=''
              />
            </div>
          </div>
          <div className='mt-1 flex flex-col flex-wrap sm:mt-2 sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Số điện thoại</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <InputNumber
                    classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    errorMessage={errors.phone?.message}
                    {...field}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
          <div className='mt-1 flex flex-col flex-wrap sm:mt-2 sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>địa chỉ</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='px-3 py-2 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                register={register}
                errorMessage={errors.address?.message}
                name='address'
                placeholder=''
              />
            </div>
          </div>
          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => (
              <DateSelect errorMessage={errors.date_of_birth?.message} value={field.value} onChange={field.onChange} />
            )}
          />
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'></div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Button type='submit' className='rounded bg-orange px-6 py-3 text-white hover:opacity-90'>
                Lưu
              </Button>
            </div>
          </div>
        </div>
        <div className='md:w-72` flex h-full justify-center md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center pl-6'>
            <div className='my-5 h-24 w-24 overflow-hidden rounded-full'>
              <img className='h-full w-full object-cover' src={previewImage || avatar} alt='truongxuan' />
            </div>
            <input
              type='file'
              accept='.jpg,.jpeg,.png'
              onChange={handleChangeImage}
              ref={fileInputRef}
              className='hidden'
            />
            <Button
              onClick={handleUpload}
              type='button'
              className='rounded border border-gray-300 px-4 py-2 text-black hover:bg-gray-100/50'
            >
              Chọn Ảnh
            </Button>
            <div className='mt-2 text-center'>Dụng lượng file tối đa 1 MB </div>
            <div className='text-center'>Định dạng:.JPEG, .PNG</div>
          </div>
        </div>
      </form>
    </div>
  )
}
