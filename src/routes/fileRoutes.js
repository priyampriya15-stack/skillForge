const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
    uploadFile
} = require("../controllers/fileController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// ===============================
// UPLOAD FOLDER
// ===============================

const uploadFolder = path.join(
    __dirname,
    "../uploads"
);


// Create uploads folder if it does not exist

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, {
        recursive: true
    });
}


// ===============================
// MULTER STORAGE
// ===============================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(null, uploadFolder);

    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            "-" +
            file.originalname;

        cb(null, uniqueName);

    }

});


// ===============================
// FILE FILTER
// ===============================

const fileFilter = (req, file, cb) => {

    const allowedTypes = [

        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",

        "application/pdf",

        "application/msword",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    ];


    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only images, PDF and Word documents are allowed"
            ),
            false
        );

    }

};


// ===============================
// MULTER CONFIGURATION
// ===============================

const upload = multer({

    storage: storage,

    fileFilter: fileFilter,

    limits: {

        files: 5,

        fileSize: 5 * 1024 * 1024

    }

});


// ===============================
// VIEW FILE
// ===============================

router.get(
    "/view/:filename",

    (req, res) => {

        try {

            const filePath = path.join(
                uploadFolder,
                req.params.filename
            );


            // ===============================
            // CHECK FILE EXISTS
            // ===============================

            if (!fs.existsSync(filePath)) {

                return res.status(404).json({

                    success: false,

                    message: "File not found"

                });

            }


            // ===============================
            // GET FILE EXTENSION
            // ===============================

            const extension = path
                .extname(filePath)
                .toLowerCase();


            // ===============================
            // MIME TYPES
            // ===============================

            const mimeTypes = {

                ".jpg": "image/jpeg",

                ".jpeg": "image/jpeg",

                ".png": "image/png",

                ".webp": "image/webp",

                ".pdf": "application/pdf",

                ".doc": "application/msword",

                ".docx":
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

            };


            const mimeType =
                mimeTypes[extension] ||
                "application/octet-stream";


            // ===============================
            // SET CONTENT TYPE
            // ===============================

            res.setHeader(
                "Content-Type",
                mimeType
            );


            // ===============================
            // OPEN IN BROWSER
            // ===============================

            res.setHeader(
                "Content-Disposition",
                "inline"
            );


            // ===============================
            // SEND FILE
            // ===============================

            res.sendFile(filePath);

        } catch (error) {

            console.error(
                "View File Error:",
                error
            );

            res.status(500).json({

                success: false,

                message: "Unable to view file"

            });

        }

    }
);


// ===============================
// UPLOAD FILES
// ===============================

router.post(
    "/upload",

    protect,

    upload.array("files", 5),

    uploadFile
);


// ===============================
// EXPORT ROUTER
// ===============================

module.exports = router;