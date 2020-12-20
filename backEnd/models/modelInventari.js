const mongoose = require('mongoose');
const {Schema} = mongoose;

const shcInventari = new Schema ({
    edifici: 'String',
    planta: 'String',
    dept: 'String',
    lloc: 'String',
    elements: 'Object'
})

module.exports = mongoose.model('inventari', shcInventari)