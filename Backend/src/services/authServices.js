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
    let company = await Companny.create({ username, email, password: hashedPassword, cashBox: createBancAccount._id, role: "админ" });
    return this.loginCompany(email, password);
}


exports.login = async (email, password) => {
    const employer = await Employers.findOne({ email });
    if (!employer) {
        try {
            const data = await this.loginCompany(email, password)
            return data;
        } catch (err) {
            throw new Error("Wrong password or email")
        }
    }
    const isValid = await bcrypt.compare(password, employer.password);
    if (!isValid) {
        throw new Error('wrong email or password password is not valid');
    }
    const company = await getCompany(employer?.companyID?.toString())
    const payload = {
        _id: employer?._id.toString(),
        email: employer?.email,
        username: employer?.username
    };
    const token = await jwt.sing(payload, SECRET);
    const data = {
        _id: employer?._id.toString(),
        email: employer?.email,
        phoneNumber: employer?.phoneNumber,
        username: employer?.username,
        cashBoxID: company?.cashBox,
        role: employer?.role,
        token: token
    }
    return data
};

exports.loginCompany = async (email, password) => {
    const company = await Companny.findOne({ email }).populate('employers');
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
        role: company?.role,
        employers: company?.employers,
        token
    }
};

exports.tokenVerify = async (token) => {
    try {
        const decodedToken = await jwt.verify(token, SECRET);
        return decodedToken;
    } catch (err) {
        return null
    }
}

exports.renewedToken = async (data) => {
    if (!data?._id) {
        throw new Error("Invalid token")
    }
    const employer = await getCurrentEmployer(data._id);
    try {
        if (!employer) {
            const company = await getCompany(data._id);
            console.log("company", company);
            const payload = {
                _id: company?._id.toString(),
                email: company?.email,
                username: company?.username
            };
            const reNewedToken = await jwt.sing(payload, SECRET);
            const returnedData = {
                _Id: company?._id.toString(),
                email: company?.email,
                phoneNumber: company?.phoneNumber,
                username: company?.username,
                employers: company?.employers,
                cashBoxID: company?.cashBox,
                role: company?.role,
                token: reNewedToken
            }
            return returnedData;
        }
        const company = await getCompany(employer?.companyID?.toString())
        console.log(company);
        const payload = {
            _id: employer?._id.toString(),
            email: employer?.email,
            username: employer?.username
        };
        const reNewedToken = await jwt.sing(payload, SECRET);
        const returnedData = {
            _Id: employer?._id.toString(),
            email: employer?.email,
            phoneNumber: employer?.phoneNumber,
            username: employer?.username,
            cashBoxID: company?.cashBox,
            role: employer?.role,
            token: reNewedToken
        }
        return returnedData;
    } catch (err) {
        throw new Error("Something gones wrong")
    }
}