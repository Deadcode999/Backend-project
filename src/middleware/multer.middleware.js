import crypto from 'node:crypto';
import path from 'node:path'
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp')
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