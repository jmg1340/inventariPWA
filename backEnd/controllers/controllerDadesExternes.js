const modelES = require('../models/modelElasticSearch')
const fs = require('fs');



// llistar contingut fitxer
exports.importar = async (req, res) => {
	console.log("Estic a la ruta /DADES EXTERNES")
	// res.send("L'API de l'inventari va aqui");

	fs.readFile('dadesExternes/' + req.params.fitxer, 'utf8' , (err, data) => {
		if (err) {
			console.error(err)
			res.send(err)
			return
		}
		res.send(data)
	})

}


// eliminar tots els documents de la col·leccio 'ES_registres'
exports.eliminarRegistresES = async (req, res) => {
	console.log("Estic controllerDadesExternes - eliminar registres ES")
	const resultatInv = await modelES.deleteMany()
	res.json({status: "S'han eliminat tots els docs de la colecció 'ES_registres'"})
}




// inserir documents a la coleccio 'ES_registres'
exports.inserirRegistresES = async (req, res) => {
	console.log("Estic a controllerDadesExternes - inserir registres ES")
	try {
		const arr = JSON.parse(req.body.dades)
		
		await modelES.insertMany(arr)
		res.json({status: "S'han inserit " + arr.length + " docs"})	
	} catch (error) {
		console.log("ERROR insercio dades a ES_registres: \n" + error)
		res.json({status: "Hi ha hagut un problema\n " + error})	
	}


}



// llistat de tots els documents de ES_registres
exports.llistaTots = async  (req, res) => {
    const resultatInv = await modelES.find({})
		console.log(`nº registres: ${resultatInv.length}`)
    res.json(resultatInv)
}
