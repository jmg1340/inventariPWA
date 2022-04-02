const mongoose = require('mongoose');
const {Schema} = mongoose;

const shcTelefon = new Schema ({
		// _id: "Object",
    model: 'String',    // si es CP901 o CP8811
    deviceName: 'String',
    description: 'String',
    mac: 'String',
    ext: 'String',
    sn: 'String',
    switch: 'String',
    pto: 'String',
    
}, { collection : 'Telefons' })

module.exports = mongoose.model('Telefon', shcTelefon)