const User = require("../models/User")

exports.getAllUsers = async () => {
    const data = await User.find({}, { password: 0, __v: 0 });

    if (!data) {
        throw new Error("No user found here");
    }
    return data;
}
