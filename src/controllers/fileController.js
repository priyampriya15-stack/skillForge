const uploadFile = async (req, res, next) => {
    try {

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please select at least one file"
            });
        }

        const files = req.files.map((file) => {
            return {
                filename: file.filename,
                originalName: file.originalname,
                path: file.path,
                size: file.size,
                mimetype: file.mimetype
            };
        });

        res.status(200).json({
            success: true,
            message: "Files uploaded successfully",
            count: files.length,
            files: files
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadFile
};