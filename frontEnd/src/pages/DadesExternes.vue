<template>
	<q-page class="q-pa-lg">
		<div class="col">
			<q-btn color="teal" noCaps dense @click="importar('dadesES.csv')">Importar</q-btn>
		</div>

		<div class="col text-h6">Dades Externes <span class="text-caption"> ( {{ arrJSON2.length }} registres )</span></div>

		<div class="column">

			<div class="col">

				<q-markup-table dense bordered separator="cell">
					<thead>
						<tr>
							<th  v-for="camp in arrCamps" :key="camp"
							class="bg-grey-9 text-white bordeCamps"
							>
								{{ camp }}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(obj, index) in arrJSON2" :key="index">
							<td 
								v-for="(camp2, id) in Object.keys(obj)" 
								:key="'id'+id"
								:class="{ 
													'bg-yellow': obj[camp2].accio == 'modificar' && camp2 !== '_id', 
													'bg-red text-white': obj[camp2].accio == 'afegir' && camp2 !== '_id'
												}"
								>
									<q-btn 
										v-if="obj[camp2].accio === 'afegir' && camp2 === '_id'"
										dense noCaps
										size="sm"
										color="teal"
										@click="afegirRegistreInventariHospital()" >
											{{ obj[camp2].accio }}
									</q-btn>	
									<q-btn 
										v-else-if="obj[camp2].accio === 'modificar' && camp2 === '_id'"
										dense noCaps
										size="sm"
										color="primary"
										@click="modificarRegistreInventariHospital(obj)" >
											{{ obj[camp2].accio }}
									</q-btn>	
									<!-- <span v-else-if="camp2.accio === '' && camp2 === '_id'"> obj[camp2].accio  &nbsp; </span> -->
									<span v-else-if="camp2 !== '_id'"> {{ obj[camp2].valor }} </span>
							</td>
						</tr>
					</tbody>
				</q-markup-table>


			</div>
		</div>






	</q-page>
</template>

