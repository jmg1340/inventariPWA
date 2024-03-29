import Axios from "axios";
const server = "http://localhost:3001";



/* DADES TELEFONS */

export async function actLlistarDadesTelefons ( context) {
  // console.log("context", context)
  try {
    const objResultat3 = await Axios.get( server + "/api_inventari/llistarRegistresTelefons" );
    console.log("objResultat3", objResultat3);
    const arrJSON = objResultat3.data;
		console.log("arrJSON", arrJSON)
    context.commit("mutGetDocsTelefons", arrJSON)
    
    return  arrJSON;    
  } catch (error) {
    console.log("Error actLlistarDadesTelefons", error)
  }

}


export async function actGetCSV_Telefons(context, obj) {
  try {

    let formData = new FormData();
    formData.append("file", obj.fitxer);

    // pujar el fitxer al servidor
    const resultPujarFitxer = await Axios.post(
      server + "/api_inventari/upload/", 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    console.log("ACTIONS - actGetCSV_Telefons - resultPujarFitxer", resultPujarFitxer)

    // Obtencio de les dades en brut del fitxer
    console.log("ACTIONS - actGetCSV_Telefons - fitxer.name = ", obj.fitxer.name)
    const result = await Axios.get(
      server + "/api_inventari/importarDadesFitxer/" + obj.fitxer.name
    );
    const data = result.data;
    console.log("ACTIONS - actGetCSV_Telefons - data = ", data)



    // *** TRANSFORMACIO A FITXER JSON per despres importar-lo a la coleccio Telefons***

    // 1. separem per linies
    const arrLinies = data.split("\n");
    // console.log("ACTIONS - actGetCSV - arrLinies", arrLinies);


    let arrNomCamps = [];
    let arrJSON = [];
    // 2. per cada linia, seprarem per comes i creem objecte JSON amb les dades com a propietats
    console.log("arrLinies", arrLinies)
		arrLinies.forEach((linia, indice) => {
			console.log("actGetCSV_Telefons - linia:" + linia)
			if (linia.trim().length === 0) return   // si una linia no te dades, processar següent linia
      
			const arrDades = linia.trim().split(",");

      if (indice === 0) {
        // a la primera linia hi ha els noms dels camps
        arrNomCamps = arrDades.map( (element) => {
					element.replace(/["]+/g, '')  // treiem les " si en te
					if (element === "DEVICE NAME") element = "DEVICE_NAME"
					return element
				}); 
        arrNomCamps.push("model")   // afegim nom del camp 'model'
				console.log("arrNomCamps", arrNomCamps)

        console.log("ACTIONS - actGetCSV_Telefons - arrNomCamps", arrNomCamps)
      } else {
        // per cada dada, anem construint objecte on cada propietat sera un camp
        let obj2 = {};
        arrDades.forEach((dada, index) => {
          obj2[arrNomCamps[index]] = dada.replace(/["]+/g, '');  // treiem les " si en te
        });
				obj2.model = obj.modelTelf   // afegim el model de Telefon

        // un cop construit l'objecte, l'afegim al array
        arrJSON.push(obj2);
      }
    });

    console.log("ACTIONS - actGetCSV - arrJSON", arrJSON);

 

    // GUARDAR LES DADES A LA COLECCIÓ "Telefons"

    try {
      // // 1. Eliminar registres de "Telefons"
      // const objResultat = await Axios.delete(
      //   server + "/api_inventari/eliminarRegistresTelefons"
      // );
      // console.log("objResultat ELIMINACIO registres/docs Telefons: ", objResultat);

      // 2. Afegim noves dades de arrObjsDadesCSV a la colecció Telefons
      const objResultat2 = await Axios.post(
        server + "/api_inventari/inserirRegistresTelefons",
        { dades: JSON.stringify(arrJSON) }
      );
      console.log("objResultat2 INSERCIÓ registres/docs ES", objResultat2);

			// 3. Comprovar recuperaio de dades de la bdd i modificar state.docsTelefons
			context.dispatch("actLlistarDadesTelefons")

			// 4. Eliminem el fitxer importat
			const objEliminacioFitxer = await Axios.get( server + "/api_inventari/eliminarFitxerCSV/" + fitxer.name);

			console.log("objEliminacioFitxer", objEliminacioFitxer)

      return

    } catch (error) {
      console.log("error al eliminar fitxer CSV dades Telefons");
      console.log(error);
      return { error: error };
    }
  } catch (error) {
    console.log("error a actGetCSV_Telefons");
    console.log(error);
  }
}


export async function actEliminar_Telefons(context, model) {
      // 1. Eliminar registres de "Telefons"
			console.log("actEliminar_Telefons - model: ", model)
      let objResultat = null
			try {
				objResultat = await Axios.delete(server + "/api_inventari/eliminarRegistresTelefons/" + model)
				context.dispatch("actLlistarDadesTelefons")
			} catch (error) {
				console.log("actEliminar_Telefons - ERROR:", error)
			}
			
			
			
			
			
      console.log("objResultat ELIMINACIO registres/docs Telefons: ", objResultat);

}





/* DADES ELASTIC SEARCH */

export async function actLlistarDadesElasticSearch ( context) {
  console.log("context", context)
  try {
    const objResultat3 = await Axios.get( server + "/api_inventari/llistarRegistresES" );
    console.log("objResultat3", objResultat3);
    const arrJSON = objResultat3.data;
		console.log("arrJSON", arrJSON)
    context.commit("mutGetDocsES", arrJSON)
    
    return "Num documents ES recuperats: " + arrJSON.length;    
  } catch (error) {
    console.log("Error actLlistaDAdes")
    console.log(error)
    // return "ERROR al recuperar documents de ES" + error
  }

}


export async function actGetCSV_ElasticSearch(context, fitxer) {
  try {

    let formData = new FormData();
    formData.append("file", fitxer);

    // pujar el fitxer al servidor
    const resultPujarFitxer = await Axios.post(
      server + "/api_inventari/upload/", 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    console.log("ACTIONS - actGetCSV - resultPujarFitxer", resultPujarFitxer)

    // Obtencio de les dades en brut del fitxer
    console.log("ACTIONS - actGetCSV - fitxer.name = ", fitxer.name)
    const result = await Axios.get(
      server + "/api_inventari/importarDadesFitxer/" + fitxer.name
    );
    const data = result.data;
    console.log("ACTIONS - actGetCSV - data = ", data)

    // *** TRANSFORMACIO A FITXER JSON per despres importar-lo a la coleccio ES_registres***

    // 1. separem per linies
    const arrLinies = data.split("\n");
    // console.log("ACTIONS - actGetCSV - arrLinies", arrLinies);

    let arrNomCamps = [];
    let arrJSON = [];
    // 2. per cada linia, seprarem per comes i creem objecte JSON amb les dades com a propietats
    arrLinies.forEach((linia, indice) => {
      const arrDades = linia.trim().split(",");

      if (indice === 0) {
        // a la primera linia hi ha els noms dels camps
        arrNomCamps = arrDades.map( (element) => element.replace(/["]+/g, '')); // treiem les " si en te
        console.log("ACTIONS - actGetCSV - arrNomCamps", arrNomCamps)
      } else {
        // per cada dada, anem construint objecte on cada propietat sera un camp
        let obj = {};
        arrDades.forEach((dada, index) => {
          obj[arrNomCamps[index]] = dada.replace(/["]+/g, '');  // treiem les " si en te
        });

        // un cop construit l'objecte, l'afegim al array
        arrJSON.push(obj);
      }
    });

    console.log("ACTIONS - actGetCSV - arrJSON", arrJSON);

    // Les dades de arrJSON fins ara, son un historial dels inicis de sessió dels ordinadors. Per tant ens interessa fer un llistat unic de NS de cpus i sobre aquest llistat trobar la dada més actual de arrJSON.

    // 1. de totes els registres (arrJSON) fem un array de ns PC unics
    const arrNSUnics = arrJSON.reduce((acc, item) => {
      // console.log("item", item)
      // console.log("item.HARDWARE_NAME", item["HARDWARE_NAME"])
      if ( item.HARDWARE_NAME !== undefined) {
        if (!acc.includes(item["HARDWARE_NAME"])) {
          acc.push(item["HARDWARE_NAME"]);
        }        
      }

      return acc;
    }, []);

    console.log("ACTIONS - actGetCSV - arrNSUnics", arrNSUnics);


    // 2. Per cada ns de arrNSUnics, obtenim el primer objecte coincident (que serà el més actual) per ns segons obj.HARDWARE_NAME
    const arrObjsDadesCSV = arrNSUnics.map(ns => {
      return arrJSON.find(obj =>{
        // console.log("obj.HARDWARE_NAME" , obj.HARDWARE_NAME, "ns:", ns)
        if (obj.HARDWARE_NAME !== undefined || ns !== undefined)
          return obj.HARDWARE_NAME.toUpperCase().includes(ns.toUpperCase())
      });
    });

    console.log("ACTIONS - actGetCSV - arrObjsDadesCSV", arrObjsDadesCSV);

    // Aprofito per modificar la propietat on apareix al info del SW per a que quan sigui una mac de telf (*.asepeyo.site) modifiqui aquest valor per a que sigui nomes la mac (sense el 'SEP' i el '.asepeyo.site')

    arrObjsDadesCSV.map(obj => {
      if (/.asepeyo.site$/.test(obj.LLDP_RID1_SWITCH_SYSNAME)) {
        obj.LLDP_RID1_SWITCH_SYSNAME = obj.LLDP_RID1_SWITCH_SYSNAME.split(
          "."
        )[0].substring(3);
      }
      return obj;
    });

    console.log("3. arrObjsDadesCSV", arrObjsDadesCSV);



    // GUARDAR LES DADES A LA COLECCIÓ "ES_registres"

    try {
      // 1. Eliminar registres de "ES_registres"
      const objResultat = await Axios.delete(
        server + "/api_inventari/eliminarRegistresES"
      );
      console.log("objResultat ELIMINACIO registres/docs ES: ", objResultat);

      // 2. Afegim noves dades de arrObjsDadesCSV a la colecció ES_registres
      const objResultat2 = await Axios.post(
        server + "/api_inventari/inserirRegistresES",
        { dades: JSON.stringify(arrObjsDadesCSV) }
      );
      console.log("objResultat2 INSERCIÓ registres/docs ES", objResultat2);


			// 3. Eliminem el fitxer importat
			const objEliminacioFitxer = await Axios.get( server + "/api_inventari/eliminarFitxerCSV/" + fitxer.name);

			console.log("objEliminacioFitxer", objEliminacioFitxer)

      return

    } catch (error) {
      console.log("error al eliminar fitxer CSV");
      console.log(error);
      return { error: error };
    }
  } catch (error) {
    console.log("error a actGetCSV");
    console.log(error);
  }
}


export async function actModifRegInvHosp(context, objRegistre) {
  try {
    
    // Obtencio de les dades en brut del fitxer
    const modificacioFeta = await Axios.get(
      server + "/api_inventari/dadesExternes/" + fitxer
    );
  } catch (error) {
    console.log("error a actGetDoc");
    console.log(error);
  }
}





/* INVENTARI HOSPITAL */

export async function actGetDocs(context) {
  try {
    const result = await Axios.get(server + "/api_inventari/hospital");
    const data = result.data;
    context.commit("mutGetDocs", data);
  } catch (error) {
    console.log("error a actGetDocs");
    console.log(error);
  }
}

export async function actGetDoc(context, id) {
  try {
    const result = await Axios.get(server + "/api_inventari/hospital/" + id);
    const registreObtingut = result.data;
    // context.commit("mutGetDoc", registreObtingut);
    return registreObtingut

  } catch (error) {
    console.log("error a actGetDoc");
    console.log(error);
  }
}

export async function actRemoveDoc(context, id) {
  try {
    await Axios.delete(server + "/api_inventari/hospital/" + id);
    await context.dispatch("actGetDocs");
  } catch (error) {
    console.log("error a actRemoveDoc");
    console.log(error);
  }
}

export async function actActualitzarDoc(context, payload) {
  try {
    const result = await Axios.put(
      server + "/api_inventari/hospital/" + payload.idMongo,
      payload.registre
    );
    console.log("result", result) 
    await context.dispatch("actGetDocs");
    return result
    
  } catch (error) {
    console.log("error a actActualitzarDoc");
    console.log(error);
  }
}

export async function actAdd(context, obj) {
  console.log("estic a actAdd");
  console.log(obj);
  try {
    await Axios.post(server + "/api_inventari/hospital", obj);
    await context.dispatch("actGetDocs");
  } catch (error) {
    console.log("error a actPost");
    console.log(error);
  }
}





/* INVENTARI ASEPEYO */

export async function actGetDocsAsepeyo(context) {
  try {
    const result = await Axios.get(server + "/api_inventari/asepeyo");
    const data = result.data;
    context.commit("mutGetDocsAsepeyo", data);
  } catch (error) {
    console.log("error a actGetDocsAsepeyo");
    console.log(error);
  }
}
