const modelInvHosp = require('../models/modelInventariHospital')

/** 
* Recupera tots els documents
* @return {json} documents recuperats.
*/
exports.llistaTots = async  (req, res) => {
    // res.send("L'API de l'inventari va aqui");
    const resultatInv = await modelInvHosp.find({}, "edifici planta dept lloc elements")
		console.log(`nº registres: ${resultatInv.length}`)
    res.json(resultatInv)
}


/** 
* recupera un document
* @return {json} document recuperat.
*/
exports.llistaUn = async (req, res) => {
	const resultatInv = await modelInvHosp.findById(req.params.id)
	res.json(resultatInv)
}



/** 
* Inserta un document
* @return {json} status de la operació d'inserció.
*/
exports.insertaUn = async (req, res) => {
	// console.log("estic al ROUTER.POST del servidor")
	// console.log(req.body)
	try {
		const nouDocument =  new modelInvHosp(req.body)
		console.log("nouDocument:")
		console.log(nouDocument)
		await nouDocument.save()
		res.json({status: "S'ha insertit nou document"})	
	} catch (error) {
		console.log("ERROR: \n" + error)
	}
}


/** 
* Actualitza un document
* @return {json} status de la operació d'actualitzacio.
*/
exports.actualitzaUn = async (req, res) => {
	console.log("estic al ROUTER.PUT del servidor")
	console.log(req.body)
	const resultatInv = await modelInvHosp.findByIdAndUpdate(req.params.id, req.body)
	res.json({status: "S'ha actualitzat document" + resultatInv})
}



/** 
* Elimina un document
* @return {json} status de la operació d'eliminació.
*/
exports.eliminaUn = async (req, res) => {
	const resultatInv = await modelInvHosp.findByIdAndRemove(req.params.id)
	res.json({status: "S'ha eliminat document"})
}