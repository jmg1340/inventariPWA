const mongoose = require('mongoose');
const {Schema} = mongoose;

const shcInventari = new Schema ({
  // _id: "Object",
	Centro: 'String',
	Puesto: 'String',
	DenPuesto: 'String',
	FamiliaCCV: 'String',
	NSerie: 'String',
	Dossier: 'String',
	F_Baja: 'String',
	Designacion: 'String',
	PCR: 'String',
	PIN: 'String',
	// Tipo: 'String',
}, { collection : 'AsepeyoElements' })

module.exports = mongoose.model('AsepeyoElement', shcInventari)