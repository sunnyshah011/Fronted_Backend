import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {

    const { token } = req.headers;

    if (!token) {
        console.log("Your are not Login");
        return res.json({ success: false, message: "Not Authorized Please Login" })
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id
        next()
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

export default authUser