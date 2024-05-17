const User = require('../models/User')
const CustomError = require('../errors');
const { createJWT } = require('../util/jwt')
const createTokenUser = require('../util/createTokenUser')
const { StatusCodes, CREATED } = require('http-status-codes')
const register = async (req, res) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        throw new CustomError.BadRequestError(`Provide all the details`)
    }
    const emailAlreadyExists = await User.findOne({ email })
    if (emailAlreadyExists) {
        throw new CustomError.BadRequestError('Email already exists.')
    }
    const isFirstAccount = await User.countDocuments({}) === 0;
    const role = isFirstAccount ? 'admin' : 'user';
    const user = await User.create({ name, email, password, role });


    const tokenUser = createTokenUser(user);
    const token = createJWT({ payload: tokenUser });

    res.status(StatusCodes.CREATED).json({ user: tokenUser, token: token })

}
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new CustomError.BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new CustomError.UnauthenticatedError('Invalid credentials')
    }

    //compare passwords
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid credentials')
    }
    const tokenUser = createTokenUser(user)
    const token = createJWT({ payload: tokenUser })

    res.status(StatusCodes.OK).json({ user: tokenUser, token: token })
}
const logout = async (req, res) => {
    // Simple logout without any server-side token blacklisting
    res.status(StatusCodes.OK).json({ msg: "Logout successful" });
}
module.exports = {
    register,
    login,
    logout,
}