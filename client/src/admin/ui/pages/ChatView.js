import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import io from 'socket.io-client'
import { useParams } from "react-router-dom";
import { getToken } from '../../../onboarding'
import { ClipLoader } from 'react-spinners';

import "../pages/styles.css"

const baseAPIURL = require('../../config').baseAPIURL;
const server = require('../../config').rootURL;
const socket = io.connect(server)

const ChatView = (props) => {
    const { userId } = useParams()
    const token = getToken()
    const [isLoading, setIsLoading] = useState(true)
    const [connected, setConnected] = useState(false);
    const [inputData, setInputData] = useState('')
    const [roomId, setRoomId] = useState('')
    const [messages, setMessages] = useState([])
    const [userData, setUserData] = useState({})
    const [loggedUserData, setLoggedUserData] = useState({})

    const loggedUser = jwt_decode(token)
    const loggedUserId = loggedUser.id;
    var COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];

    useEffect(() => {
        //on componentWillMount
        const fetchAllData = async () => {
            const channel = userId < loggedUserId ? userId + loggedUserId : loggedUserId + userId
            var myUserData = []
            await Promise.all([
                fetch(baseAPIURL + 'user/' + loggedUserId).then(ans => ans.text()),
                fetch(baseAPIURL + 'user/' + userId).then(ans => ans.text()),
            ]).then((data) => {
                data.forEach((user) => {
                    user = JSON.parse(user)
                    if (user && !user.username) {
                        user.username = user["firstName"] + ' ' + user["lastName"];
                    }
                    myUserData.push(user)
                    if (user.id === loggedUserId) {
                        setLoggedUserData(user)
                    } else {
                        setUserData(user)
                    }
                })
            })
            await fetch(baseAPIURL + 'chat/' + channel + "?orderBy=createdAt&desc=true")
                .then(response => response.json())
                .catch(err => {
                    console.log(err)
                    setIsLoading(false)
                })
                .then(data => {
                    if (data.messages === null) {
                        const participantProfilePictures = []
                        if (userData.profilePictureURL) {
                            participantProfilePictures.push({
                                pariticipantId: userId,
                                profilePictureURL: userData.profilePictureURL
                            })
                        }
                        if (loggedUserData.profilePictureURL) {
                            participantProfilePictures.push({
                                pariticipantId: loggedUserId,
                                profilePictureURL: loggedUserData.profilePictureURL
                            })
                        }
                        //this means there is not a channel created yet, so we have to create it
                        const response = fetch(baseAPIURL + 'chat/create', {
                            method: 'POST', // *GET, POST, PUT, DELETE, etc.
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                channelID: channel,
                                creatorID: loggedUserId,
                                participantProfilePictureURLs: participantProfilePictures,
                                // creator_id: loggedUserId,
                                id: channel,
                                name: '',
                                participants: myUserData,
                                readUserIDs: [],
                                typingUsers: [],
                            })
                        });
                        if (response.success === false) {
                            console.log("Unable to create the chat!")
                            setConnected(false)
                        }
                    } else {
                        //this means the chat exists and we got the data from it
                        if (data.messages && data.messages.length > 0) {
                            data.messages.forEach((message) => {
                                var username = message.senderFirstName + ' ' + message.senderLastName
                                addChatMessage({
                                    username: username,
                                    message: message.content,
                                    id: message.senderID,
                                }, {
                                    prepend: true,
                                });
                            })
                        }

                    }
                    setIsLoading(false)
                })
        }
        if (userId !== loggedUserId) {
            fetchAllData();
            socket.on('login', () => {
                setConnected(true)
                // Display the welcome message
                var message = "You've connected to the chat!";
                console.log(message);
            });

            socket.on('new message', (data) => {
                addChatMessage(data)
            })

        }
        if (roomId) {
            socket.emit('userDisconnected', roomId)
            setConnected(false)
        }
        const channel = userId < loggedUserId ? userId + loggedUserId : loggedUserId + userId
        setRoomId(channel)
        //On componentWillUnmount
        return () => {
            socket.emit('userDisconnected', roomId)
            setConnected(false)
        }
    }, []);

    useEffect(() => {
        if (roomId && loggedUserData.username && !connected) {
            socket.emit('userConnected', {
                room: roomId,
                username: loggedUserData.username,
            })
        }
    }, [roomId, loggedUserData])

    const handleInputChange = (event) => {
        setInputData(event.target.value)
    }

    const handleInputKeyPress = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }

    const pushMessage = async (data) => {
        const response = await fetch(baseAPIURL + 'chat/' + roomId, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...data })
        });
    }

    const sendMessage = () => {
        var message = inputData;
        if (!connected) {
            console.log("Not connected to the chat!")
            return;
        }
        if (message && connected) {
            const sendDate = new Date()
            const participantProfilePictures = []
            if (userData.profilePictureURL) {
                participantProfilePictures.push({
                    pariticipantId: userId,
                    profilePictureURL: userData.profilePictureURL
                })
            }
            if (loggedUserData.profilePictureURL) {
                participantProfilePictures.push({
                    pariticipantId: loggedUserId,
                    profilePictureURL: loggedUserData.profilePictureURL
                })
            }
            setInputData('')
            addChatMessage({
                username: loggedUserData.username,
                message: message,
                id: loggedUserId,
            });
            socket.emit('new message', {
                message: message,
                id: loggedUserId,
                room: roomId,
            });
            pushMessage({
                content: message,
                createdAt: sendDate,
                inReplyToItem: null,
                participantProfilePictureURLs: participantProfilePictures,
                readUserIDs: [],
                recipientFirstName: userData.firstName,
                recipientID: userId,
                recipientLastName: userData.lastName,
                recipientProfilePictureURL: userData.profilePictureURL ? userData.profilePictureURL : "",
                senderFirstName: loggedUserData.firstName,
                senderLastName: loggedUserData.lastName,
                senderID: loggedUserId,
                senderProfilePictureURL: loggedUserData.profilePictureURL ? loggedUserData.profilePictureURL : "",
                url: "",
            })
        }
    }
    const addChatMessage = (data, options) => {
        var usernameDiv =
            <span className="UsernameStyling" style={getUsernameColor(data.username)}>
                {data.username}
            </span>

        var messageBodyDiv =
            <span className="MessageBody">
                {data.message}
            </span>

        var messageClasses = "Message"
        if (data.typing != undefined) {
            messageClasses += " Typing"
        }

        var messageDiv =
            <li className={messageClasses}>
                {usernameDiv}:{' '}
                {messageBodyDiv}
            </li>

        addMessageElement(messageDiv, options);
    }
    const addMessageElement = (msg, options) => {

        // Setup default options
        if (!options) {
            options = {};
        }
        if (typeof options.prepend === 'undefined') {
            options.prepend = false;
        }

        // Apply options
        if (options.prepend) {
            setMessages( oldMessages => {
                var newMessages = [...oldMessages]
                newMessages.unshift(msg)
                return newMessages
            })
        } else {
            setMessages( oldMessages => {
                var newMessages = [...oldMessages]
                newMessages.push(msg)
                return newMessages
            })
        }
    }

    const getUsernameColor = (username) => {
        // Compute hash code
        var hash = 7;
        for (var i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + (hash << 6) - hash;
        }
        // Calculate color
        var index = Math.abs(hash % COLORS.length);
        return { color: COLORS[index] };
    }

    if (loggedUserId === userId) {
        return (
            <>
                <h3>You cannot chat with yourself!</h3>
            </>
        )
    }


    if (isLoading) {
        return (
            <div className="sweet-loading card">
                <div className="spinner-container">
                    <ClipLoader
                        className="spinner"
                        sizeUnit={"px"}
                        size={50}
                        color={'#123abc'}
                        loading={isLoading}
                    />
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="ChatArea">
                <div className="MessagesArea">
                    <ul className="Messages">
                        {messages && messages.map(msg => msg)}
                    </ul>
                </div>
                <div className="InputControls">
                    <input
                        className="InputMessage"
                        value={inputData}
                        placeholder="Type here..."
                        onKeyPress={handleInputKeyPress}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
        </>
    )
}

export default ChatView;