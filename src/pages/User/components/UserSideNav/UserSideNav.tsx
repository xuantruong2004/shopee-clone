import { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import userImageDefault from 'src/assets/image/userDefault.jpg'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'

export default function UserSideNav() {
  const { profile } = useContext(AppContext)
  return (
    <div>
      <div className='flex items-center border-b border-b-gray-200 py-4 '>
        <Link to={path.profile} className=' h-14 w-14 flex-shrink-0 overflow-hidden rounded-full'>
          <img
            className='h-full w-full object-cover'
            src={profile?.avatar ? profile.avatar : userImageDefault}
            alt='truongxuan'
          />
        </Link>
        <div className='ml-4 flex-grow'>
          <div className='font-bold text-black'>truongxuan007</div>
          <Link to={path.profile} className='flex items-center capitalize text-gray-400'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-4 w-4'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125'
              />
            </svg>
            <div className='ml-1 '>Sửa hồ sơ</div>
          </Link>
        </div>
      </div>
      <div className='mt-7'>
        <NavLink
          to={path.profile}
          className={({ isActive }) =>
            isActive
              ? 'flex items-center font-semibold capitalize text-orange transition-colors'
              : 'flex items-center font-semibold capitalize transition-colors hover:text-orange'
          }
        >
          <img
            src='https://down-vn.img.susercontent.com/file/ba61750a46794d8847c3f463c5e71cc4'
            alt='logoUser'
            className='h-5 w-5'
          />
          <div className='pl-2'> Tài khoản của tôi</div>
        </NavLink>
      </div>
      <div className='mt-7'>
        <NavLink
          to={path.changePassword}
          className={({ isActive }) =>
            isActive
              ? 'flex items-center font-semibold capitalize text-orange transition-colors'
              : 'flex items-center font-semibold capitalize transition-colors hover:text-orange'
          }
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='#0247b4'
            className='h-6 w-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
            />
          </svg>

          <div className='pl-2'>Đổi mật khẩu</div>
        </NavLink>
      </div>
      <div className='mt-7'>
        <NavLink
          to={path.historyPurchase}
          className={({ isActive }) =>
            isActive
              ? 'flex items-center font-semibold capitalize text-orange transition-colors'
              : 'flex items-center font-semibold capitalize transition-colors hover:text-orange'
          }
        >
          <img
            src='https://down-vn.img.susercontent.com/file/f0049e9df4e536bc3e7f140d071e9078'
            alt='logoPurchase'
            className='h-5 w-5'
          />
          <div className='pl-2'> Đơn mua</div>
        </NavLink>
      </div>
    </div>
  )
}
