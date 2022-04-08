<template>
	<div>

		<q-card 
			v-for="(objSW, idx) in dadesSwitchs" :key="idx"
			class="q-ma-xl q-pa-sm bg-grey  text-caption"
			>
			<q-table
				:title="objSW.nom"
				separator="cell"
				dense
				:pagination="paginacio"
				:columns="columnes"
				:data="objSW.ports"
				:table-header-style="{ color: 'red' }"
			>

			</q-table>
		</q-card>

		<!-- <div>tamany: {{ dadesSwitchs.length }}</div>
		<pre>{{dadesSwitchs}}</pre> -->
	</div>
</template>




<script>
export default {

	created() {
		this.$store.dispatch("modulInventari/actGetDocs")
		this.$store.dispatch("modulInventari/actLlistarDadesTelefons");
	},

	data () {
		return {
			columnes: [
				{nom: "port", label: "Port", field: "port", align:"center", headerStyle: "background-color: black; color: white"},
				{nom: "tfmodel", label: "Tf_Model", field: "telf_Model", align:"center", headerStyle: "background-color: black; color: white"},
				{nom: "tfMac", label: "Tf_MAC", field: "telf_Mac", align:"center", headerStyle: "background-color: black; color: white"},
				{nom: "tfDescr", label: "Tf_Descrip", field: "telf_Description", align:"left", headerStyle: "background-color: black; color: white"},
				{nom: "lloc", label: "Lloc", field: "ubicacio_lloc", align:"left", headerStyle: "background-color: black; color: white"},
				{nom: "dept", label: "Dept", field: "ubicacio_dept", align:"left", headerStyle: "background-color: black; color: white"},
				{nom: "planta", label: "Planta", field: "ubicacio_planta", align:"center", headerStyle: "background-color: black; color: white"},
				{nom: "edifici", label: "Edifici", field: "ubicacio_Edifici", align:"center", headerStyle: "background-color: black; color: white"},
			],
			paginacio:{rowsPerPage:0}
		}
	},

	computed: {
		telefons() {
			/* 
				Dades que necessito de la coleccio Telefons: model, description, mac, sw, pto
			 */

			const arrTelfs = this.$store.state.modulInventari.docsTelefons || [];
			// return arrTelfs

			return arrTelfs.map( objTelf => {
				return {
					model: objTelf.model,
					MAC: objTelf.MAC,
					DESCRIPTION: objTelf.DESCRIPTION,
					SW: objTelf.SW,
					PTO: objTelf.PTO
				}
				
			})
		},



		hospitalElements() {
			/* 
				Dades que necessito de la coleccio hospitalElements: Ed, pl, dept, lloc, ns (PC), mac (PC), macTelf (PC), sw, port
			 */

			let arr = []
			const arrHE = this.$store.state.modulInventari.docs || [];
			// return arrHE
			arrHE.forEach( objHE => {

				// comprovar si existeix element PC i, cas de  que sí, les propietats sw i portsw
				if (objHE.elements){
					if ( objHE.elements.pc ) {
						if ( objHE.elements.pc.switch && objHE.elements.pc.portsw || objHE.elements.pc.macTelf) {
							arr.push({
								edifici: objHE.edifici,
								planta: objHE.planta,
								dept: objHE.dept,
								lloc: objHE.lloc,
								ns: objHE.elements.pc.ns,
								mac: objHE.elements.pc.mac,
								macTelf: objHE.elements.pc.macTelf,
								switch: objHE.elements.pc.switch,
								portsw: objHE.elements.pc.portsw
							})
						}
					}
				}
			})

			// console.log("hospitalElements (computed) - arr", arr)
			return arr


		},




		dadesSwitchs() {
			/* 
				estructura de les dades
				[
					{
						nom: "xxxxxx",
						numero: x
						ports: 
							{
								"XX": {
									telf_Model: xxxxx,
									telf_Mac: xxxxx,
									telf_Description: xxxxx
									
									ubicacio_Edifici: xxxxx,
									ubicacio_planta: xxxxx,
									ubicacio_dept: xxxxx,
									ubicacio_lloc: xxxxx

								}
							}
					}
				] 
			*/

			const arr = []

			// 1. construir array de switchs
			let arrSw = null
			arrSw = this.hospitalElements.filter( obj => obj.switch !== undefined ).map( obj => obj.switch)
			const arrSwTelfs = this.telefons.map( obj => obj.SW)
			arrSw = arrSw.concat(arrSwTelfs)
			
			// 2 ... que nomes tingui valors únics
			let arrSwUnics = arrSw.reduce((acc,item, index)=>{
				if (acc.length === 0) {
					acc.push({nom: item, numero: parseInt(item.substring(12))});

				} else if (! acc.find( obj => obj.numero === parseInt(item.substring(12))) ) {
					acc.push({nom: item, numero: parseInt(item.substring(12))});

				}
				return acc;

			},[]).sort( (a,b) => a.numero - b.numero )
			

			// per cada switch afegir la propietat ports. El seu valor sera un objecte on cada propietat sera el numero del port (del 1 al 24)
			arrSwUnics.forEach( (objSW => {
				objSW.ports = []
				for (let num of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]) {
					objSW.ports[num-1] = Object.assign({port: num}, this.comprovarDadesCoincidents(objSW.nom, "gi"+num) )
					
				}
			}))

			return arrSwUnics

		}
	},


	methods: {
		comprovarDadesCoincidents(sw, port) {

			const objARetornar = {
					telf_Model: null,
					telf_Mac: null,
					telf_Description: null,
					
					ubicacio_Edifici: null,
					ubicacio_planta: null,
					ubicacio_dept: null,
					ubicacio_lloc: null
			}


			// comencem a buscar dades coincidents dels Telefons
			const telfTrobat = this.telefons.find ( objTelf => objTelf.SW === sw && objTelf.PTO === port )
			
			if ( telfTrobat !== undefined ) {
				objARetornar.telf_Model = telfTrobat.model
				objARetornar.telf_Mac = telfTrobat.MAC
				objARetornar.telf_Description = telfTrobat.DESCRIPTION

				// busquem a hospitalElements si hi ha alguna algun lloc que tingui informada 'macTelf'. Cas de que sí, afegim les dades de la ubicació
				const hospElemTrobat2 = this.hospitalElements.find ( oHE => (oHE.macTelf === telfTrobat.MAC)  )
				if ( hospElemTrobat2 !== undefined ){
					objARetornar.ubicacio_Edifici = hospElemTrobat2.edifici,
					objARetornar.ubicacio_planta = hospElemTrobat2.planta,
					objARetornar.ubicacio_dept = hospElemTrobat2.dept,
					objARetornar.ubicacio_lloc = hospElemTrobat2.lloc
				}
			}


			// Per a hospitalElements hem de mirar primer si existeixen les dades de switch i portsw. Si no existeixen, hem de mirar si existeix la mactelf
			const hospElemTrobat = this.hospitalElements.find ( oHE => (oHE.switch === sw && oHE.portsw === port)  )

			if ( hospElemTrobat !== undefined ){
				objARetornar.ubicacio_Edifici = hospElemTrobat.edifici,
				objARetornar.ubicacio_planta = hospElemTrobat.planta,
				objARetornar.ubicacio_dept = hospElemTrobat.dept,
				objARetornar.ubicacio_lloc = hospElemTrobat.lloc
			}


			return objARetornar
		}
	}


}
</script>




<style>

</style>