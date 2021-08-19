const bcrypt = require('bcryptjs');
const helpers = {};

helpers.encryptPassword = async(password) => {
    //Gen patron
    const salt = await bcrypt.genSalt(10);
    //Gen hash
    const hash = await bcrypt.hash(password,salt);
    return hash;

}

helpers.matchPassword = async (password,savedPassword) => {

    try {

        console.log('try de matchPass');
        return await bcrypt.compare(password,savedPassword);
    
    } catch (error) {

        console.log('catch de matchPass');
        console.log(error);
    }
}

module.exports = helpers;