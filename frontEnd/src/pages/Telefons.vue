<template>

 	<q-page class="q-pa-md">
		<div class="row justify-between q-mb-md">
			<q-btn class="col-2" size="sm" noCaps label="importar dades telèfons" color="primary" @click="obrirDialogImportar = true" />
		</div>

		<div class="column">
			<div class="col">
				{{ telefons }}
			</div>
		</div>



		<!-- IMPORTACIÓ DADES TELEFONS -->

		<q-dialog v-model="obrirDialogImportar">
			<jmg_importarDialogFitxerContent  dadesAImportar="dadesTelefons" />
		</q-dialog>




	</q-page>


</template>

<script>
import jmg_importarDialogFitxerContent from "../components/importarFitxer.vue"


export default {
	components: { jmg_importarDialogFitxerContent },

  data () {
    return {
      obrirDialogImportar: false
    }
  },

	computed: { 
		telefons () { 
			console.log("ESTIC A LA PROPIETAT COMPUTADA 'TELEEEEEEFONSSS")
			
			// var arr = []
			// this.$store.dispatch("modulInventari/actLlistarDadesTelefons")
			// 	.then ( objResultat => {
			// 		console.log("objResultat", objResultat)
			// 		if ( objResultat.error === undefined ){
			// 			const arrJSON = objResultat
			// 			console.log("Telefons.vue - computed(telefons) - arrJSON", arrJSON)
			// 			// this.arrCamps = objResultat.arrCamps
			// 			arr = arrJSON

			// 		} else {
			// 			console.log("Error al recuperar dades dels telefons: ", objResultat.error)
			// 		}
			// 	}).catch ( error  => {
			// 		console.log( "Error actLlistarDadesTelefons", error )
					
			// 	})

			return this.$store.state.modulInventari.docsTelefons || []

		}
	}

}
</script>

<style>

</style>