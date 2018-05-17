const mongoose =  require('mongoose');
const userSchema = mongoose.Schema({
    name:{
        type: String
    },
    password:{
        type: String
    },
    admin:{
        type: Boolean
    }
})

module.exports = mongoose.model('User', userSchema)