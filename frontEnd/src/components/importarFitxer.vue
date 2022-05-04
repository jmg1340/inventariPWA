<template>
  
    <q-card style="width: 400px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-bold">Importació fitxer CSV</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>

        <div class="row">
          <div class="col-10">
            <q-file color="grey-10" v-model="fitxer" dense label="Seleccionar fitxer">
              <template v-slot:prepend>
                <q-icon name="attach_file" size="sm"/>
              </template>
            </q-file>

            <q-select 
              class="q-mt-md" 
              dense 
              outlined 
              v-model="modelTelf" 
              :options="opcionsModelsTelefon" 
              label="Seleccionar model de Telf" 
              v-if="dadesAImportar === 'dadesTelefons'"
              />

          </div>
          <div class="col q-ml-sm">
            <q-btn color="teal" noCaps dense v-close-popup @click="importar()">Importar</q-btn>

          </div>
        </div>


      </q-card-section>
    </q-card>


</template>

<script>
export default {
  props: [ "dadesAImportar" ],
  data (){
    return {
      fitxer: null,
      modelTelf: {label: null, value: null},
      opcionsModelsTelefon: [
        {label: "CP8811", value: "CP8811"},
        {label: "CP6901",  value: "CP6901"}
      ]
    }
  },
    
  methods: {

    importar () {
      switch (this.dadesAImportar) {
        case "dadesElasticSearch":
          this.importarDadesElasticSearch ()
          break

         case "dadesTelefons":
          this.importarDadesTelefons (this.modelTelf.value)
          break           
      }
    },


		importarDadesElasticSearch () {
			console.log("importarDadesElasticSearch - importar - fitxer", this.fitxer)

			this.$store.dispatch("modulInventari/actGetCSV_ElasticSearch", this.fitxer)
			.then ( () => {
			
				this.$store.dispatch("modulInventari/actLlistarDadesElasticSearch")
				.then ( objResultat => {
				
					if ( objResultat.error === undefined ){
						const arrJSON = objResultat.arrJSON
						console.log("DADESEXTERNES - importar - arrJSON", arrJSON)
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




    importarDadesTelefons ( model ) {
			console.log("importarDadesTelefons - importar - fitxer", this.fitxer)

			this.$store.dispatch("modulInventari/actGetCSV_Telefons", {fitxer: this.fitxer, modelTelf: model})
			.then ( () => {
				console.log("Dades telefons importades a la base de dades")

			}).catch ( error  => {
				console.log( "no ha pillat les dades", error )
			})

    }




  }
}
</script>

<style>

</style>