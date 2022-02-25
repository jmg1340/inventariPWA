const MongoClient = require("mongodb");
const objConnexio = require('../dadesConexioBD')
const fs = require('fs');



// llistar contingut fitxer
exports.llista = async (req, res) => {
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


// eliminar coleccio
exports.eliminarColeccio = async (req, res) => {
	console.log("Estic controllerDadesExternes - eliminar coleccio")
	MongoClient.connect(objConnexio.servidor.ruta, objConnexio.servidor.opcions).then((client) => {
  
			// Reference of database
			const bdd = client.db(objConnexio.bdd);
		
			console.log("req.params.coleccio", req.params.coleccio)
			// Dropping the colecció
			bdd.collection(req.params.coleccio).drop( (err, result) => {
        // if (err) throw err;
        if (result) console.log("Collection successfully deleted.");
        client.close();
    	})
			
			// console.log(`colecció '${req.params.coleccio}' ELIMINADA?`, snEliminada);
			// return snEliminada

	}).catch((err) => {
			console.log("ERROR eliminació de coleccio", err)
	})

}




// crear coleccio
exports.crearColeccio = async (req, res) => {
	console.log("Estic a controllerDadesExternes - crear coleccio")
	MongoClient.connect(objConnexio.servidor.ruta, objConnexio.servidor.opcions).then((client) => {
  
			// Reference of database
			const connect = client.db(objConnexio.bdd);
		
			// New Collection
			const objResultat = connect.createCollection(req.params.coleccio);
			console.log(`colecció '${req.params.coleccio}' CREADA?`, JSON.stringify(objResultat));

			// introduim les dades a la coleccio
			const colection = database.collection(req.params.coleccio);
			const result =  colection.insertMany(JSON.parse(req.params.data));



			return objResultat

	}).catch((err) => {
			console.log("ERROR creació de coleccio", err.Message);
	})

}
