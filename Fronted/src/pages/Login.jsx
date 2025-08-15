import { Link } from 'react-router-dom'

const Login = () => {

  const onsubmithandler = async(event)=>{
    event.preventDefault()
  } 

  return (
    <form onSubmit={onsubmithandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-700 ' action="">
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'> Sign Up </p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      <input type="email" className='w-full px-3 py-2 border border-gray-300' placeholder='Email'required />
      <input type="password" className='w-full px-3 py-2 border border-gray-300' placeholder='Set Password' required />

      <div className='w-full flex justify-between text-sm ' >
        <p className='cursor-pointer'>Forgot your password</p>
        <Link to='/register' >
          <p className='cursor-pointer' >Create New Account</p>
        </Link>
      </div>

      <button  className="bg-black px-8 py-2 mt-8 text-white font-light"> Sign In </button>
    </form>
  )
}

export default Login