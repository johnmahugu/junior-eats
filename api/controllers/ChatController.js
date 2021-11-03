'use strict';

exports.initializeUserChat = function (app, db, server) {
    const io = require('socket.io')(server);
    io.on('connection', (socket) => {
        socket.on('userConnected', (data) => {
            socket.join(data.room)
            socket.username = data.username
            socket.emit('login')
            // console.log(socket.id)
        })
        socket.on('userDisconnected', socket.leave)

        socket.on('new message', (data) => {
            // we tell the client to execute 'new message'
            socket.to(data.room).emit('new message', {
                username: socket.username,
                id: data.id,
                message: data.message,
            });
        });

        // when the client emits 'typing', we broadcast it to others
        socket.on('typing', () => {
            socket.broadcast.emit('typing', {
                username: socket.username
            });
        });

        // when the client emits 'stop typing', we broadcast it to others
        socket.on('stop typing', () => {
            socket.broadcast.emit('stop typing', {
                username: socket.username
            });
        });

    })
}

exports.addMessage =  async function (req, res, db) {
    try {
        const channel = req.params.channel
        const body = req.body;
        db.insertMessage("channels", channel, body, response => {
            console.log("Adding message to " + channel + " success: " + response.success)
            res.json(response);
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

exports.createChat = async function (req, res, db) {
    try {
        const body = req.body;
        const channel = body.channelID
        db.createChat("channels", channel, body, response => {
            console.log("Creating the chat " + channel + " success: " + response.success)
            res.json(response);
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

exports.getChat = async function(req, res, db) {
    try {
        const channel = req.params.channel
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

        db.getChat('channels', channel, clauses, messages => {
            res.json({messages: messages});
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};