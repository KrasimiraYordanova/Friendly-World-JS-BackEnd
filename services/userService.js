const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'thedreamerisdreamingagainsheesh';

async function register(email, password) {
    const existingUser = await User.findOne({ email }).collation({ locale: 'en', strength: 2});
    if(existingUser) {
        throw new Error('Email is already taken');
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({ email, hashedPass });
    return createTokenSession(user);
}

async function login(email, password) {
    const user = await User.findOne({email}).collation({locale:'en', strength: 2});
    if(!user) {
        throw new Error('Incorrect email or password!');
    }
    const hashMatch = await bcrypt.compare(password, user.hashedPass);
    if(hashMatch == false) {
        throw new Error('Incorrect email or password!');
    }
    return createTokenSession(user);
}

function createTokenSession({ _id, email }) {
    const payload = {
        _id,
        email
    }
    const token = jwt.sign(payload, JWT_SECRET);
    return token;
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}


module.exports = {
    register,
    login,
    verifyToken
}