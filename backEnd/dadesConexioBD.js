
// DADES PER A LA CONNEXIO DE LA BDD DE MONGODB.
// Les utilitzem per a la connexio de moongose i el client

module.exports = {
	servidor: { 
		ruta: 'mongodb://localhost/inventaridb',
		opcions: { useNewUrlParser: true, useUnifiedTopology: true  }
	},
	bdd: 'inventaridb'
}