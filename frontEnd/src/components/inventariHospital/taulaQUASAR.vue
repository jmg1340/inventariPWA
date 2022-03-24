<template>
  <div>

		<!-- TAULA DE LLOCS DE TREBALL + ELEMENTS -->
		<q-table
      :data="docs"
      :columns="columnes"
      row-key="__id"
      separator="cell"
      dense
      :pagination="initialPagination"
      :filter="filter"
      :filter-method="myfilterMethod"
      class="bg-brown-2"
    > 
			<!-- CAPÇALERA DE LA TAULA -->
      <template v-slot:top-left>
				<!-- <div class="row justify-between "> -->
					<div class="column ">
						<div class="text-h5">Inventari HOSPITAL</div>
						<!-- BOTO AFEGIR -->
						<div class="col-3 q-mt-sm">
							<q-btn
								class=""
								color="teal"
								noCaps
								label="Afegir..."
								@click="add"
							/>
						</div>	
					</div>
      </template>
      <template v-slot:top-right>

					<!-- <div class="col-6 "> -->

						<div class="row q-gutter-xs justify-end items-start ">	
							<div class="col-4">	
								<!-- CLAUS A MOSTRAR -->
								<div class="column q-pa-md bordered">
									<q-card>
										<q-card-section class="q-pb-none">
											Elements a mostrar
										</q-card-section>
										<q-separator inset />
										<q-card-section class="q-pt-xs">
											<q-option-group
												v-model="clausAMostrar"
												:options="opcionsClaus"
												type="checkbox"
												dense
											/>
										</q-card-section>

									</q-card>
								</div>        
							</div>

							<div class="col-7">
								<!-- FILTRES -->
								<div class="column q-gutter-md">
									<q-card>
										<q-card-section class="q-pb-none">
											<div class="row">
												<div class="col">
													Filtres...
												</div>
												<div class="col text-right text-caption">
													Registres: <q-chip dense color="yellow">{{ recompte }}</q-chip> 
												</div>
											</div>
											
										</q-card-section>
										
										<q-card-section class="q-pt-none ">
											<div class="row  q-gutter-xs">
												<div class="col">
													<div class="column q-gutter-xs">
														<div class="col-2">
															<q-input
																borderless
																outlined
																rounded
																dense
																debounce="30"
																label="Edifici"
																v-model="filter.fedifici"
																hide-bottom-space
																style="{ 'width': '10px' }"
															>
																<template v-slot:append>
																	<q-icon name="search" />
																</template>
															</q-input>
														</div>
														<div class="col-2">
															<q-input
																borderless
																outlined
																rounded
																dense
																debounce="30"
																label="Planta"
																v-model="filter.fplanta"
															>
																<template v-slot:append>
																	<q-icon name="search" />
																</template>
															</q-input>
														</div>
														<div class="col-2">
															<q-input
																borderless
																outlined
																rounded
																dense
																debounce="30"
																label="Dept"
																v-model="filter.fdept"
															>
																<template v-slot:append>
																	<q-icon name="search" />
																</template>
															</q-input>
														</div>
													</div>
												</div>


												<div class="col">
													<div class="column q-gutter-xs">

														<div class="col-2">
															<q-input
																borderless
																outlined
																rounded
																dense
																debounce="30"
																label="Lloc"
																v-model="filter.flloc"
															>
																<template v-slot:append>
																	<q-icon name="search" />
																</template>
															</q-input>
														</div>


														<div class="col-2">
															<q-input
																borderless
																outlined
																rounded
																dense
																debounce="30"
																label="element"
																v-model="filter.felement.clau"
															>
																<template v-slot:append>
																	<q-icon name="search" />
																</template>
															</q-input>
														</div>
														<div class="col-2">
															<q-input
																borderless
																outlined
																rounded
																dense
																debounce="30"
																label="Valor PROP. element"
																v-model="filter.felement.valor"
															>
																<template v-slot:append>
																	<q-icon name="search" />
																</template>
															</q-input>

														</div>
													</div>
												</div>




											</div>

										</q-card-section>
									</q-card>


								</div> 
							</div>	
							
						</div>

					<!-- </div> -->
				<!-- </div> -->

      </template>


			<!-- COLUMNES DE LA TAULA -->

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="ed" :props="props">
            {{ props.row.edifici }}
          </q-td>
          <q-td key="pl" :props="props">
            {{ props.row.planta }}
          </q-td>
          <q-td key="dpt" :props="props">
            {{ props.row.dept }}
          </q-td>
          <q-td key="lloc" :props="props">
            {{ props.row.lloc }}
          </q-td>
          <q-td key="el" :props="props">
            <!-- {{ props.row.elements }} -->
            <jmg_elements :objElements="props.row.elements" :clausAMostrar="clausAMostrar" />
          </q-td>
          <q-td key="id" :props="props">
            <div class="row justify-center items-center q-gutter-xs">
              <q-btn
                dense
                color="warning"
                icon="edit"
                @click="editar(props.row._id)"
              />
              <q-btn
                dense
                color="negative"
                icon="delete_forever"
                @click="eliminar(props.row._id)"
              />
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>


		<!-- FORMULARI EDICIO / AFEGIR LLOCS DE TREBALL + ELEMENTS -->
    <jmg_formulari
      :obrirFormulari="obrirFormulari"
      :idMongo="idMongo"
      objESNou= null
      @tancarFormulari="obrirFormulari = false"
    />
  </div>
</template>

