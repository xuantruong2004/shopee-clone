import { UseFormGetValues, type RegisterOptions } from 'react-hook-form'
import * as yup from 'yup'

type Rules = { [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions }
const handleConfirmPassword = (data: string) => {
  return yup
    .string()
    .required('Confirm Password là bắt buộc')
    .min(6, 'Độ dài password từ 5 - 160 kí tự')
    .max(160, 'Độ dài password từ 5 - 160 kí tự')
    .oneOf([yup.ref(data)], 'Nhập lại password cho đúng')
}
export const getRules = (getValues?: UseFormGetValues<any>): Rules => {
  return {
    email: {
      required: 'Email là bắt buộc',
      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email không đúng định dạng' },
      maxLength: {
        value: 160,
        message: 'Độ dài email từ 5 - 160 kí tự'
      },
      minLength: {
        value: 5,
        message: 'Độ dài email từ 5 - 160 kí tự'
      }
    },
    password: {
      required: 'password là bắt buộc',
      maxLength: {
        value: 160,
        message: 'Độ dài password từ 5 - 160 kí tự'
      },
      minLength: {
        value: 6,
        message: 'Độ dài password từ 5 - 160 kí tự'
      }
    },
    confirm_password: {
      required: 'password là bắt buộc',
      maxLength: {
        value: 160,
        message: 'Độ dài password từ 5 - 160 kí tự'
      },
      minLength: {
        value: 6,
        message: 'Độ dài password từ 5 - 160 kí tự'
      },
      validate:
        typeof getValues === 'function'
          ? (value) => getValues('password') === value || 'Nhập lại password cho đúng'
          : undefined
    }
  }
}

export const schema = yup
  .object({
    email: yup
      .string()
      .email('Email không đúng định dạng')
      .required('Email là bắt buộc')
      .min(5, 'Độ dài password từ 5 - 160 kí tự')
      .max(160, 'Độ dài password từ 5 - 160 kí tự'),
    password: yup
      .string()
      .required('Password là bắt buộc')
      .min(6, 'Độ dài password từ 5 - 160 kí tự')
      .max(160, 'Độ dài password từ 5 - 160 kí tự'),
    confirm_password: handleConfirmPassword('password'),
    price_min: yup.string().test({
      name: 'price-not-allowed',
      message: 'Vui long dieu chinh gia cho dung',
      test: function (value) {
        const price_min = value
        const { price_max } = this.parent
        if (price_min !== '' && price_max !== '') {
          return Number(price_max) >= Number(price_min)
        }
        return price_max !== '' || price_min !== ''
      }
    }),
    price_max: yup.string().test({
      name: 'price-not-allowed',
      message: 'Vui long dieu chinh gia cho dung',
      test: function (value) {
        const price_max = value
        const { price_min } = this.parent
        if (price_min !== '' && price_max !== '') {
          return Number(price_max) >= Number(price_min)
        }
        return price_min !== '' || price_max !== ''
      }
    }),
    name: yup.string().trim().required('Tên sản phẩm là bắt buộc')
  })
  .required()

export const userSchema = yup.object({
  name: yup.string().max(160, 'Độ dài tối đa la 160 ký tự'),
  phone: yup.string().max(20, 'Độ dài tối đa la 20 ký tự'),
  address: yup.string().max(160, 'Độ dài tối đa la 160 ký tự'),
  date_of_birth: yup.date().max(new Date(), 'Hãy chọn một ngày trong quá khứ'),
  password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  new_password: schema.fields['password'] as yup.StringSchema<string | undefined, yup.AnyObject, undefined, ''>,
  confirm_password: handleConfirmPassword('new_password') as yup.StringSchema<
    string | undefined,
    yup.AnyObject,
    undefined,
    ''
  >,
  avatar: yup.string().max(1000, 'Độ dài tối đa là 1000 ký tự')
})

export const loginSchema = schema.omit(['confirm_password'])
export type Schema = yup.InferType<typeof schema>
export type UserSchema = yup.InferType<typeof userSchema>
