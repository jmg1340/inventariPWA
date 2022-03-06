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
								:class="{ 'bg-yellow': obj[camp2].accio == 'modificar', 'bg-red text-white': obj[camp2].accio == 'afegir'}"
								>
									<q-btn 
										v-if="obj['HARDWARE_NAME'].accio === 'afegir' && camp2 === '_id'"
										label="Afegir" 
										dense noCaps
										size="sm"
										color="teal"
										@click="afegirRegistreInventariHospital()" />	
									<q-btn 
										v-else-if="obj['HARDWARE_NAME'].accio === '' && camp2 === '_id'"
										label="Modificar" 
										dense noCaps
										size="sm"
										color="primary"
										@click="modificarRegistreInventariHospital(obj)" />	
									<span v-else>  {{ obj[camp2].valor }} </span>
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
		this.carregarRegistres()
	},

	data() {
		return {
			arrJSON: [],
			arrCamps: [],

			equivalencies: {
				HARDWARE_NAME:              { element: "pc", propietat: "ns" },
				LLDP_RID1_SWITCH_SYSNAME:   { element: "pc", propietat: "switch" },
				LLDP_RID1_SWITCH_PORTDESCR: { element: "pc", propietat: "portsw" },
			}
		}
	},

	methods: { 
		carregarRegistres() {
			this.$store.dispatch("modulInventari/actLlistarDades")
			.then ( objResultat => {
			
				if ( objResultat.error === undefined ){
					this.arrJSON = objResultat.arrJSON
					this.arrCamps = objResultat.arrCamps
				} else {
					console.log("Error a l'importar: ", objResultat.error)
				}
			}).catch ( err => {
				console.log("error a CREATED")
			})
		},


		importar (fitxer) {
			this.$store.dispatch("modulInventari/actGetCSV", fitxer)
			.then ( () => {
			
				this.$store.dispatch("modulInventari/actLlistarDades")
				.then ( objResultat => {
				
					if ( objResultat.error === undefined ){
						this.arrJSON = objResultat.arrJSON
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

					// veure si es tracta d'un swithc o de la mac d'un telefon
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
					this.carregarRegistres()
				})

			})
		}



	},

	computed: { 
		arrJSON2 () { 

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
					obj.HARDWARE_NAME.accio = "afegir"
					obj.LLDP_RID1_SWITCH_SYSNAME.accio =  (obj.LLDP_RID1_SWITCH_SYSNAME.valor === '-') ? "" : "afegir"
					obj.LLDP_RID1_SWITCH_PORTDESCR.accio = (['-', 'PC Port'].includes(obj.LLDP_RID1_SWITCH_PORTDESCR.valor) ) ? "" : "afegir"
				} else {
					// el ns del pc de les dades de Elastic Search SI existeix. 
					// Ara cal mirar si la resta de camps equivalents existeixen o s'ha de modificar el seu valor
					obj._id.valor = objTrobat._id
					switch ( objTrobat.elements.pc.switch ) {
						case undefined:
							obj.LLDP_RID1_SWITCH_SYSNAME.accio =  (obj.LLDP_RID1_SWITCH_SYSNAME.valor === '-') ? "" : "afegir"
							break
						case obj.LLDP_RID1_SWITCH_SYSNAME.valor:
							break
						default:
							obj.LLDP_RID1_SWITCH_SYSNAME.accio = "modificar"
					}
				
					switch ( objTrobat.elements.pc.portsw ) {
						case undefined:
							obj.LLDP_RID1_SWITCH_PORTDESCR.accio = (['-', 'PC Port'].includes(obj.LLDP_RID1_SWITCH_PORTDESCR.valor) ) ? "" : "afegir"
							break
						case obj.LLDP_RID1_SWITCH_PORTDESCR.valor:
							break
						default:
							obj.LLDP_RID1_SWITCH_PORTDESCR.accio = "modificar"
					}
				
				}

				// console.log(obj)
				return obj
			})
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