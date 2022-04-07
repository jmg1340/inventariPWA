const modelTelf = require('../models/modelTelefons')
const fs = require('fs');





// eliminar tots els documents de la col·leccio 'ES_registres'
exports.eliminarRegistresTelefons = async (req, res) => {
	// console.log("Estic conrollerDadesTelefons - eliminarRegistresTelefons")
	
	let resultatInv = null
	const strModel = req.params.model
	console.log("conrollerDadesTelefons -  eliminarRegistresTelefons - strModel", strModel)

	try {
		switch (strModel){
			case "CP8811":
			case "CP6901":
				resultatInv = await modelTelf.deleteMany({ model: strModel })
				break
			case "TOTS":
				resultatInv = await modelTelf.deleteMany()
				break
			}
		res.json({status: "S'han eliminat docs de la colecció 'Telefons'"})
	} catch (error) {
		console.log("Error al eliminar registres de Telefons:", error)
		res.json({status: "Error al eliminar registres de Telefons:"})
	}

}




// inserir documents a la coleccio 'ES_registres'
exports.inserirRegistresTelefons = async (req, res) => {
	console.log("Estic a controllerDadesExternes - inserir registres Telefons")
	try {
		const arr = JSON.parse(req.body.dades)
		console.log("INSERIR REGISTRES Telefons - arr", arr)

		await modelTelf.insertMany(arr)
		res.json({status: "S'han inserit " + arr.length + " docs"})	
	} catch (error) {
		console.log("ERROR insercio dades a colecció Telefons: \n" + error)
		res.json({status: "Hi ha hagut un problema al inserir dades a colecció 'Telefons' \n " + error})	
	}


}



// llistat de tots els documents de ES_registres
exports.llistaTots = async  (req, res) => {
		console.log("controllerDadesTelefons - llistaTots")
    try {
			const resultatInv = await modelTelf.find({})
			console.log(`nº registres: ${resultatInv.length}`)
			res.json(resultatInv)			
		} catch (error) {
			res.json(error)
		}

}



exports.eliminarFitxerCSV = async (req, res) => {
	console.log("CONTROLLER_DADESEXTERNES - eliminarFitxerCSV")
	console.log("req.params.fitxer", req.params.fitxer)

	try {
		fs.unlinkSync('dadesExternes/' + req.params.fitxer)		// eliminació del fitxer
		res.json({missatge: "fitxer eliminat"})
	} catch (err) {
		res.status(500).send(err);
	}	
}