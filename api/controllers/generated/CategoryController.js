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

        db.list("vendor_categories", clauses, categoryList => {
            //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3003');
            res.json({categories: categoryList});
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

exports.createNewCategory = async function(req, res, db) {
    try {
        const body = req.body;
        db.insertOne("vendor_categories", body, response => {
            res.json(response);
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

exports.fetchCategory = function(req, res, db) {
    db.getOne("vendor_categories", req.params.categoryId, data => {
        res.json({...data});
    })
}

exports.updateCategory = function(req, res, db) {
    const body = req.body
    const categoryId = req.params.categoryId
    var modifiedData = body
    delete modifiedData.id
    delete modifiedData._id

    db.updateOne("vendor_categories", categoryId, modifiedData, function(err, data) {
        if(err) {
            return res.status(500).send(err);
        }
        res.json(data);
    });

}

exports.deleteCategory = function(req, res, db) {
    const categoryId = req.params.categoryId

    db.deleteOne("vendor_categories", categoryId, function(err, data) {
        if (err) {
            console.log("error")
            return res.status(500).send(err);
        }
        console.log("The category has been deleted!")
        res.json({success: true});
    });

}
