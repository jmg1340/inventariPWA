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
							<th  v-for="camp in arrCamps" :key="camp">
								{{ camp }}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(obj, index) in arrJSON2" :key="index">
							<td 
								v-for="(camp2, id) in Object.keys(obj)" :key="'id'+id"
								
								>
									<div :class="{ fonsGroc: obj[camp2].semafor == 'groc', fonsVermell: obj[camp2].semafor == 'vermell'}">
										{{ obj[camp2].valor }}
									</div>
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
		}
	},


	computed: { 
		arrJSON2 () { 

			// array documents de inventari hospital
			const arrDocsHosp = this.$store.state.modulInventari.docs;

			return this.arrJSON.map( obj => {
				// el valor de cada propietat de l'obj el convertim en un objecte on les propietats seran VALOR i SEMAFOR
				// Per ex: obj.LLDP_RID1_SWITCH_SYSNAME = "XXXXX" el convetrim a obj.LLDP_RID1_SWITCH_SYSNAME = {valor: "XXXXX", semafor=""} 
				
				if (obj.HARDWARE_NAME === "S4AV0146") console.log("obj", obj)

				Object.keys(obj).forEach( prop => obj[prop] = { valor: obj[prop], semafor: "" })
				
				
				const objTrobat = arrDocsHosp.find( objDocHosp => objDocHosp.elements.pc.ns.includes(obj.HARDWARE_NAME.valor))
				// console.log("objTrobat",objTrobat)
				if ( objTrobat === undefined) {
					// el ns del pc de les dades de Elastic Search no existeix al array de documents de inventari Hospital
					obj.HARDWARE_NAME.semafor = "vermell"

				} else {
					// el ns del pc de les dades de Elastic Search SI existeix. 
					// Ara cal mirar si la resta de camps equivalents existeixen o s'ha de modificar el seu valor
					
					switch ( objTrobat.elements.pc.switch ) {
						case undefined:
							obj.LLDP_RID1_SWITCH_SYSNAME.semafor =  (obj.LLDP_RID1_SWITCH_SYSNAME.valor === '-') ? "" : "vermell"
							break
						case obj.LLDP_RID1_SWITCH_SYSNAME.valor:
							break

						default:
							obj.LLDP_RID1_SWITCH_SYSNAME.semafor = "groc"
					}
				
					switch ( objTrobat.elements.pc.portsw ) {
						case undefined:
							obj.LLDP_RID1_SWITCH_PORTDESCR.semafor = (['-', 'PC Port'].includes(obj.LLDP_RID1_SWITCH_PORTDESCR.valor) ) ? "" : "vermell"
							break
						case obj.LLDP_RID1_SWITCH_PORTDESCR.valor:
							break

						default:
							obj.LLDP_RID1_SWITCH_PORTDESCR.semafor = "groc"
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
		border: 1px solid grey;
		background-color: rgb(71, 71, 71);
		color: white
	}
	.bordeDades {
		border: 1px solid grey;
	}
	.fonsVermell{
		background-color: red
	}
	.fonsGroc{
		background-color: yellow
	}
</style>