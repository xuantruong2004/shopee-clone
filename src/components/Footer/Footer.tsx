import React from 'react'

export default function Footer() {
  return (
    <footer className=' bg-neutral-100 py-16 '>
      <div className=' container text-xs text-gray-500 lg:text-sm'>
        <div className='grid grid-cols-1 gap-4 pb-10 lg:grid-cols-3'>
          <div className='lg:col-span-1'>
            <div>© 2023 Shopee. Tất cả các quyền được bảo lưu.</div>
          </div>
          <div className='lg:col-span-2'>
            <div>
              Quốc gia & Khu vực: Singapore Indonesia Đài Loan Thái Lan Malaysia Việt Nam Philippines Brazil México
              Colombia Chile
            </div>
          </div>
        </div>
        <div className=' flex items-center justify-center  gap-2 py-8 '>
          <div>CHÍNH SÁCH BẢO MẬT</div>
          <hr className=' h-4 w-[1px] bg-gray-400' />
          <div>QUY CHẾ HOẠT ĐỘNG</div>
          <hr className=' h-4 w-[1px] bg-gray-400' />
          <div>CHÍNH SÁCH VẬN CHUYỂN</div>
          <hr className=' h-4 w-[1px] bg-gray-400' />
          <div>CHÍNH SÁCH TRẢ HÀNG VÀ HOÀN TIỀN</div>
        </div>

        <div className=' text-center '>
          <div>Công ty TNHH Shopee</div>
          <div className='mt-6'>
            Địa chỉ: Tầng 4-5-6, Tòa nhà Capital Place, số 29 đường Liễu Giai, Phường Ngọc Khánh, Quận Ba Đình, Thành
            phố Hà Nội, Việt Nam. Tổng đài hỗ trợ: 19001221 - Email: cskh@hotro.shopee.vn
          </div>
          <div className='mt-2'>
            Chịu Trách Nhiệm Quản Lý Nội Dung: Nguyễn Đức Trí - Điện thoại liên hệ: 024 73081221 (ext 4678)
          </div>

          <div className='mt-2'>
            Mã số doanh nghiệp: 0106773786 do Sở Kế hoạch & Đầu tư TP Hà Nội cấp lần đầu ngày 10/02/2015
          </div>

          <div className='mt-2'>© 2015 - Bản quyền thuộc về Công ty TNHH Shopee</div>
        </div>
      </div>
    </footer>
  )
}
