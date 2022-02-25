import Axios from "axios";
const server = "http://localhost:3001";


/* DADES EXTERNES */

export async function actGetCSV(context, fitxer) {
  try {
    const result = await Axios.get(server + "/api_inventari/dadesExternes/" + fitxer)
    const data = result.data;
		console.log("data (actGetCSV)");

		// *** TRANSFORMACIO A FITXER JSON ***

		// 1. separem per linies
		const arrLinies = data.split("\r\n")
		// console.log("arrLinies", arrLinies)

		let arrNomCamps = []
		let arrJSON = []
		// 2. per cada linia, seprarem per comes i creem objecte JSON amb les dades com a propietats
		arrLinies.forEach( (linia, indice) => {
			const arrDades = linia.split(",")
			
			if (indice === 0) {   // a la primera linia hi ha els noms dels camps
				arrNomCamps = arrDades
			} else {
				// per cada dada, anem construint objecte on cada propietat sera un camp
				let obj = {}
				arrDades.forEach( (dada, index) => {
					obj[arrNomCamps[index]] = dada
				})

				// un cop construit l'objecte, l'afegim al array
				arrJSON.push(obj)
			}
		})





		// Les dades de arrJSON fins ara, son un historial dels inicis de sessió dels ordinadors. Per tant ens interessa fer un llistat unic de NS de cpus i sobre aquest llistat trobar la dada més actual de arrJSON.

		// 1. de totes els registres (arrJSON) fem un array de ns PC unics
		const arrNSUnics = arrJSON.reduce((acc,item)=>{
			if(! acc.includes(item.HARDWARE_NAME)){
				acc.push(item.HARDWARE_NAME);
			}
			return acc;
		},[])

			
		// 2. Per cada ns de arrNSUnics, obtenim el primer objecte coincident (que serà el més actual) per ns segons obj.HARDWARE_NAME
		const arrObjsDadesCSV = arrNSUnics.map ( ns => {
			return arrJSON.find( obj => obj.HARDWARE_NAME.toUpperCase().includes( ns.toUpperCase() ))
		})


		// Aprofite per modificar la propietat on apareix al info del SW per a que quan sigui una mac de telf (*.asepeyo.site) modifiqui aquest valor per a que sigui nomes la mac (sense el 'SEP' i el '.asepeyo.site')

		arrObjsDadesCSV.map ( obj => {
			if (  /.asepeyo.site$/.test(obj.LLDP_RID1_SWITCH_SYSNAME) ) {
				obj.LLDP_RID1_SWITCH_SYSNAME = obj.LLDP_RID1_SWITCH_SYSNAME.split(".")[0].substring(3)					
			}
			return obj
		})
		







		// GUARDAR LES DADES A LA COLECCIÓ "ES_temporal"
		
		try {

			// 1. Eliminar la colecció "ES_temporal" cas de que existeixi
			const objResultat = await Axios.get(server + "/api_inventari/eliminarColeccio/ES_temporal")
			// const data = objResultat.snEliminada;  // false: la coleccio no existeix i no l'ha pogut eliminar
																						 // true: sí existeix i l'ha pogut eliminar.

			// context.commit( "Eliminada coleccio 'ES_temporal'?", objResultat.snEliminada);

			// 2. Creem de nou la colecció amb les dades de arrJSON
			const objResultat2 = await Axios.get(server + "/api_inventari/crearColeccio", { params: { coleccio: "ES_temporal", dades: JSON.stringify(arrJSON) } })

	
		} catch (error) {
			console.log("error a actGetDocs")
			console.log( error )
		}		






    return {arrObjsDadesCSV, arrNomCamps}

  } catch (error) {
    console.log("error a actGetCSV")
    console.log( error )
  }
}
  



/* INVENTARI HOSPITAL */

export async function actGetDocs(context) {
  try {
    const result = await Axios.get(server + "/api_inventari/hospital")
    const data = result.data;
    context.commit( "mutGetDocs", data);

  } catch (error) {
    console.log("error a actGetDocs")
    console.log( error )
  }
}
  

export async function actRemoveDoc(context, id) {
  try {
    await Axios.delete(server + "/api_inventari/hospital/" + id)
		await context.dispatch('actGetDocs')
  } catch (error) {
    console.log("error a actRemoveDoc")
    console.log( error )
  }
}
  
export async function actActualitzarDoc(context, payload) {
  try {
    await Axios.put(server + "/api_inventari/hospital/" + payload.idMongo, payload.registre)
		await context.dispatch('actGetDocs')
  } catch (error) {
    console.log("error a actActualitzarDoc")
    console.log( error )
  }
}
  
export async function actAdd(context, obj) {
	console.log("estic a actAdd")
	console.log(obj)
  try {
		await Axios.post(server + "/api_inventari/hospital", obj)
		await context.dispatch('actGetDocs')
  } catch (error) {
    console.log("error a actPost")
    console.log( error )
  }

}





/* INVENTARI ASEPEYO */

export async function actGetDocsAsepeyo(context) {
  try {
    const result = await Axios.get(server + "/api_inventari/asepeyo")
    const data = result.data;
    context.commit( "mutGetDocsAsepeyo", data);

  } catch (error) {
    console.log("error a actGetDocsAsepeyo")
    console.log( error )
  }
}


