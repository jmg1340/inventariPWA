<template>
	<div>
		<div>tamany: {{ dadesSwitchs.length }}</div>
		<pre>{{hospitalElements}}</pre>
	</div>
</template>




<script>
export default {

	created() {
		this.$store.dispatch("modulInventari/actGetDocs")
		this.$store.dispatch("modulInventari/actLlistarDadesTelefons");
	},

	computed: {
		telefons() {
			/* 
				Dades que necessito de la coleccio Telefons: model, description, sw, pto
			 */

			const arrTelfs = this.$store.state.modulInventari.docsTelefons || [];
			// return arrTelfs

			return arrTelfs.map( objTelf => {
				return {
					model: objTelf.model,
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
						switch:
							{
								port: XX
								
								telf_Model: xxxxx,
								telf_Mac: xxxxx,
								telf_Description: xxxxx
								
								ubicacio_Edifici: xxxxx,
								ubicacio_planta: xxxxx,
								ubicacio_dept: xxxxx,
								ubicacio_lloc: xxxxx
								
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
			const arrSwUnics = arrSw.reduce((acc,item)=>{
				if(!acc.includes(item)){
					acc.push(item);
				}
				return acc;
			},[])
			
			
			// per cada switch mirar les dades coincidents de 'telefons' i 'hospitalElements'
			let objSwitchs = {}
			arrSwUnics.forEach( sw => {
				objSwitchs[sw] = {}
				objSwitchs[sw].telefons = this.telefons.filter( objTelf => objTelf.SW === sw) || []
				objSwitchs[sw].hospElem_sw = this.hospitalElements.filter( objHE => objHE.switch === sw) || []
			})

			// Ara cal veure els registres de hospitalElements que tinguin macTelf (d'en comptes de switch i portsw)

			
			
			return objSwitchs



		}
	}


}
</script>




<style>

</style>