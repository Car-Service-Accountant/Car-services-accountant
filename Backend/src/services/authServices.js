const Employers = require('../models/Employers');
const Companny = require('../models/Companny');
const bcrypt = require('bcrypt');
const jwt = require('../lib/jwt');
const CashBox = require('../models/Cashbox');
const { getCompany } = require('../services/companyService');
const { getCurrentEmployer } = require('./employerServices');

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
    const company = await Companny.findById(companyID)
    if (!company) {
        throw new Error("Company not found")
    }
    const employer = await Employers.create({ username, email, password: hashedPassword, phoneNumber, role, companyID });
    company.employers.push(employer._id);
    await Companny.findByIdAndUpdate(companyID, company);
    return this.login(email, password);
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

    const employer = await Employers.findOne({ email });
    if (!employer) {
        throw new Error('wrong email or password');
    }

    const isValid = await bcrypt.compare(password, employer.password);
    if (!isValid) {
        throw new Error('wrong email or password');
    }
    const company = await getCompany(employer?.companyID?.toString())
    const payload = {
        _id: employer?._id.toString(),
        email: employer?.email,
        username: employer?.username
    };
    const token = await jwt.sing(payload, SECRET);
    const data = {
        employerID: employer?._id.toString(),
        email: employer?.email,
        username: employer?.username,
        cashBoxID: company?.cashBox,
        role: employer?.role,
        token: token
    }
    return data
};

exports.loginCompany = async (email, password) => {
    console.log(email, password);

    const company = await Companny.findOne({ email }).populate('employers');
    console.log(company);
    if (!company) {
        throw new Error('wrong email or password');
    }

    const isValid = await bcrypt.compare(password, company.password);
    if (!isValid) {
        throw new Error('wrong email or password');
    }

    const payload = {
        _id: company?._id,
        email: company?.email,
        username: company?.username
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

exports.renewedToken = async (data) => {
    const employer = await getCurrentEmployer(data._id);
    const company = await getCompany(employer?.companyID?.toString())

    const payload = {
        _id: employer?._id.toString(),
        email: employer?.email,
        username: employer?.username
    };
    const reNewedToken = await jwt.sing(payload, SECRET);
    const returnedData = {
        employerID: employer?._id.toString(),
        email: employer?.email,
        username: employer?.username,
        cashBoxID: company?.cashBox,
        role: employer?.role,
        token: reNewedToken
    }
    return returnedData;
}