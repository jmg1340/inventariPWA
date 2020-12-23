<template>
  <q-dialog v-model="obrirFormulari" full-width @show="onShow">
    <q-card class="q-pa-md" style="max-width: 600px">
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div class="row q-gutter-md">
          <div class="col">
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


          <div class="col">
						<q-card>
							<q-card-section>
								<div class="row q-gutter-sm">
									
										<div class="col">
											<q-input dense label="Clau" type="text" v-model="element.clau" />
										</div>
										<div class="col">
											<q-input dense label="Valor" type="text" v-model="element.valor" />
										</div>
										<div class="col-auto">
											<q-btn icon="add_circle" dense color="teal" v-if="nouElement" @click="afegirActualitzarElement"/>
											<q-btn icon="check_circle" dense color="teal" v-if="!nouElement" @click="afegirActualitzarElement"/>
										</div>
									
								</div>
							</q-card-section>
							<q-card-section>
								<q-table
									:data="elements"
									:columns="columnes"
									row-key="clau"
									dense
									separator="cell"
									selection="single"
      						:selected.sync="elementSeleccionat"
									
									>
										<template v-slot:body-selection="scope">
											<q-checkbox v-model="scope.selected" @input="edicioElement(scope)" />
											<q-btn icon="delete_forever" dense color="red" @click="eliminarElement(scope.rowIndex)" />
										</template>
								</q-table>
							</q-card-section>
						</q-card>

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
import Axios from "axios";
const server = "http://localhost:3000";

class Element{
	constructor(clau, valor){
		this.clau = clau;
		this.valor = valor;
	}
}

export default {
	props: ["obrirFormulari", "idMongo"],

  data() {
    return {
			nouRegistre: true,
			elementSeleccionat: [],

			edifici: "",
			planta: "",
			dept: "",
			lloc: "",

			element: new Element(),
			elements: [],
			nouElement: true,
			indexElementEditat: null,
			
			
			columnes: [
        {
          name: "clau",
          label: "Clau",
          field: "clau",
          style: "text-align: left",
          headerClasses: "bg-grey-8 text-white",
          align: "left",
					//style: 'width: 5%'
        },
        {
          name: "valor",
          label: "Valor",
          field: "valor",
          style: "text-align: left",
          headerClasses: "bg-grey-8 text-white",
          align: "left",
					//style: 'width: 5%'
        },
        // {
        //   name: "accio",
        //   label: "",
        //   field: row => this.elements.indexOf(row),
        //   style: "text-align: left",
        //   headerClasses: "bg-grey-8 text-white",
        //   align: "left",
				// 	style: 'width: 5%'
        // },

			]
    };
  },



  methods: {

		async onShow(){
			console.log("estic onShow del Formulari")
			if (this.idMongo != null){
				this.nouRegistre = false;
				try {
					const result = await Axios.get(server + "/api_inventari/"+ this.idMongo)
					const data = result.data;

					this.edifici = data.edifici;
					this.planta = data.planta;
					this.dept = data.dept;
					this.lloc = data.lloc;

					// transformem propietats - valors de l'objecte Elements a array tipus [{clau: propietat, valor: valorPropietat}]
					console.log(data.elements)
					console.log(data.elements.keys)
					Object.keys(data.elements).forEach( elemKey => {
						this.elements.push({
							clau: elemKey,
							valor: data.elements[elemKey]
						})
					}, this)

				

				} catch (error) {
					console.log("error a actGetDocs")
					console.log( error )
				}
			} else {
				this.nouRegistre = true;
			}
		},








    async onSubmit() {
			
			let obj = {}
			this.elements.forEach((elem, index, arr) =>{
				obj[elem.clau] = elem.valor;
			}, this);
			let registre = {
				edifici: this.edifici,
				planta: this.planta,
				dept: this.dept,
				lloc: this.lloc,
				elements: obj
			}
			
			
			if (this.nouRegistre){
				console.log("Estic a la creacio de nou registre")
				this.$store.dispatch("modulInventari/actAdd", registre)
			} else {
				console.log("Estic a la actualitzacio del registre")
				this.$store.dispatch("modulInventari/actActualitzarDoc", {idMongo: this.idMongo, registre})
			}


			this.element = new Element();

			this.edifici = null;
			this.planta = null;
			this.dept = null;
			this.lloc = null;
			this.elements = []

			this.nouRegistre = true;

			this.$emit("tancarFormulari");
		},



    onCancel() {
			this.element = new Element();

			this.edifici = null;
			this.planta = null;
			this.dept = null;
			this.lloc = null;
			this.elements = []

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