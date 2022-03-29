<template>
	<q-page class="q-pa-lg">
		<div class="col">

			<!-- <q-uploader
        url="http://localhost:3001//api_inventari/dadesExternes/"
        style="max-width: 300px"
      /> -->

      <q-file color="purple-12" v-model="fitxer" label="Label">
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>

			<q-btn color="teal" noCaps dense @click="importar()">Importar</q-btn>
			<q-btn color="orange" noCaps dense @click="modificarTots()" class="q-ml-md">Modificar TOTS</q-btn>
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
										@click="afegirRegistreInventariHospital(obj)" >
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



		<!-- FORMULARI EDICIO / AFEGIR LLOCS DE TREBALL + ELEMENTS -->
    <jmg_formulari
      :obrirFormulari="obrirFormulari"
      :idMongo="null"
			:objESNou="objNouES"
      @tancarFormulari="obrirFormulari = false"
    />


	</q-page>
</template>

<script>
import jmg_formulari from "../components/inventariHospital/formulariDoc.vue";



export default {
	components: { jmg_formulari },

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
			fitxer: null,
			arrJSON: [],
			obrirFormulari: false,
			objNouES: null     // utilitzat al formulariDoc.vue per als nous elements (ns de pc) que no estan a la coleccio HospitalElements
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
		* @param {String} fitxer - nom del fitxer a importar.
		*/

		importar () {
			console.log("DADESEXTERNES - importar - fitxer", this.fitxer)

			this.$store.dispatch("modulInventari/actGetCSV", this.fitxer)
			.then ( () => {
			
				this.$store.dispatch("modulInventari/actLlistarDades")
				.then ( objResultat => {
				
					if ( objResultat.error === undefined ){
						const arrJSON = objResultat.arrJSON
						// this.arrCamps = objResultat.arrCamps
					} else {
						console.log("Error a l'importar: ", objResultat.error)
					}
				}).catch ( error  => {
					console.log( "Error 1", error )
				})

			}).catch ( error  => {
				console.log( "no ha pillat les dades", error )
			})
		},



		afegirRegistreInventariHospital (obj) { 
			console.log("--- afegir registre ---")
			this.objNouES = obj
			this.obrirFormulari = true
		},


		modificarTots () {
			this.arrJSON.filter( obj => obj._id.accio === "modificar")
			.forEach( obj => this.modificarRegistreInventariHospital(obj))
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

					if ( objRegistre.LLDP_RID1_SWITCH_SYSNAME.valor === "-" ){
						// seria el cas de que a document de la coleccio fins ara havien propietats switch, portsw, mactelf, macDX. Ara el valor es "-" per lo que s'han d'eliminar dites propietats
						if ( registreObtingut.elements.pc.macDX ) 		delete registreObtingut.elements.pc.macDX
						if ( registreObtingut.elements.pc.macTelf ) 	delete registreObtingut.elements.pc.macTelf
						if ( registreObtingut.elements.pc.switch ) 		delete registreObtingut.elements.pc.switch
						if ( registreObtingut.elements.pc.portsw ) 		delete registreObtingut.elements.pc.portsw

					} else {
						// veure si es tracta d'un switch, la mac d'una DX o la mac d'un telefon
						if ( /^SW-/.test(objRegistre.LLDP_RID1_SWITCH_SYSNAME.valor) ) {
							registreObtingut.elements.pc.switch = objRegistre.LLDP_RID1_SWITCH_SYSNAME.valor
						} else if ( /^SEP/.test(objRegistre.LLDP_RID1_SWITCH_SYSNAME.valor) ) {   // mac DX
							registreObtingut.elements.pc.macDX = objRegistre.LLDP_RID1_SWITCH_SYSNAME.valor.substring(3)  // omitim el "SEP"
						} else {    // mac Telf
							registreObtingut.elements.pc.macTelf = objRegistre.LLDP_RID1_SWITCH_SYSNAME.valor
						}

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
					
					// if (obj.HARDWARE_NAME === "S4AV0146") console.log("obj", obj)

					Object.keys(obj).forEach( prop => obj[prop] = { valor: obj[prop], accio: "" })
					
					
					const objTrobat = arrDocsHosp.find( objDocHosp => objDocHosp.elements.pc.ns.toLowerCase().includes(obj.HARDWARE_NAME.valor.toLowerCase()))
					// console.log("objTrobat",objTrobat)
					
					if ( objTrobat === undefined) {
						// el ns del pc de les dades de Elastic Search no existeix al array de documents de inventari Hospital
						obj._id.valor = ""
						obj._id.accio = "afegir"
						obj.HARDWARE_NAME.accio = "afegir"
						obj.LLDP_RID1_SWITCH_SYSNAME.accio =   (obj.LLDP_RID1_SWITCH_SYSNAME.valor === '-') ? "" : "afegir"
						obj.LLDP_RID1_SWITCH_PORTDESCR.accio = ( /^gi/.test(obj.LLDP_RID1_SWITCH_PORTDESCR.valor) ) ? "afegir" : ""
					
					} else {
						// el ns del pc de les dades de Elastic Search SI existeix. 
						obj._id.valor = objTrobat._id 	// ens servirà despres per trobar el registre a la colecció inventariHospital
						
						// Ara cal mirar si la resta de camps equivalents existeixen o s'ha de modificar el seu valor
						if (obj.LLDP_RID1_SWITCH_SYSNAME.valor !== '-') {

							if ( /^SW-/.test(obj.LLDP_RID1_SWITCH_SYSNAME.valor) ) { 
								// es tracta d'un switch   
								if (objTrobat.elements.pc.switch === undefined)  {
									obj.LLDP_RID1_SWITCH_SYSNAME.accio = "afegir"
								} else if ( objTrobat.elements.pc.switch !== obj.LLDP_RID1_SWITCH_SYSNAME.valor) {
									obj.LLDP_RID1_SWITCH_SYSNAME.accio = "modificar"
								}

							} else if( /^SEP/.test(obj.LLDP_RID1_SWITCH_SYSNAME.valor) ) {	
								// es tracta de la mac d'una DX
								if (objTrobat.elements.pc.macDX === undefined)  {
									obj.LLDP_RID1_SWITCH_SYSNAME.accio = "afegir"
								} else if ( objTrobat.elements.pc.macDX !== obj.LLDP_RID1_SWITCH_SYSNAME.valor.substring(3)) {
									obj.LLDP_RID1_SWITCH_SYSNAME.accio = "modificar"
								}

							} else {	
								// es tracta de la mac d'un telf
								if (objTrobat.elements.pc.macTelf === undefined)  {
									obj.LLDP_RID1_SWITCH_SYSNAME.accio = "afegir"
								} else if ( objTrobat.elements.pc.macTelf !== obj.LLDP_RID1_SWITCH_SYSNAME.valor) {
									obj.LLDP_RID1_SWITCH_SYSNAME.accio = "modificar"
								}
							}

						} else {
							// Per ex. seria el cas de que es posi un telf fixe, que fins ara estava associat a aquest ordinador, a un altre ordinador.
							// Per tant, hem de mirar si al registre de objTrobat existeix propietat macTelf i/o macDX, Cas de que sí, s'han d'eliminar
						
							if ( objTrobat.elements.pc.macTelf || objTrobat.elements.pc.macDX)  
								obj.LLDP_RID1_SWITCH_SYSNAME.accio = "modificar"


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
								if ( /^gi/.test(obj.LLDP_RID1_SWITCH_PORTDESCR.valor) ) 
									obj.LLDP_RID1_SWITCH_PORTDESCR.accio =  "afegir"
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