const modelInvAsep = require('../models/modelInventariAsepeyo')



// llistat de tots els documents
exports.llistaTots = async  (req, res) => {
	console.log("Estic a la ruta /ASEPEYO")
	// res.send("L'API de l'inventari va aqui");
	try {
		const resultatInv = await modelInvAsep.find({})
		console.log(resultatInv)
		res.json(resultatInv)
		// res.send("funciona!!!")
	} catch (error) {
		console.log("S'HA PRODUIT UN ERROR a la ruta /asepeyo:")
		console.log(error)
	}
}

