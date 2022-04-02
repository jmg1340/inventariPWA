<template>

 	<q-page class="q-pa-md">
		<div class="row justify-between q-mb-md">
			<q-btn class="col-2" size="sm" noCaps label="importar dades telèfons" color="primary" @click="obrirDialogImportar = true" />
		</div>

		<div class="column">
			<div class="col">


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
  }

}
</script>

<style>

</style>