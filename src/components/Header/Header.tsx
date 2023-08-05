import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import authApi from 'src/apis/auth.api'
import purchaseApi from 'src/apis/purchase.api'
import userImageDefault from 'src/assets/image/userDefault.jpg'
import path from 'src/constants/path'
import { purchaseStatus } from 'src/constants/purchase'
import { AppContext } from 'src/contexts/app.context'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { Schema, schema } from 'src/utils/rules'
import { formatCurrency } from 'src/utils/utils'
import Popover from '../Popover'

type FormData = Pick<Schema, 'name'>
const nameSchema = schema.pick(['name'])
export default function Header() {
  const queryConfig = useQueryConfig()
  const queryClient = useQueryClient()
  const { profile, setIsAuthenticated, isAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  })

  const LogoutMutation = useMutation({
    mutationFn: authApi.LogoutAccount,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
      queryClient.removeQueries({ queryKey: ['purchase', { status: purchaseStatus.inCart }] })
    }
  })

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchase', { status: purchaseStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchaseStatus.inCart }),
    enabled: isAuthenticated
  })

  const purchasesInCart = purchasesInCartData?.data.data
  const handleLogout = () => {
    LogoutMutation.mutate()
  }

  const onSubmitSearch = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        name: data.name
      }).toString()
    })
  })

  return (
    <div className=' bg-orange'>
      <div className='container text-white'>
        <div className='flex items-center justify-between text-xs font-light lg:text-sm'>
          <div className=' flex items-center '>
            <div className='cursor-pointer p-2 hover:text-gray-200'>Kênh Người Bán</div>
            <hr className=' h-3 w-[1px] bg-gray-200' />
            <div className='cursor-pointer p-2 hover:text-gray-200'>Tải ứng dụng </div>
            <hr className=' h-3 w-[1px] bg-gray-200' />
            <div className='cursor-pointer p-2 hover:text-gray-200'>Kết nối</div>
          </div>
          <div className=' flex items-center '>
            <div className='flex cursor-pointer items-center p-2 hover:text-gray-200'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-6 w-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0'
                />
              </svg>

              <div className='ml-1'>Thông báo</div>
            </div>
            <hr className=' h-3 w-[1px] bg-gray-200' />
            <div className='flex cursor-pointer items-center p-2 hover:text-gray-200'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-6 w-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z'
                />
              </svg>
              <div className='ml-1'>Hỗ trợ</div>
            </div>
            <hr className=' h-3 w-[1px] bg-gray-200' />
            <Popover
              className='flex cursor-pointer items-center p-3 hover:text-gray-200'
              renderPopover={
                <div className=' relative flex min-w-[10rem] flex-col rounded-md border border-gray-200 bg-white p-2 shadow-md'>
                  <button className='p-2 text-left  hover:text-orange'>Tiếng Việt</button>
                  <button className=' p-2 text-left hover:text-orange'>English</button>
                </div>
              }
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-6 w-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
                />
              </svg>
              <div className='ml-1'>Tieng Viet</div>
            </Popover>
            {isAuthenticated && (
              <Popover
                className='flex cursor-pointer items-center p-2 hover:text-gray-200'
                renderPopover={
                  <div className='relative flex min-w-[10rem] flex-col rounded-md border border-gray-200 bg-white p-2 shadow-md'>
                    <Link to={path.profile} className=' p-2 text-left  hover:text-cyan-500'>
                      Tài khoản của tôi
                    </Link>
                    <Link to={'/purchase'} className=' p-2 text-left hover:text-cyan-500'>
                      Đơn mua
                    </Link>
                    <button onClick={handleLogout} className=' p-2 text-left hover:text-cyan-500'>
                      Đăng xuất
                    </button>
                  </div>
                }
              >
                <div className='h-6 w-6 '>
                  <img
                    className='h-full w-full rounded-full object-cover'
                    src={profile?.avatar ? profile.avatar : userImageDefault}
                    alt={profile?.email}
                  />
                </div>
                <div className='ml-1 font-normal'>{profile?.email}</div>
              </Popover>
            )}
            {!isAuthenticated && (
              <div className='ml-3 flex items-center gap-3'>
                <Link to={path.login} className='font-normal hover:cursor-pointer hover:opacity-80'>
                  Đăng nhập
                </Link>
                <hr className=' h-3 w-[1px] bg-gray-200' />
                <Link to={path.register} className='font-normal hover:cursor-pointer hover:opacity-80'>
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className='flex pt-4'>
          <nav className='mr-10 flex'>
            <Link to={'/'}>
              <svg viewBox='0 0 192 65' className='h-8 fill-white lg:h-11'>
                <g fillRule='evenodd'>
                  <path d='M35.6717403 44.953764c-.3333497 2.7510509-2.0003116 4.9543414-4.5823845 6.0575984-1.4379707.6145919-3.36871.9463856-4.896954.8421628-2.3840266-.0911143-4.6237865-.6708937-6.6883352-1.7307424-.7375522-.3788551-1.8370513-1.1352759-2.6813095-1.8437757-.213839-.1790053-.239235-.2937577-.0977428-.4944671.0764015-.1151823.2172535-.3229831.5286218-.7791994.45158-.6616533.5079208-.7446018.5587128-.8221779.14448-.2217688.3792333-.2411091.6107855-.0588804.0243289.0189105.0243289.0189105.0426824.0333083.0379873.0294402.0379873.0294402.1276204.0990653.0907002.0706996.14448.1123887.166248.1287205 2.2265285 1.7438508 4.8196989 2.7495466 7.4376251 2.8501162 3.6423042-.0496401 6.2615109-1.6873341 6.7308041-4.2020035.5160305-2.7675977-1.6565047-5.1582742-5.9070334-6.4908212-1.329344-.4166762-4.6895175-1.7616869-5.3090528-2.1250697-2.9094471-1.7071043-4.2697358-3.9430584-4.0763845-6.7048539.296216-3.8283059 3.8501677-6.6835796 8.340785-6.702705 2.0082079-.004083 4.0121475.4132378 5.937338 1.2244562.6816382.2873109 1.8987274.9496089 2.3189359 1.2633517.2420093.1777159.2898136.384872.1510957.60836-.0774686.12958-.2055158.3350171-.4754821.7632974l-.0029878.0047276c-.3553311.5640922-.3664286.5817134-.447952.7136572-.140852.2144625-.3064598.2344475-.5604202.0732783-2.0600669-1.3839063-4.3437898-2.0801572-6.8554368-2.130442-3.126914.061889-5.4706057 1.9228561-5.6246892 4.4579402-.0409751 2.2896772 1.676352 3.9613243 5.3858811 5.2358503 7.529819 2.4196871 10.4113092 5.25648 9.869029 9.7292478M26.3725216 5.42669372c4.9022893 0 8.8982174 4.65220288 9.0851664 10.47578358H17.2875686c.186949-5.8235807 4.1828771-10.47578358 9.084953-10.47578358m25.370857 11.57065968c0-.6047069-.4870064-1.0948761-1.0875481-1.0948761h-11.77736c-.28896-7.68927544-5.7774923-13.82058185-12.5059489-13.82058185-6.7282432 0-12.2167755 6.13130641-12.5057355 13.82058185l-11.79421958.0002149c-.59136492.0107446-1.06748731.4968309-1.06748731 1.0946612 0 .0285807.00106706.0569465.00320118.0848825H.99995732l1.6812605 37.0613963c.00021341.1031483.00405483.2071562.01173767.3118087.00170729.0236381.003628.0470614.00554871.0704847l.00362801.0782207.00405483.004083c.25545428 2.5789222 2.12707837 4.6560709 4.67201764 4.7519129l.00576212.0055872h37.4122078c.0177132.0002149.0354264.0004298.0531396.0004298.0177132 0 .0354264-.0002149.0531396-.0004298h.0796027l.0017073-.0015043c2.589329-.0706995 4.6867431-2.1768587 4.9082648-4.787585l.0012805-.0012893.0017073-.0350275c.0021341-.0275062.0040548-.0547975.0057621-.0823037.0040548-.065757.0068292-.1312992.0078963-.1964115l1.8344904-37.207738h-.0012805c.001067-.0186956.0014939-.0376062.0014939-.0565167M176.465457 41.1518926c.720839-2.3512494 2.900423-3.9186779 5.443734-3.9186779 2.427686 0 4.739107 1.6486899 5.537598 3.9141989l.054826.1556978h-11.082664l.046506-.1512188zm13.50267 3.4063683c.014933.0006399.014933.0006399.036906.0008531.021973-.0002132.021973-.0002132.044372-.0008531.53055-.0243144.950595-.4766911.950595-1.0271786 0-.0266606-.000853-.0496953-.00256-.0865936.000427-.0068251.000427-.020262.000427-.0635588 0-5.1926268-4.070748-9.4007319-9.09145-9.4007319-5.020488 0-9.091235 4.2081051-9.091235 9.4007319 0 .3871116.022399.7731567.067838 1.1568557l.00256.0204753.01408.1013102c.250022 1.8683731 1.047233 3.5831812 2.306302 4.9708108-.00064-.0006399.00064.0006399.007253.0078915 1.396026 1.536289 3.291455 2.5833031 5.393601 2.9748936l.02752.0053321v-.0027727l.13653.0228215c.070186.0119439.144211.0236746.243409.039031 2.766879.332724 5.221231-.0661182 7.299484-1.1127057.511777-.2578611.971928-.5423827 1.37064-.8429007.128211-.0968312.243622-.1904632.34346-.2781231.051412-.0452164.092372-.083181.114131-.1051493.468898-.4830897.498124-.6543572.215249-1.0954297-.31146-.4956734-.586228-.9179769-.821744-1.2675504-.082345-.1224254-.154023-.2267215-.214396-.3133151-.033279-.0475624-.033279-.0475624-.054399-.0776356-.008319-.0117306-.008319-.0117306-.013866-.0191956l-.00256-.0038391c-.256208-.3188605-.431565-.3480805-.715933-.0970445-.030292.0268739-.131624.1051493-.14997.1245582-1.999321 1.775381-4.729508 2.3465571-7.455854 1.7760208-.507724-.1362888-.982595-.3094759-1.419919-.5184948-1.708127-.8565509-2.918343-2.3826022-3.267563-4.1490253l-.02752-.1394881h13.754612zM154.831964 41.1518926c.720831-2.3512494 2.900389-3.9186779 5.44367-3.9186779 2.427657 0 4.739052 1.6486899 5.537747 3.9141989l.054612.1556978h-11.082534l.046505-.1512188zm13.502512 3.4063683c.015146.0006399.015146.0006399.037118.0008531.02176-.0002132.02176-.0002132.044159-.0008531.530543-.0243144.950584-.4766911.950584-1.0271786 0-.0266606-.000854-.0496953-.00256-.0865936.000426-.0068251.000426-.020262.000426-.0635588 0-5.1926268-4.070699-9.4007319-9.091342-9.4007319-5.020217 0-9.091343 4.2081051-9.091343 9.4007319 0 .3871116.022826.7731567.068051 1.1568557l.00256.0204753.01408.1013102c.250019 1.8683731 1.04722 3.5831812 2.306274 4.9708108-.00064-.0006399.00064.0006399.007254.0078915 1.396009 1.536289 3.291417 2.5833031 5.393538 2.9748936l.027519.0053321v-.0027727l.136529.0228215c.070184.0119439.144209.0236746.243619.039031 2.766847.332724 5.22117-.0661182 7.299185-1.1127057.511771-.2578611.971917-.5423827 1.370624-.8429007.128209-.0968312.243619-.1904632.343456-.2781231.051412-.0452164.09237-.083181.11413-.1051493.468892-.4830897.498118-.6543572.215246-1.0954297-.311457-.4956734-.586221-.9179769-.821734-1.2675504-.082344-.1224254-.154022-.2267215-.21418-.3133151-.033492-.0475624-.033492-.0475624-.054612-.0776356-.008319-.0117306-.008319-.0117306-.013866-.0191956l-.002346-.0038391c-.256419-.3188605-.431774-.3480805-.716138-.0970445-.030292.0268739-.131623.1051493-.149969.1245582-1.999084 1.775381-4.729452 2.3465571-7.455767 1.7760208-.507717-.1362888-.982582-.3094759-1.419902-.5184948-1.708107-.8565509-2.918095-2.3826022-3.267311-4.1490253l-.027733-.1394881h13.754451zM138.32144123 49.7357905c-3.38129629 0-6.14681004-2.6808521-6.23169343-6.04042014v-.31621743c.08401943-3.35418649 2.85039714-6.03546919 6.23169343-6.03546919 3.44242097 0 6.23320537 2.7740599 6.23320537 6.1960534 0 3.42199346-2.7907844 6.19605336-6.23320537 6.19605336m.00172791-15.67913203c-2.21776751 0-4.33682838.7553485-6.03989586 2.140764l-.19352548.1573553V34.6208558c0-.4623792-.0993546-.56419733-.56740117-.56419733h-2.17651376c-.47409424 0-.56761716.09428403-.56761716.56419733v27.6400724c0 .4539841.10583425.5641973.56761716.5641973h2.17651376c.46351081 0 .56740117-.1078454.56740117-.5641973V50.734168l.19352548.1573553c1.70328347 1.3856307 3.82234434 2.1409792 6.03989586 2.1409792 5.27140956 0 9.54473746-4.2479474 9.54473746-9.48802964 0-5.239867-4.2733279-9.48781439-9.54473746-9.48781439M115.907646 49.5240292c-3.449458 0-6.245805-2.7496948-6.245805-6.1425854 0-3.3928907 2.79656-6.1427988 6.245805-6.1427988 3.448821 0 6.24538 2.7499081 6.24538 6.1427988 0 3.3926772-2.796346 6.1425854-6.24538 6.1425854m.001914-15.5438312c-5.28187 0-9.563025 4.2112903-9.563025 9.4059406 0 5.1944369 4.281155 9.4059406 9.563025 9.4059406 5.281657 0 9.562387-4.2115037 9.562387-9.4059406 0-5.1946503-4.280517-9.4059406-9.562387-9.4059406M94.5919049 34.1890939c-1.9281307 0-3.7938902.6198995-5.3417715 1.7656047l-.188189.1393105V23.2574169c0-.4254677-.1395825-.5643476-.5649971-.5643476h-2.2782698c-.4600414 0-.5652122.1100273-.5652122.5643476v29.2834155c0 .443339.1135587.5647782.5652122.5647782h2.2782698c.4226187 0 .5649971-.1457701.5649971-.5647782v-9.5648406c.023658-3.011002 2.4931278-5.4412923 5.5299605-5.4412923 3.0445753 0 5.516841 2.4421328 5.5297454 5.4630394v9.5430935c0 .4844647.0806524.5645628.5652122.5645628h2.2726775c.481764 0 .565212-.0824666.565212-.5645628v-9.5710848c-.018066-4.8280677-4.0440197-8.7806537-8.9328471-8.7806537M62.8459442 47.7938061l-.0053397.0081519c-.3248668.4921188-.4609221.6991347-.5369593.8179812-.2560916.3812097-.224267.551113.1668119.8816949.91266.7358184 2.0858968 1.508535 2.8774525 1.8955369 2.2023021 1.076912 4.5810275 1.646045 7.1017886 1.6975309 1.6283921.0821628 3.6734936-.3050536 5.1963734-.9842376 2.7569891-1.2298679 4.5131066-3.6269626 4.8208863-6.5794607.4985136-4.7841067-2.6143125-7.7747902-10.6321784-10.1849709l-.0021359-.0006435c-3.7356476-1.2047686-5.4904836-2.8064071-5.4911243-5.0426086.1099976-2.4715346 2.4015793-4.3179454 5.4932602-4.4331449 2.4904317.0062212 4.6923065.6675996 6.8557356 2.0598624.4562232.2767364.666607.2256796.9733188-.172263.035242-.0587797.1332787-.2012238.543367-.790093l.0012815-.0019308c.3829626-.5500403.5089793-.7336731.5403767-.7879478.258441-.4863266.2214903-.6738208-.244985-1.0046173-.459427-.3290803-1.7535544-1.0024722-2.4936356-1.2978721-2.0583439-.8211991-4.1863175-1.2199998-6.3042524-1.1788111-4.8198184.1046878-8.578747 3.2393171-8.8265087 7.3515337-.1572005 2.9703036 1.350301 5.3588174 4.5000778 7.124567.8829712.4661613 4.1115618 1.6865902 5.6184225 2.1278667 4.2847814 1.2547527 6.5186944 3.5630343 6.0571315 6.2864205-.4192725 2.4743234-3.0117991 4.1199394-6.6498372 4.2325647-2.6382344-.0549182-5.2963324-1.0217793-7.6043603-2.7562084-.0115337-.0083664-.0700567-.0519149-.1779185-.1323615-.1516472-.1130543-.1516472-.1130543-.1742875-.1300017-.4705335-.3247898-.7473431-.2977598-1.0346184.1302162-.0346012.0529875-.3919333.5963776-.5681431.8632459' />
                </g>
              </svg>
            </Link>
          </nav>
          <div className=' w-full'>
            <form onSubmit={onSubmitSearch} className='flex h-10 rounded-sm bg-white p-1'>
              <input
                type='text'
                className='w-full p-2 text-sm text-gray-500 outline-none'
                placeholder='CƠ HỘI FREESHIP 1 NĂM'
                {...register('name')}
              />

              <button
                {...register}
                className=' flex items-center justify-center rounded-sm bg-orange fill-white p-2 px-6 hover:cursor-pointer hover:opacity-90'
              >
                <svg height={15} viewBox='0 0 19 19' width={15}>
                  <g fillRule='evenodd' stroke='none' strokeWidth={1}>
                    <g transform='translate(-1016 -32)'>
                      <g>
                        <g transform='translate(405 21)'>
                          <g transform='translate(611 11)'>
                            <path d='m8 16c4.418278 0 8-3.581722 8-8s-3.581722-8-8-8-8 3.581722-8 8 3.581722 8 8 8zm0-2c-3.3137085 0-6-2.6862915-6-6s2.6862915-6 6-6 6 2.6862915 6 6-2.6862915 6-6 6z' />
                            <path d='m12.2972351 13.7114222 4.9799555 4.919354c.3929077.3881263 1.0260608.3842503 1.4141871-.0086574.3881263-.3929076.3842503-1.0260607-.0086574-1.414187l-4.9799554-4.919354c-.3929077-.3881263-1.0260608-.3842503-1.4141871.0086573-.3881263.3929077-.3842503 1.0260608.0086573 1.4141871z' />
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </button>
            </form>
            <div className='flex justify-center gap-3 py-2 text-sm font-light'>
              <div className='hover:cursor-pointer'>Bàn làm việc</div>
              <div className='hover:cursor-pointer'>Bàn học</div>
              <div className='hover:cursor-pointer'>Iphone 14</div>
              <div className='hover:cursor-pointer'>Điện thoại</div>
              <div className='hover:cursor-pointer'>người yêu</div>
            </div>
          </div>
          <Popover
            className='relative mx-10 flex items-center justify-center p-2  text-white hover:cursor-pointer'
            offSet={-10}
            renderPopover={
              <div className=' relative w-[400px] rounded-md border border-gray-200 bg-white p-2 shadow-md'>
                {purchasesInCart && purchasesInCart?.length > 0 ? (
                  <div className=' p-2 '>
                    <div className='capitalize text-gray-400'>Sản phẩm mới thêm</div>
                    <div className='mt-5 max-h-[20rem] overflow-y-auto'>
                      {purchasesInCart?.map((purchase) => (
                        <Link
                          to={`${path.home}${purchase.product._id}`}
                          key={purchase._id}
                          className='mt-4 flex cursor-pointer p-2 hover:bg-[rgba(255,87,34,0.1)]'
                        >
                          <div className=' flex-shrink-0'>
                            <img src={purchase.product.image} alt={purchase._id} className='h-11 w-11 object-cover' />
                          </div>
                          <div className='ml-2 flex-grow overflow-hidden'>
                            <div className='truncate'>{purchase.product.name}</div>
                          </div>
                          <div className='ml-3 flex-shrink-0'>
                            <div className='text-orange'>₫{formatCurrency(purchase.price)}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className='mt-5 flex justify-end'>
                      <Link
                        to={path.cart}
                        className='cursor-pointer rounded-sm bg-orange px-4 py-2 text-white hover:opacity-90'
                      >
                        Xem gio hang
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-col items-center p-4'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      data-name='Layer 1'
                      viewBox='0 0 650 512'
                      className='h-20 w-20'
                    >
                      <circle cx='337.969' cy='243.395' r='167.695' fill='#dbe8ec' />
                      <path
                        fill='#dbe8ec'
                        d='M574.58343,223.75715V205.64747a13.02087,13.02087,0,0,0-13.02086-13.02087H505.60333a13.02086,13.02086,0,0,1-13.02086-13.02086V161.49606a13.02087,13.02087,0,0,1,13.02086-13.02087h21.45112a13.02087,13.02087,0,0,0,13.02086-13.02087V117.34464a13.02087,13.02087,0,0,0-13.02086-13.02087H143.13523a13.02087,13.02087,0,0,0-13.02087,13.02087v18.10968a13.02087,13.02087,0,0,0,13.02087,13.02087h0a13.02087,13.02087,0,0,1,13.02086,13.02087v18.10968a13.02086,13.02086,0,0,1-13.02086,13.02086H82.7824a13.02087,13.02087,0,0,0-13.02087,13.02087v18.10968A13.02087,13.02087,0,0,0,82.7824,236.778h59.75769A13.02087,13.02087,0,0,1,155.561,249.79889v18.10976c.31905,16.57135-35.82964,13.02087-43.02086,13.02087h-.04775a13.02087,13.02087,0,0,0-13.02087,13.02087V312.06a13.02087,13.02087,0,0,0,13.02087,13.02087h32.85852a13.02087,13.02087,0,0,1,13.02087,13.02087v18.10976a13.02087,13.02087,0,0,1-13.02087,13.02087H108.43743a13.02087,13.02087,0,0,0-13.02086,13.02087V400.3629a13.02086,13.02086,0,0,0,13.02086,13.02086H524.045a13.02087,13.02087,0,0,0,13.02087-13.02086V382.25322A13.02087,13.02087,0,0,0,524.045,369.23235H502.75526a13.02087,13.02087,0,0,1-13.02087-13.02087V338.10172a13.02087,13.02087,0,0,1,13.02087-13.02087h36.62008A13.02087,13.02087,0,0,0,552.39621,312.06V293.95039a13.02087,13.02087,0,0,0-13.02087-13.02087H521.30005a13.02087,13.02087,0,0,1-13.02087-13.02087V249.79889A13.02087,13.02087,0,0,1,521.30005,236.778h40.26252A13.02087,13.02087,0,0,0,574.58343,223.75715Z'
                      />
                      <circle cx='340.677' cy='148.55' r='46.959' fill='#3086a3' />
                      <path
                        fill='none'
                        stroke='#f9ae2b'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={4}
                        d='M324.05253,138.77179q-.00092-.08715-.00092-.17432a16.62566,16.62566,0,1,1,16.86682,16.62391v15.09678'
                      />
                      <line
                        x1='419.668'
                        x2='451.971'
                        y1='116.939'
                        y2='116.939'
                        fill='none'
                        stroke='#3086a3'
                        strokeLinecap='round'
                        strokeMiterlimit={10}
                        strokeWidth={3}
                      />
                      <line
                        x1='419.668'
                        x2='451.971'
                        y1='126.25'
                        y2='126.25'
                        fill='none'
                        stroke='#3086a3'
                        strokeLinecap='round'
                        strokeMiterlimit={10}
                        strokeWidth={3}
                      />
                      <line
                        x1='419.668'
                        x2='451.971'
                        y1='135.56'
                        y2='135.56'
                        fill='none'
                        stroke='#3086a3'
                        strokeLinecap='round'
                        strokeMiterlimit={10}
                        strokeWidth={3}
                      />
                      <line
                        x1='119.153'
                        x2='151.456'
                        y1='293.762'
                        y2='293.762'
                        fill='none'
                        stroke='#3086a3'
                        strokeLinecap='round'
                        strokeMiterlimit={10}
                        strokeWidth={3}
                      />
                      <line
                        x1='119.153'
                        x2='151.456'
                        y1='303.072'
                        y2='303.072'
                        fill='none'
                        stroke='#3086a3'
                        strokeLinecap='round'
                        strokeMiterlimit={10}
                        strokeWidth={3}
                      />
                      <line
                        x1='119.153'
                        x2='151.456'
                        y1='312.383'
                        y2='312.383'
                        fill='none'
                        stroke='#3086a3'
                        strokeLinecap='round'
                        strokeMiterlimit={10}
                        strokeWidth={3}
                      />
                      <line
                        x1='481.64'
                        x2='513.943'
                        y1='360.156'
                        y2='360.156'
                        fill='none'
                        stroke='#3086a3'
                        strokeLinecap='round'
                        strokeMiterlimit={10}
                        strokeWidth={3}
                      />
                      <line
                        x1='481.64'
                        x2='513.943'
                        y1='369.467'
                        y2='369.467'
                        fill='none'
                        stroke='#3086a3'
                        strokeLinecap='round'
                        strokeMiterlimit={10}
                        strokeWidth={3}
                      />
                      <line
                        x1='481.64'
                        x2='513.943'
                        y1='378.777'
                        y2='378.777'
                        fill='none'
                        stroke='#3086a3'
                        strokeLinecap='round'
                        strokeMiterlimit={10}
                        strokeWidth={3}
                      />
                      <circle cx='520.577' cy='300.496' r='13.807' fill='#b9d4db' />
                      <circle cx='484.141' cy='310.461' r='7.159' fill='#b9d4db' />
                      <circle cx='502.32' cy='266.711' r='10.228' fill='#b9d4db' />
                      <circle cx='206.393' cy='389.674' r='16.428' fill='#b9d4db' />
                      <circle cx='175.001' cy='377.974' r='8.557' fill='#b9d4db' />
                      <circle cx='182.861' cy='348.886' r='4.936' fill='#b9d4db' />
                      <circle cx='210.185' cy='352.378' r='11.833' fill='#b9d4db' />
                      <circle cx='218.423' cy='143.059' r='16.428' fill='#b9d4db' />
                      <circle cx='219.09' cy='109.564' r='8.557' fill='#b9d4db' />
                      <circle cx='276.085' cy='114.564' r='7.406' fill='#b9d4db' />
                      <circle cx='249.141' cy='107.367' r='4.936' fill='#b9d4db' />
                      <circle cx='254.877' cy='134.31' r='11.833' fill='#b9d4db' />
                      <path
                        fill='#409cb5'
                        d='M480.85793,233.2431H202.6215L193.549,210.24282h287.309a2.72176,2.72176,0,0,1,2.72176,2.72176v17.55676A2.72176,2.72176,0,0,1,480.85793,233.2431Z'
                      />
                      <path
                        fill='#f9ae2b'
                        d='M440.32266,354.08924H251.1267a4.53627,4.53627,0,0,1-4.24692-2.94208L202.6215,233.2431h268.547l-26.4204,117.30658A4.53627,4.53627,0,0,1,440.32266,354.08924Z'
                      />
                      <path
                        fill='#3086a3'
                        d='M457.56233,293.66888c-19.355,1.24146-38.71,1.89087-58.065,2.33216-9.6775.27637-19.355.33777-29.03251.50036l-29.0325.16578q-29.0325.02636-58.065-.65723c-19.355-.43945-38.71-1.09216-58.065-2.34107,19.355-1.2489,38.71-1.90148,58.065-2.34106q29.03249-.65185,58.065-.6571l29.0325.16565c9.6775.16259,19.355.224,29.03251.50048C418.8523,291.778,438.20731,292.42755,457.56233,293.66888Z'
                      />
                      <path
                        fill='#3086a3'
                        d='M419.70359 233.2431c-1.1026 10.54578-2.78772 20.96045-4.64789 31.33558q-2.82669 15.55462-6.30877 30.96154-3.46357 15.41108-7.56577 30.67835c-1.38006 5.08618-2.80926 10.16137-4.33484 15.21484-.78927 2.52075-1.54083 5.05-2.361 7.56384l-.632 1.90967a4.91879 4.91879 0 01-1.18194 1.85889 4.67456 4.67456 0 01-3.81363 1.32349 4.373 4.373 0 003.11981-1.90845 3.91413 3.91413 0 00.633-1.61035l.25211-1.93872c.3367-2.62269.742-5.22986 1.10959-7.84571.78815-5.21948 1.6727-10.41736 2.60638-15.60412q2.82738-15.55444 6.31671-30.95972 3.47562-15.40833 7.57367-30.67664C413.23631 253.37482 416.17866 243.24335 419.70359 233.2431zM311.58605 354.0893a4.68121 4.68121 0 01-3.92411-1.458 6.69642 6.69642 0 01-1.156-1.8822l-.89646-1.85706c-1.1946-2.47632-2.32068-4.97827-3.4844-7.46619-2.27786-4.9945-4.463-10.02368-6.60287-15.06994q-6.39166-15.14906-12.15434-30.53431-5.78044-15.37866-10.948-30.9873c-3.41577-10.41675-6.65956-20.89807-9.33894-31.59119 5.01886 9.815 9.47332 19.8418 13.75582 29.93323q6.391 15.14941 12.14673 30.53723 5.76888 15.38306 10.94045 30.99012c1.70927 5.20788 3.37323 10.43273 4.94449 15.69238.76086 2.63916 1.55934 5.26416 2.28932 7.91479l.54693 1.98828a5.88655 5.88655 0 00.66687 1.77539A4.37022 4.37022 0 00311.58605 354.0893z'
                      />
                      <circle cx='298.105' cy='428.058' r='18.743' fill='#409cb5' />
                      <circle cx='298.105' cy='428.058' r='8.651' fill='#dbe8ec' />
                      <circle cx='406.224' cy='428.058' r='18.743' fill='#409cb5' />
                      <circle cx='406.224' cy='428.058' r='8.651' fill='#dbe8ec' />
                      <path
                        fill='#3086a3'
                        d='M343.09231,233.2431c1.83931,9.99671,3.08253,20.02881,4.14664,30.07178q1.55889,15.06646,2.44714,30.173.9072,15.1053,1.161,30.24952c.13792,10.098.0925,20.207-.55473,30.35193-1.84722-9.99622-3.09265-20.02833-4.15473-30.07129q-1.5582-15.06666-2.43905-30.17347-.89487-15.106-1.15285-30.25012C342.40978,253.49628,342.453,243.38739,343.09231,233.2431Z'
                      />
                      <path
                        fill='#409cb5'
                        d='M437.93777,399.80133H268.38406a3.00011,3.00011,0,0,1-2.801-1.92578L167.38479,141.898H115.37112a3,3,0,0,1,0-6h54.07593a3.0001,3.0001,0,0,1,2.801,1.92578l98.19824,255.97754H437.93777a3,3,0,0,1,0,6Z'
                      />
                      <rect width='39.6' height='18.36' x='103.858' y='130.248' fill='#409cb5' rx={2} />
                      <circle cx='340.677' cy='179.6' r='2.7' fill='#f9ae2b' />
                    </svg>
                    <h4 className=' capitalize'>Chưa có sản phẩm</h4>
                  </div>
                )}
              </div>
            }
          >
            <Link to={path.cart}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-8 w-8'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                />
              </svg>
              {purchasesInCart && purchasesInCart?.length > 0 && (
                <div className=' absolute right-[-6px] top-[14px] rounded-full border-2 border-orange bg-white px-2 text-center text-xs text-orange '>
                  {purchasesInCart?.length}
                </div>
              )}
            </Link>
          </Popover>
        </div>
      </div>
    </div>
  )
}
