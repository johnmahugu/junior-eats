'use strict';
const sgMail = require('@sendgrid/mail')
const myKey = "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"
sgMail.setApiKey(myKey)

const fs = require('fs')

exports.sendEmailToAllUsers = async function (req, res, db) {
    try {
        const query = req.query //orderBy=email query so it selects only the users with email
        const body = req.body
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


        db.insertOne("sent_emails", req.body, response => {
            console.log("Adding to sent_emails table: " + response.success)
        })

        db.list("users", clauses, userList => {

            const userData = userList.filter(u => (u.email !== '' && u.email != undefined))
                .filter(u => (u.firstName !== '' && u.firstName != undefined))
                .filter(u => (u.lastName !== '' && u.lastName != undefined))

            const userEmails = userData.map(u => u.email)
            const firstNames = userData.map(u => u.firstName)
            const lastNames = userData.map(u => u.lastName)

            const msg = {
                to: userEmails,
                from: body.from,
                subject: body.subject,
                sub: {
                    "-firstName-": firstNames,
                    "-lastName-" : lastNames,
                }
            }
            if (body.type === 'html') {
                msg['html'] = body.html //html limited on images/videous?
            } else {
                msg['text'] = body.text
            }

            sgMail.send(msg).then(() => {
                res.json({ success: true })
            }).catch((error) => {
                console.log(error.response.body);
                return res.status(500).send(error.response.body);
            })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
