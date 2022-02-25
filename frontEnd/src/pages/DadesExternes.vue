<template>
	<q-page class="q-pa-lg">
		<div class="col">
			<q-btn color="teal" noCaps dense @click="importar('dadesES.csv')">Importar</q-btn>
		</div>

		<div class="col text-h6">Dades Externes <span class="text-caption"> ( {{ arrJSONcsv.length }} registres )</span></div>

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
						<tr v-for="(obj, index) in arrJSONcsv" :key="index">
							<td  v-for="(camp2, id) in Object.keys(obj)" :key="'id'+id">
								{{ obj[camp2] }}
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
		// this.importar ("dadesES.csv")
	},

	data() {
		return {
			arrJSONcsv: [],
			arrCamps: []
		}
	},

	methods: { 
		importar (fitxer) {
			this.$store.dispatch("modulInventari/actGetCSV", fitxer)
			.then ( objResultat => {
				console.log("Estic a promesa resolta")
				
				this.arrCamps = objResultat.arrNomCamps
				const arrJSON = objResultat.arrJSON
				
/* 
				// 1. de totes els registres (arrJSON) fem un array de ns PC unics de
				const arrNSUnics = arrJSON.reduce((acc,item)=>{
					if(! acc.includes(item.HARDWARE_NAME)){
						acc.push(item.HARDWARE_NAME);
					}
					return acc;
				},[])

					
				// 2. Per cada ns de arrNSUnics, obtenim el primer objecte coincident per ns segons obj.HARDWARE_NAME
				const arrObjsDadesCSV = arrNSUnics.map ( ns => {
					return arrJSON.find( obj => obj.HARDWARE_NAME.toUpperCase().includes( ns.toUpperCase() ))
				})


				// modifiquem la propietat on apareix al info del SW per a que quan sigui una mac de telf (*.asepeyo.site) modifiqui aquest valor per a que sigui nomes la mac (sense el SEP i .asepeyo.site)

				arrObjsDadesCSV.map ( obj => {
					if (  /.asepeyo.site$/.test(obj.LLDP_RID1_SWITCH_SYSNAME) ) {
						obj.LLDP_RID1_SWITCH_SYSNAME = obj.LLDP_RID1_SWITCH_SYSNAME.split(".")[0].substring(3)					
					}
					return obj
				})
				
				
				
				this.arrJSONcsv = arrObjsDadesCSV
				// this.arrCamps = (this.arrJSONcsv.length === 0) ? [] : Object.keys(this.arrJSONcsv[0])
				
 */
			}).catch ( error  => {
				console.log( "no ha pillat les dades", error )
			})
		}
	},




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
</style>