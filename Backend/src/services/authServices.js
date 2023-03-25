const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('../lib/jwt');

const SECRET = "superdupersecetlysecretsecret";

exports.register = async (email, username, password, rePassword, phoneNumber, role) => {
    console.log(email, username, password, rePassword, phoneNumber, role);
    if (password !== rePassword) {
        throw new Error('Wrong confirm password');
    }

    const exist = await User.findOne({ username })

    const hashedPassword = await bcrypt.hash(password, 4);

    if (exist) {
        throw new Error(username + ' is allready taken')
    }
    await User.create({ username, email, password: hashedPassword, phoneNumber, role });
    return this.login(email, password);
}

exports.login = async (email, password) => {
    // OPTIONAL const user = await User.findOne({$or: [{email },{username}]})
    console.log(email, password);

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('wrong email or password');
    }
    console.log();
    console.log(user);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new Error('wrong email or password');
    }

    const payload = {
        _id: user?._id,
        email: user?.email,
        username: user?.username
    };

    const token = await jwt.sing(payload, SECRET);

    // TODO: if we need to send more information for user can send it like : 
    return {
        userId: user?._id,
        email: user?.email,
        username: user?.username,
        token
    }
};

exports.tokenVerify = async (token) => {
    try {
        const decodedToken = await jwt.verify(token, SECRET);
        return decodedToken;
    } catch (err) {
        throw new Error(err || "Token is invalid")
    }

}