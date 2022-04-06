<template>
  <q-page class="q-pa-md">
    <div class="row justify-between q-mb-md">
      <q-btn
        class="col-2"
        size="sm"
        noCaps
        label="importar dades telèfons"
        color="primary"
        @click="obrirDialogImportar = true"
      />
      <q-btn
        class="col-2"
        size="sm"
        noCaps
        label="eliminar telèfons"
        color="primary"
        @click="obrirDialogEliminar = true"
      />
    </div>

    <div class="column">
      <div class="col">
        <q-table
          title="Telèfons"
          :data="rows"
          :columns="columns"
          row-key="name"
					separator="cell"
					dense
					:pagination ="paginacio"
        />
      </div>
    </div>

    <!-- IMPORTACIÓ DADES TELEFONS -->

    <q-dialog v-model="obrirDialogImportar">
       <jmg_importarDialogFitxerContent dadesAImportar="dadesTelefons" /> 
    </q-dialog>




    <!-- ELIMINACIO DADES TELEFONS -->

    <q-dialog v-model="obrirDialogEliminar">

			<q-card style="width: 400px; max-width: 80vw;">
				<q-card-section class="row items-center q-pb-none">
					<div class="text-bold">Eliminació de telefons segons model</div>
					<q-space />
					<q-btn icon="close" flat round dense v-close-popup />
				</q-card-section>

				<q-card-section>
					<div class="row items-end">
						<div class="col-10">
							<q-select 
								class="q-mt-md" 
								dense 
								outlined 
								v-model="modelTelf2" 
								:options="opcionsModelsTelefon" 
								label="Seleccionar model de Telf" 
								/>

						</div>
						<div class="col q-ml-sm">
							<q-btn color="teal" noCaps dense v-close-popup @click="eliminar()">Eliminar</q-btn>
						</div>
					</div>
				</q-card-section>

			</q-card>

    </q-dialog>





  </q-page>
</template>

<script>
import jmg_importarDialogFitxerContent from "../components/importarFitxer.vue";

export default {
  components: { jmg_importarDialogFitxerContent },

  created() {
    this.$store.dispatch("modulInventari/actLlistarDadesTelefons");
  },

  data() {
    return {
      obrirDialogImportar: false,
      obrirDialogEliminar: false,

      modelTelf2: {label: null, value: null},
      opcionsModelsTelefon: [
        {label: "Tots", value: "TOTS"},
        {label: "CP8811", value: "CP8811"},
        {label: "CP6901",  value: "CP6901"}
      ],


			paginacio: {rowsPerPage : 0}
		}
  },

  computed: {
    rows() {
      const arrTelefons = this.$store.state.modulInventari.docsTelefons || [];

      // llistar totes les propietats menys '_id', '__v'
      return arrTelefons.map((objRegistre) => {
        delete objRegistre._id;
        delete objRegistre.__v;
        return objRegistre;
      });
    },

    columns() {
      const arr = Object.keys(this.rows[0]).map((prop) => {
        return {
          name: prop,
          label: prop,
          field: prop,
          sortable: true,
					align: "left",
          headerStyle: "background-color: grey; color: white"
        };
      });
      console.log("arr Columnes", arr);
      return arr;
    },
  },


	methods: {
		eliminar() { 
			this.$store.dispatch("modulInventari/actGetDocs", this.modelTelf2.value)
		}
	}
};
</script>

<style>
</style>