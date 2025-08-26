import express from 'express'
import { loginUser, registerUser, adminLogin, sendVerifyOtp, verifyEmail,printmsg } from '../controllers/user.controller.js'
import authUser from '../middleware/auth.middleware.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.get('/printmsg',printmsg)

//account verification
userRouter.post('/sendverifyotp', authUser, sendVerifyOtp)
userRouter.post('/verifyaccount', authUser, verifyEmail)

export default userRouter