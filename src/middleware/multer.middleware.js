import crypto from 'node:crypto';
import path from 'node:path'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp/my-uploads')
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(16, function (err, raw) {
            const ext = path.extname(file.originalname)
            if (err) return cb(err)
            cb(null, file.fieldname + '-' + raw.toString('hex')+ext)
        })
    }
})

export const upload = multer({ storage: storage })