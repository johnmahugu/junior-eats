'use strict';

exports.list = async function(req, res, db) {
    try {
        const query = req.query
        const orderByClause = (query && query.orderBy ? {
                field: query.orderBy,
                desc: query.desc
            } : null
        )
        var clauses = {}
        if (orderByClause) {
            clauses.orderByClause = orderByClause
        }
        if (query.search) {
            clauses.search = query.search
        }
        if (query.limit) {
            clauses.limit = query.limit
        }

        db.list("vendor_products", clauses, productList => {
            //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3003');
            res.json({products: productList});
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

exports.createNewProduct = async function(req, res, db) {
    try {
        const body = req.body;
        db.insertOne("vendor_products", body, response => {
            res.json(response);
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

exports.fetchProduct = function(req, res, db) {
    db.getOne("vendor_products", req.params.productId, data => {
        res.json({...data});
    })
}

exports.updateProduct = function(req, res, db) {
    const body = req.body
    const productId = req.params.productId
    var modifiedData = body
    delete modifiedData.id
    delete modifiedData._id

    db.updateOne("vendor_products", productId, modifiedData, function(err, data) {
        if(err) {
            return res.status(500).send(err);
        }
        res.json(data);
    });

}

exports.deleteProduct = function(req, res, db) {
    const productId = req.params.productId

    db.deleteOne("vendor_products", productId, function(err, data) {
        if (err) {
            console.log("error")
            return res.status(500).send(err);
        }
        console.log("The product has been deleted!")
        res.json({success: true});
    });

}
