const mongoose = require('mongoose');
const {Schema} = mongoose;

const shcInventari = new Schema ({
		// _id: "Object",
    edifici: 'String',
    planta: 'String',
    dept: 'String',
    lloc: 'String',
    elements: 'Object'
}, { collection : 'HospitalElements' })

module.exports = mongoose.model('HospitalElement', shcInventari)