<script>
import jmg_elements from "./taulaQGRID_elements.vue";
import jmg_formulari from "./formulariDoc.vue";
export default {
  components: { jmg_elements, jmg_formulari },
  data() {
    return {
      obrirFormulari: false,
      idMongo: null,
      filter: { fedifici: "", fplanta: "", fdept: "", flloc: "", felement: {clau: "", valor: ""} },
      columnes: [
        {
          name: "ed",
          label: "EDIFICI",
          field: "edifici",
          style: "text-align: center",
          headerClasses: "bg-grey-8 text-white",
          align: "center",
          style: "width: 5%"
        },
        {
          name: "pl",
          label: "PLANTA",
          field: "planta",
          style: "text-align: center",
          headerClasses: "bg-grey-8 text-white",
          align: "center",
          style: "width: 5%"
        },
        {
          name: "dpt",
          label: "DEPT",
          field: "dept",
          style: "text-align: left",
          headerClasses: "bg-grey-8 text-white",
          align: "left",
          style: "width: 20%"
        },
        {
          name: "lloc",
          label: "LLOC",
          field: "lloc",
          style: "text-align: left",
          headerClasses: "bg-grey-8 text-white",
          align: "left",
          style: "width: 20%"
        },
        {
          name: "el",
          label: "ELEMENTS",
          field: "elements",
          style: "text-align: left",
          headerClasses: "bg-grey-8 text-white",
          align: "left",
          style: "width: 30%"
        },
        {
          name: "id",
          label: "Accions",
          field: "_id",
          style: "text-align: left",
          headerClasses: "bg-grey-8 text-white",
          align: "center",
          style: "width: 10%"
        }
      ],

      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 75
      },

      clausAMostrar: [
        // "pc","monitor", "teclat", "ratoli"
        ],
      opcionsClaus: [
        // { label: 'PC', value: 'pc', color: 'green' },
        // { label: 'Monitor', value: 'monitor', color: 'green' },
        // { label: 'Teclat', value: 'teclat', color: 'green' },
        // { label: 'Ratoli', value: 'ratoli', color: 'green' }
      ],

      recompte: 0


    };
  },

  created() {
    this.$store.dispatch("modulInventari/actGetDocs");
  },

  computed: {
    docs() {
      return this.$store.state.modulInventari.docs;
    },
	},
	
	watch: {
		docs() {
			console.log("CLAUS A MOSTRAR 2")

      new Promise ( (resolve, reject) => {
				const dades = this.$store.state.modulInventari.docs
				if ( dades.length !== 0 ) {
					resolve (dades)
				} else {
					reject ("No hi ha dades")
				}
        
      })
      .then ( resultat => {
        // console.log("RESULTAT", resultat)

        const docs = resultat
        let arrElementsUnics = []
        let arrOpcionsClaus = []

        for (let doc of docs) {
          // per cada Doc obtenim array de CLAUS d'elements
          for (let clau of Object.keys(doc.elements)) {
						if ( ! arrElementsUnics.includes(clau) )  {
              arrElementsUnics.push(clau)
              arrOpcionsClaus.push( {label: clau.toUpperCase(), value: clau, color: "green"} )
            }
          }
        }
				return { arrElementsUnics, arrOpcionsClaus}
     
      }).then((obj) => {
				this.clausAMostrar = obj.arrElementsUnics
				this.opcionsClaus = obj.arrOpcionsClaus
			})
      .catch((error) => {
        console.log("ERROR a la Promesa:", error)
        // return "Algo a fallat"
				this.clausAMostrar = []
				this.opcionsClaus = []

      })
      
      

		},

},

  methods: {
    eliminar(id) {

      this.$q.dialog({
        title: 'Confirmar',
        message: 'Segur que vols eliminar el registre?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$store.dispatch("modulInventari/actRemoveDoc", id);
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
     },


    editar(id) {
			console.log("id mongo: " + id)
      this.idMongo = id;
      this.obrirFormulari = true;
    },

    add() {
      this.idMongo = null;
      this.obrirFormulari = true;
    },

    
		myfilterMethod() {

      const arrFiltered = this.docs.filter(row => {
        if (
          new RegExp(this.filter.fedifici, "i").test(row.edifici) &&
          new RegExp(this.filter.fplanta, "i").test(row.planta) &&
          new RegExp(this.filter.fdept, "i").test(row.dept) &&
          new RegExp(this.filter.flloc, "i").test(row.lloc) &&
          this.comprovarClau(row.elements) &&
          this.comprovarValor(row.elements)
        ){
          return true;
        } else {
          return false;
        }
      });

      this.recompte = arrFiltered.length
      return arrFiltered
    },

    comprovarClau (elements) {
      if (this.filter.felement.clau.length == 0){
        return true
      } else {
        if (elements == undefined) {
          return false;
        } else {
          console.log(elements)
          return Object.keys(elements).some( (clau) => new RegExp(this.filter.felement.clau, "i").test(clau)  )
        }
      }
    },
    
    comprovarValor (elements) {
      if (this.filter.felement.valor.length == 0){
        return true
      } else {
        if (elements == undefined) {
          return false;
        } else {
          // console.log(elements)
					// obtenim array de claus dels elements
					const arrClaus = Object.keys(elements)

					return arrClaus.some( clau => {
          	// obtenim array de les propietats de cada clau dels elements
						const arrProps = Object.keys( elements[clau] )
						// mirem si existeix algun valor de propietat coincident
						
						return arrProps.some( (prop) =>{ 
							// if (new RegExp(this.filter.felement.valor, "i").test(elements[clau][prop])){
							// 	console.log("elements[clau][prop]", elements[clau][prop])
							// 	console.log("this.filter.felement.valor", this.filter.felement.valor)
							// }
							return new RegExp(this.filter.felement.valor, "i").test(elements[clau][prop])  
						})
					})

					
        }
      }
    }



  }
};
</script>

<style lang="sass" scoped>
  tr:nth-child(even) 
    background-color: #f5f5f579 !important 

  tr:nth-child(odd) 
    background-color: #f9f2ec !important 
  .borde
    border: 1px solid red

</style>
