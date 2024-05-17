const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors');

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user })
}

module.exports = {
    showCurrentUser
}