const mongoose = require('mongoose');
const {Schema} = mongoose;

const shcSwitch = new Schema ({
		// _id: "Object",
    edifici: 'String',
    planta: 'String',
    nomSw: 'String',
    numPorts: 'Integer'
}, { collection : 'Switchs' })

module.exports = mongoose.model('Switch', shcSwitch)