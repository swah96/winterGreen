const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const VendorSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

VendorSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Vendor', VendorSchema);