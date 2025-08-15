import { Link } from "react-router-dom"

const Register = () => {


    return (
        <form className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-700 bg-white ' action="">
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='prata-regular text-3xl'> Sign Up </p>
                <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
            </div>
            <input type="text" className='w-full px-3 py-2 border border-gray-300' placeholder='Full Name' required />
            <input type="number" className='w-full px-3 py-2 border border-gray-300' placeholder='Phone Number' required />
            <input type="email" className='w-full px-3 py-2 border border-gray-300' placeholder='Email' required />
            <input type="password" className='w-full px-3 py-2 border border-gray-300' placeholder='Set Password' required />

            <div className='w-full flex justify-between text-sm ' >
                <p className='cursor-pointer'>Forgot your password</p>
                <Link to='/login' >
                    <p className='cursor-pointer' >Login Here</p>
                </Link>
            </div>

            <button className="bg-black px-8 py-2 mt-8 text-white font-light"> Sign Up </button>
        </form>
    )
}

export default Register
