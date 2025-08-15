import { useContext, useState } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import CartTotal from '../component/CartTotal'
import { ShopContext } from '../Context/ShopContext'
import { useEffect } from 'react'

const Placeorder = () => {

  const [payment, setpayment] = useState('cod')
  const { navigate } = useContext(ShopContext)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className='p-4 mt-17 flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>

      {/* left side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <p>DELIVERY INFORMATION</p>
        </div>

        <div className='flex gap-3'>
          <input className='border border-gray-300 py-1.5 px-3.5 w-full ' type="text" placeholder='First Name' />
          <input className='border border-gray-300 py-1.5 px-3.5 w-full ' type="text" placeholder='Last Name' />
        </div>

        <input className='border border-gray-300 py-1.5 px-3.5 w-full ' type="email" placeholder='Email Address' />
        <input className='border border-gray-300 py-1.5 px-3.5 w-full ' type="text" placeholder='Street Address' />

        <div className='flex gap-3'>
          <input className='border border-gray-300 py-1.5 px-3.5 w-full ' type="text" placeholder='City' />
          <input className='border border-gray-300 py-1.5 px-3.5 w-full ' type="text" placeholder='State' />
        </div>

        <div className='flex gap-3'>
          <input className='border border-gray-300 py-1.5 px-3.5 w-full ' type="number" placeholder='Zipcode' />
          <input className='border border-gray-300 py-1.5 px-3.5 w-full ' type="text" placeholder='Country' />
        </div>

        <input className='border border-gray-300 py-1.5 px-3.5 w-full ' type="number" placeholder='Phone Number' />
      </div>

      {/* right side */}
      <div className='mt-8'>
        <div className='mt-8'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <p>PAYMENT METHOD</p>
          {/* payment method selection */}
          <div className='flex gap-3 flex-col lg:flex-row'>

            <div onClick={() => setpayment('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border border-gray-500 rounded-full ${payment === 'stripe' ? "bg-green-400 border-none" : ''} `} ></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>

            <div onClick={() => setpayment('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border border-gray-500 rounded-full ${payment === 'razorpay' ? "bg-green-400 border-none" : ''} `} ></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
            </div>

            <div onClick={() => setpayment('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border border-gray-500 rounded-full ${payment === 'cod' ? "bg-green-400 border-none" : ''} `} ></p>
              <p className='text-gray-500 text-sm font-medium mx-4'> CASH ON DELIVERY </p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button onClick={() => navigate('./order')} className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Placeorder