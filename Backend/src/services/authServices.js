const Employers = require('../models/Employers');
const Companny = require('../models/Companny');
const bcrypt = require('bcrypt');
const jwt = require('../lib/jwt');
const CashBox = require('../models/Cashbox');

const SECRET = "superdupersecetlysecretsecret";

exports.register = async (email, username, password, rePassword, phoneNumber, role, companyID) => {
    if (password !== rePassword) {
        throw new Error('Wrong confirm password');
    }

    const exist = await Employers.findOne({ username })

    const hashedPassword = await bcrypt.hash(password, 4);

    if (exist) {
        throw new Error(username + ' is allready taken')
    }
    const employer = await Employers.create({ username, email, password: hashedPassword, phoneNumber, role, companyID });
    const company = await Companny.findById(companyID)
    if (!company) {
        throw new Error("Company not found")
    }
    company.employers.push(employer._id);
    await Companny.findByIdAndUpdate(companyID, company);
    return this.loginCompany(email, password);
}

exports.registerCompany = async (email, username, password, rePassword) => {
    if (password !== rePassword) {
        throw new Error('Wrong confirm password');
    }

    const exist = await Companny.findOne({ email })

    const hashedPassword = await bcrypt.hash(password, 4);

    if (exist) {
        throw new Error(email + ' is allready taken')
    }
    const createBancAccount = await CashBox.create({
        totalAmount: 0,
        totalForMonth: 0,
        additionalCosts: 0,
        employersSellary: 0,
        profit: 0,
        cost: 0
    })
    let company = await Companny.create({ username, email, password: hashedPassword, cashBox: createBancAccount._id });
    return this.loginCompany(email, password);
}


exports.login = async (email, password) => {
    // OPTIONAL const employer = await Employers.findOne({$or: [{email },{username}]})
    console.log(email, password);

    const employer = await Employers.findOne({ email });
    if (!employer) {
        throw new Error('wrong email or password');
    }

    const isValid = await bcrypt.compare(password, employer.password);
    if (!isValid) {
        throw new Error('wrong email or password');
    }

    const payload = {
        _id: employer?._id,
        email: employer?.email,
        username: employer?.username
    };

    const token = await jwt.sing(payload, SECRET);

    return {
        employerId: employer?._id,
        email: employer?.email,
        username: employer?.username,
        token
    }
};

exports.loginCompany = async (email, password) => {
    console.log(email, password);

    const company = await Companny.findOne({ email }).collation('employers');
    if (!company) {
        throw new Error('wrong email or password');
    }
    console.log(company);

    const isValid = await bcrypt.compare(password, company.password);
    if (!isValid) {
        throw new Error('wrong email or password');
    }

    const payload = {
        _id: employer?._id,
        email: employer?.email,
        username: employer?.username
    };

    const token = await jwt.sing(payload, SECRET);

    // TODO: if we need to send more information for company can send it like : 
    return {
        companyId: company?._id,
        email: company?.email,
        username: company?.username,
        cashBoxId: company?.cashBox,
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