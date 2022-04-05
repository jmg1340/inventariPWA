const mongoose = require('mongoose');
const {Schema} = mongoose;

const shcTelefon = new Schema ({
		// _id: "Object",
    model: 'String',    // si es CP901 o CP8811
    DEVICE_NAME: 'String',
    DESCRIPTION: 'String',
    MAC: 'String',
    EXT: 'String',
    SN: 'String',
    SW: 'String',
    PTO: 'String',
    
}, { collection : 'Telefons' })

module.exports = mongoose.model('Telefon', shcTelefon)