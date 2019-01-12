const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname + "-" + Date.now());
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }
    else {
        cb(new Error('invalid image type'), false);
    }
};

//folder where multer will try to store incoming files
//OLD WAY: const upload = multer({dest: 'uploads/'});
const upload = multer({
    storage: storage,
    limits: {
    fileSize: 1024 * 1024 * 5 //5MB
    },
    fileFilter: fileFilter
});

//anything on /products

router.get("/", ProductsController.products_get_all);

/* dummy
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET requests to /products'
    });
});
*/

    /*
        IMAGES - CREATE ADDITIONAL ENDPOINT WHICH ACCEPTS BINARY DATA
                 OR
                 USE THE SAME ENDPOINT WITH FORMDATA (MULTER PACKAGE)
    */

    //upload.single will parse file
    //handlers are executed from left to right
    //auth later because upload takes care of body parsing
    //but it is better to use a header
  //router.post('/', upload.single('productImage'), checkAuth, (req, res, next) => {
  router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

    //promises run asynchroniously
    router.get('/:productId', checkAuth, ProductsController.products_get_product);

/* dummy code

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'special'){
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID',
            id: id
        });
    }
});

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated product!'
    });
});
*/
/*dummy
router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted product!'
    });
});
*/

router.patch("/:productId", ProductsController.products_update_product);

router.delete("/:productId", ProductsController.products_delete_product);

module.exports = router;