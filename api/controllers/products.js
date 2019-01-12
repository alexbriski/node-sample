const Product = require('../models/product');
const mongoose = require('mongoose');

exports.products_get_all = (req, res, next) => {
    //Product.find().limit()
    Product.find()
    .select("name price _id productImage")
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: process.env.SERVER_URL + '/products/' + doc.id
                    }
                }
            })
        };
        res.status(200).json(response);
        /* raw response
        console.log(docs);
        if (docs.length > 0){
            res.status(200).json(docs);
        } else {
            res.status(404).json({
                error: "No products found"
            });
        }
        */
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.products_create_product =  (req, res, next) => {
    console.log(req.file); //due to upload.single middleware
const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file == null ? ' ' : req.file.path
});
//exec turns into a promise
product.save().then(result => {
    console.log(result);
    //runs after saving
    res.status(201).json({
        message: 'Created product succesfully',
        createdProduct: {
            name: result.name,
            price: result.price,
            _id: result.id,
            productImage: result.productImage,
            request: {
                type: 'GET',
                url: process.env.SERVER_URL + '/products/' + result.id
            }
        }
    });
}).catch(err => {
    console.log(err);
    res.status(500).json({
        error: err
    }); 
});

}

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if (doc){            
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'get all products',
                    url: process.env.SERVER_URL + '/products'
                }
            });
        } else {
            res.status(404).json({
                error: "No valid entry for id " + id
            });
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
};

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    //$set: key value pair instructions on how to update the object
    Product.update({_id: id}, {
//        $set: { name: req.body.newName, price: req.body.newPrice }
        $set: updateOps
    })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'GET',
                url: process.env.SERVER_URL + '/products/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(200).json({
            error: err
        })
    });
};

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Product deleted",
            request: {
                type: "POST",
                url: process.env.SERVER_URL + "/products/",
                data: {
                    name: "String",
                    price: "Number"
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};