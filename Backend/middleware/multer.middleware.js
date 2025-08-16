import multer from 'multer'

const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
})

const upload = multer({ storage })

export default upload



// import multer from "multer"
// import path from "path"
// import fs from "fs"

// // Ensure uploads folder exists
// const uploadDir = "uploads"
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir)
// }

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, uploadDir)
//     },
//     filename: function (req, file, cb) {
//         const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
//         cb(null, uniqueName)
//     }
// })

// const upload = multer({ storage })

// export default upload
