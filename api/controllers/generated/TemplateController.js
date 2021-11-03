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

        db.list("email_templates", clauses, templateList => {
            //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3003');
            res.json({templates: templateList});
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

exports.createNewTemplate = async function(req, res, db) {
    try {
        const body = req.body;
        db.insertOne("email_templates", body, response => {
            res.json(response);
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

exports.fetchTemplate = function(req, res, db) {
    db.getOne("email_templates", req.params.templateId, data => {
        res.json({...data});
    })
}

exports.updateTemplate = function(req, res, db) {
    const body = req.body
    const templateId = req.params.templateId
    var modifiedData = body
    delete modifiedData.id
    delete modifiedData._id

    db.updateOne("email_templates", templateId, modifiedData, function(err, data) {
        if(err) {
            return res.status(500).send(err);
        }
        res.json(data);
    });

}

exports.deleteTemplate = function(req, res, db) {
    const templateId = req.params.templateId

    db.deleteOne("email_templates", templateId, function(err, data) {
        if (err) {
            console.log("error")
            return res.status(500).send(err);
        }
        console.log("The template has been deleted!")
        res.json({success: true});
    });

}