<script>
export default {
	created() {
		console.log("ESTIC A CREATED")
		this.$store.dispatch("modulInventari/actLlistarDades")
		.then ( objResultat => {
			this.$store.dispatch("modulInventari/actGetDocs")
		}).catch ( err => {
			console.log("error a CREATED")
		})
	},

	data() {
		return {
			arrJSON: [],
			// arrCamps: [],

			// equivalencies: {
			// 	HARDWARE_NAME:              { element: "pc", propietat: "ns" },
			// 	LLDP_RID1_SWITCH_SYSNAME:   { element: "pc", propietat: "switch" },
			// 	LLDP_RID1_SWITCH_PORTDESCR: { element: "pc", propietat: "portsw" },
			// }
		}
	},

	methods: { 


		/** 
		* Acció d'importar fitxer csv.
		* @summary If the description is long, write your summary here. Otherwise, feel free to remove this.
		* @param {String} fitxet - nom del fitxer a importar.
		*/

		importar (fitxer) {
			this.$store.dispatch("modulInventari/actGetCSV", fitxer)
			.then ( () => {
			
				this.$store.dispatch("modulInventari/actLlistarDades")
				.then ( objResultat => {
				
					if ( objResultat.error === undefined ){
						arrJSON = objResultat.arrJSON
						this.arrCamps = objResultat.arrCamps
					} else {
						console.log("Error a l'importar: ", objResultat.error)
					}
				})

			}).catch ( error  => {
				console.log( "no ha pillat les dades", error )
			})
		},



		afegirRegistreInventariHospital (idInvHosp) { 
			console.log("afegir registre")
		},


		/** 
		* Modificar document quan ELEMENTS.PC.NS == HARDWARE_NAME.
		* @summary If the description is long, write your summary here. Otherwise, feel free to remove this.
		* @param {ParamDataTypeHere} parameterNameHere - Brief description of the parameter here. Note: For other notations of data types, please refer to JSDocs: DataTypes command.
		* @return {ReturnValueDataTypeHere} Brief description of the returning value here.
		*/

		modificarRegistreInventariHospital (objRegistre) { 
			console.log("objRegistre", objRegistre)

			// recuperem el document de la coleccio inventariHospital segons el seu id
			const idMongo = objRegistre._id.valor

			this.$store.dispatch("modulInventari/actGetDoc", idMongo)
			.then ( registreObtingut => {

				// un cop recuperat, el modifiquem segons si s'han d'afegir/ modificar elements / propietats
				console.log( "registreObtingut.elements", registreObtingut.elements)

				// si no existeix o s'ha de modificar la propietat PC.SWITCH
				if ( objRegistre.LLDP_RID1_SWITCH_SYSNAME.accio === "afegir" || 
						 objRegistre.LLDP_RID1_SWITCH_SYSNAME.accio === "modificar") {

					// veure si es tracta d'un switch o de la mac d'un telefon
					if ( /^SW-/.test(objRegistre.LLDP_RID1_SWITCH_SYSNAME.valor) ) {
						registreObtingut.elements.pc.switch = objRegistre.LLDP_RID1_SWITCH_SYSNAME.valor
					} else {
						registreObtingut.elements.pc.macTelf = objRegistre.LLDP_RID1_SWITCH_SYSNAME.valor
					}
					
				} 

				// si no existeix o s'ha de modificar la propietat PC.PORTSW
				if ( objRegistre.LLDP_RID1_SWITCH_PORTDESCR.accio === "afegir" || 
						 objRegistre.LLDP_RID1_SWITCH_PORTDESCR.accio === "modificar") {

					registreObtingut.elements.pc.portsw = objRegistre.LLDP_RID1_SWITCH_PORTDESCR.valor
				}


				// guardem el registre a la colecció
				this.$store.dispatch("modulInventari/actActualitzarDoc", {idMongo, registre: registreObtingut})
				.then( result => {
					console.log("resultat de dades actualizades", result.data)
					// this.carregarRegistres()
				})

			})
		}



	},

	computed: { 
		arrCamps () { 
			
			try {
				console.log("docsES:", this.$store.state.modulInventari.docsES)
				return Object.keys(this.$store.state.modulInventari.docsES[0]);  // al primer registre hi ha els noms dels camp
			} catch (error) {
				return []
			}
			
		},

		arrJSON2 () { 

			try {
				// arr documents de Elastic search
				this.arrJSON = JSON.parse(JSON.stringify(this.$store.state.modulInventari.docsES));
				
				// array documents de inventari hospital
				const arrDocsHosp = this.$store.state.modulInventari.docs;

				

				return this.arrJSON.map( obj => {
					// el valor de cada propietat de l'obj el convertim en un objecte on les propietats seran VALOR i SEMAFOR
					// Per ex: obj.LLDP_RID1_SWITCH_SYSNAME = "XXXXX" el convetrim a obj.LLDP_RID1_SWITCH_SYSNAME = {valor: "XXXXX", accio=""} 
					
					if (obj.HARDWARE_NAME === "S4AV0146") console.log("obj", obj)

					Object.keys(obj).forEach( prop => obj[prop] = { valor: obj[prop], accio: "" })
					
					
					const objTrobat = arrDocsHosp.find( objDocHosp => objDocHosp.elements.pc.ns.includes(obj.HARDWARE_NAME.valor))
					// console.log("objTrobat",objTrobat)
					
					if ( objTrobat === undefined) {
						// el ns del pc de les dades de Elastic Search no existeix al array de documents de inventari Hospital
						obj._id.valor = ""
						obj._id.accio = "afegir"
						obj.HARDWARE_NAME.accio = "afegir"
						obj.LLDP_RID1_SWITCH_SYSNAME.accio =   (obj.LLDP_RID1_SWITCH_SYSNAME.valor === '-') ? "" : "afegir"
						obj.LLDP_RID1_SWITCH_PORTDESCR.accio = (['-', 'PC Port'].includes(obj.LLDP_RID1_SWITCH_PORTDESCR.valor) ) ? "" : "afegir"
					} else {
						// el ns del pc de les dades de Elastic Search SI existeix. 
						obj._id.valor = objTrobat._id 	// ens servirà despres per trobar el registre a la colecció inventariHospital
						
						// Ara cal mirar si la resta de camps equivalents existeixen o s'ha de modificar el seu valor
						
						if (obj.LLDP_RID1_SWITCH_SYSNAME.valor !== '-') {

							if ( /^SW-/.test(obj.LLDP_RID1_SWITCH_SYSNAME.valor) ) {    // es tracta d'un switch
								if (objTrobat.elements.pc.switch === undefined)  {
									obj.LLDP_RID1_SWITCH_SYSNAME.accio = "afegir"
								} else if ( objTrobat.elements.pc.switch !== obj.LLDP_RID1_SWITCH_SYSNAME.valor) {
									obj.LLDP_RID1_SWITCH_SYSNAME.accio = "modificar"
								}
							} else {	// es tracta de la mac d'un telf
								if (objTrobat.elements.pc.macTelf === undefined)  {
									obj.LLDP_RID1_SWITCH_SYSNAME.accio = "afegir"
								} else if ( objTrobat.elements.pc.macTelf !== obj.LLDP_RID1_SWITCH_SYSNAME.valor) {
									obj.LLDP_RID1_SWITCH_SYSNAME.accio = "modificar"
								}

							}
						}

						// switch ( objTrobat.elements.pc.switch ) {
						// 	case undefined:
						// 		if (obj.LLDP_RID1_SWITCH_SYSNAME.valor !== '-') obj.LLDP_RID1_SWITCH_SYSNAME.accio =  "afegir"
						// 		break
						// 	case obj.LLDP_RID1_SWITCH_SYSNAME.valor:
						// 		break
						// 	default:
						// 		obj.LLDP_RID1_SWITCH_SYSNAME.accio = "modificar"
						// }
					
					
						switch ( objTrobat.elements.pc.portsw ) {
							case undefined:
								if (! ['-', 'PC Port'].includes(obj.LLDP_RID1_SWITCH_PORTDESCR.valor) ) obj.LLDP_RID1_SWITCH_PORTDESCR.accio =  "afegir"
								break
							case obj.LLDP_RID1_SWITCH_PORTDESCR.valor:
								break
							default:
								obj.LLDP_RID1_SWITCH_PORTDESCR.accio = "modificar"
						}


						// si hi ha alguna accio diferent de "", posar _id.accio = "modificar". Aixo fara que aparegui el boto "modificar"
						if ( obj.LLDP_RID1_SWITCH_PORTDESCR.accio.length !== 0 ||
								obj.LLDP_RID1_SWITCH_SYSNAME.accio.length   !== 0) {
										obj._id.accio = "modificar"
						}
					}

					// console.log(obj)
					return obj
				})
				
			} catch (error) {
				return []
			}
		}
	}


}
</script>

<style>
	.bordeCamps {
		border: 1px solid rgb(245, 209, 6);
	}
	.bordeDades {
		border: 1px solid grey;
	}

</style>