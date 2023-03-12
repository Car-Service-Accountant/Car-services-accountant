const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('../lib/jwt');

const SECRET = "superdupersecetlysecretsecret";

exports.register = async (username, email, password, rePassword) => {
    if (password !== rePassword) {
        throw new Error('Wrong confirm password');
    }

    const exist = await User.findOne({ username })

    const hashedPassword = await bcrypt.hash(password, 4);

    if (exist) {
        throw new Error('Ussername is allready taken')
    }
    await User.create({ username, email, password: hashedPassword });
    return this.login(username, password);
}

exports.login = async (username, password) => {
    // OPTIONAL const user = await User.findOne({$or: [{email },{username}]})
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('wrong email or password');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new Error('wrong email or password');
    }

    const payload = {
        _id: user._id,
        email: user.email,
        username,
    };
    const token = await jwt.sing(payload, SECRET);

    return token;
};

exports.tokenVerify = async (token) => {
    try{
        const decodedToken = await jwt.verify(token, SECRET);
        return decodedToken;
    }catch(err){
        throw new Error(err || "Token is invalid")
    }
    
}