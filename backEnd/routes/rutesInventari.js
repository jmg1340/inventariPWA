const express = require("express");
const router = express.Router();


/* INVENTARI HOSPITAL */

const modelInvHosp = require('../models/modelInventariHospital')

// llistat de tots els documents
router.get("/hospital", async (req, res) => {
    // res.send("L'API de l'inventari va aqui");
    const resultatInv = await modelInvHosp.find({}, "edifici planta dept lloc elements")
		console.log(`nº registres: ${resultatInv.length}`)
    res.json(resultatInv)
});

// llista un sol document
router.get("/hospital/:id", async (req, res) => {
    const resultatInv = await modelInvHosp.findById(req.params.id)
    res.json(resultatInv)
});

// inserta nou document
router.post("/hospital", async (req, res) => {
	console.log("estic al ROUTER.POST del servidor")
	console.log(req.body)
	try {
		const nouDocument =  new modelInvHosp(req.body)
		console.log("nouDocument:")
		console.log(nouDocument)
		await nouDocument.save()
		res.json({status: "S'ha insertit nou document"})	
	} catch (error) {
		console.log("ERROR: \n" + error)
	}

});

// actualitza un document
router.put("/hospital/:id", async (req, res) => {
	console.log("estic al ROUTER.PUT del servidor")
	console.log(req.body)
	const resultatInv = await modelInvHosp.findByIdAndUpdate(req.params.id, req.body)
	res.json({status: "S'ha actualitzat document" + resultatInv})
});

// elimina un document
router.delete("/hospital/:id", async (req, res) => {
    const resultatInv = await modelInvHosp.findByIdAndRemove(req.params.id)
    res.json({status: "S'ha eliminat document"})
});





/* INVENTARI ASEPEYO */

const modelInvAsep = require('../models/modelInventariAsepeyo')

// llistat de tots els documents
router.get("/asepeyo", async (req, res) => {
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

});





module.exports = router;
