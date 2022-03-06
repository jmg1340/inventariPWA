<template>
  <q-dialog v-model="obrirFormulari"  @show="onShow">
    <q-card class="q-pa-md" style="max-width: 900px">
      <q-form @submit="onSubmit" class="q-gutter-md">
        
				
				
				<div class="row q-gutter-md">

					<!-- EDIFICI, PLANTA, DEPT, LLOC -->
          <div class="col-4">
            <q-input
              filled
							dense
              v-model="edifici"
              label="Edifici"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Escriu edifici']"
            />

            <q-input
              filled
							dense
              type="text"
              v-model="planta"
              label="Planta"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Escriu planta']"
            />

            <q-input
              filled
							dense
              type="text"
              v-model="dept"
              label="departament"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Escriu deptartament',
              ]"
            />

            <q-input
              filled
							dense
              type="text"
              v-model="lloc"
              label="Lloc de treball"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Escriu lloc de treball',
              ]"
            />
          </div>


					<!-- ELEMENTS -->
          <div class="col">

							<q-btn label="+ CLAU" color="positive" size="xs" class="q-mb-xs" @click="addClau" />

							<q-markup-table>
								<thead>
									<tr>
										<th class="text-left">Element</th>
										<th class="text-left">Propietats</th>

									</tr>
								</thead>
								<tbody>
									<tr v-for="(valorObj, clau, index) in elements" :key="index">
										<td class="text-left">
											<!-- {{ clau }} -->
											<jmg_clau 
												:clau="clau" 
												@actualitzarClau="updateClau" 
											/>
										</td>
										<td class="q-pa-xs">
											<jmg_propietats 
												
												:objValor="valorObj" 
												@novaPropietat="addProp(clau)"
												@eliminaPropietat="prop => deleProp (clau, prop)"
												@actualitzarProp2 ="obj => updateProp2 (clau, obj)"
												@actualitzarVal2  ="obj => updateVal2 (clau, obj)"
												/>
										</td>
									</tr>
								</tbody>
							</q-markup-table>

					</div>
        </div>
      

				<q-separator />

				<q-card-actions align="right">
					<q-btn label="Afegir" type="submit" color="teal" v-if="nouRegistre" />
					<q-btn label="Actualitzar" type="submit" color="primary" v-if="!nouRegistre"/>
					<q-btn flat label="Cancelar" @click="onCancel()" />
				</q-card-actions>

			</q-form>
    </q-card>
  </q-dialog>
</template>




<script>
import Vue from 'vue'
import jmg_clau from './formulariDoc_edicioClau.vue'
import jmg_propietats from './formulariDoc_edicioPropietats.vue'

import Axios from "axios";
const server = "http://localhost:3001";

// class Element{
// 	constructor(clau, valor){
// 		this.clau = clau;
// 		this.valor = valor;
// 	}
// }

export default {
	components: { jmg_clau, jmg_propietats },
	props: ["obrirFormulari", "idMongo"],

  data() {
    return {
			nouRegistre: true,
			elementSeleccionat: [],

			edifici: "",
			planta: "",
			dept: "",
			lloc: "",
			elements: {},

			// element: new Element(),
			nouElement: true,
			indexElementEditat: null,
			
    }
  },



  methods: {

		// al mostrar el quadre de dialeg
		async onShow(){
			console.log("estic onShow del Formulari")
			if (this.idMongo != null){
				this.nouRegistre = false;

				// recuperacio de les dades de la base de dades
				try {
					const result = await Axios.get(server + "/api_inventari/hospital/"+ this.idMongo)
					const objDoc = result.data;

					console.log ("objDoc:", objDoc)

					this.edifici = objDoc.edifici;
					this.planta = objDoc.planta;
					this.dept = objDoc.dept;
					this.lloc = objDoc.lloc;
					this.elements = (objDoc.elements === undefined) ? {} : objDoc.elements; // si a la bdd "elements" = {}, no apareix la propietat "elements" a objDoc. Es per això que faig condicional ternari

				

				} catch (error) {
					console.log("error a actGetDocs")
					console.log( error )
				}
			} else {
				this.nouRegistre = true;
			}
		},


		addClau () { Vue.set(this.elements, "nova clau", {}) },
		updateClau (obj) { 
			console.log ("oldVal", obj.oldVal, "newVal", obj.newVal)
			if ( obj.oldVal !== null) {
				Vue.set(this.elements, obj.newVal, this.elements[obj.oldVal])
				Vue.delete(this.elements, obj.oldVal)
			}
		},

		addProp (clau) { Vue.set(this.elements[clau], "nova prop", "") 	},
		deleProp (clau, prop) { Vue.delete (this.elements[clau], prop) 	},

		updateProp2 (clau, obj) { 
			// console.log("--- updateProp2 ----")
			// console.log ("oldProp", obj.oldProp, "newProp", obj.newProp)
			// console.log("JSON.stringify(obj)", JSON.stringify(obj))
			if ( obj.oldProp !== null) {
				Vue.set(this.elements[clau], obj.newProp, this.elements[clau][obj.oldProp])
				Vue.delete(this.elements[clau], obj.oldProp)
			}
		},

		updateVal2 (clau, obj) { 
			// console.log ("oldVal", obj.oldVal, "newVal", obj.newVal)
			if ( obj.oldVal !== null) {
				Vue.set(this.elements[clau], obj.actualProp, obj.newVal)
			}
		},





    async onSubmit() {
			// this.elements.forEach((elem, index, arr) =>{
			// 	obj[elem.clau] = elem.valor;
			// }, this);
			let registre = {
				edifici: this.edifici,
				planta: this.planta,
				dept: this.dept,
				lloc: this.lloc,
				elements: this.elements
			}
			
			
			if (this.nouRegistre){
				console.log("Estic a la creacio de nou registre")
				this.$store.dispatch("modulInventari/actAdd", registre)
			} else {
				console.log("Estic a la actualitzacio del registre")
				this.$store.dispatch("modulInventari/actActualitzarDoc", {idMongo: this.idMongo, registre})
				then ( result => {
					console.log("result ---", result)
					this.$store.dispatch("actGetDocs");
				})
			}


			// this.element = new Element();

			this.edifici = null;
			this.planta = null;
			this.dept = null;
			this.lloc = null;
			this.elements = {}

			this.nouRegistre = true;

			this.$emit("tancarFormulari");
		},



    onCancel() {
			this.edifici = null;
			this.planta = null;
			this.dept = null;
			this.lloc = null;
			this.elements = {}

			this.nouRegistre = true;

      this.$emit("tancarFormulari");
		},





		afegirActualitzarElement(){
			if (this.nouElement){
				this.elements.push(this.element)
			} else {
				this.elements.splice(this.indexElementEditat,1,this.element)
				this.elementSeleccionat = []
			}
			this.element = new Element();
			this.nouElement = true;
		},

		edicioElement(scope){
			console.log(scope)
			if (this.elementSeleccionat.length != 0){
				this.element= new Element(scope.row.clau, scope.row.valor);
				this.nouElement = false;
				this.indexElementEditat = scope.rowIndex
				console.log("this.indexElementEditat: " + this.indexElementEditat)
			} else {
				this.element = new Element();
				this.nouElement = true;
			}
		},

		eliminarElement(id){
			console.log(id)
			this.elements.splice(id, 1);
		}

  },
};
</script>

<style scoped>
</style>