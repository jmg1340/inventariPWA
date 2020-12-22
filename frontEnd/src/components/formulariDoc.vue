<template>
  <q-dialog v-model="obrirFormulari" full-width >
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
									/>
							</q-card-section>
						</q-card>

					</div>
        </div>
      

				<q-separator />

				<q-card-actions align="right">
					<q-btn label="Afegir" type="submit" color="teal" />
					<q-btn flat label="Cancelar" @click="onCancel()" />
				</q-card-actions>

			</q-form>
    </q-card>
  </q-dialog>
</template>




<script>

class Element{
	constructor(clau, valor){
		this.clau = clau;
		this.valor = valor;
	}
}

export default {
  props: ["obrirFormulari"],
  data() {
    return {
			edifici: null,
			planta: null,
			dept: null,
			lloc: null,

			element: new Element(),
			elements: [],
			nouElement: true,

			
			
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

			]
    };
  },

  methods: {
    async onSubmit() {
			let obj = {}
			this.elements.forEach((elem, index, arr) =>{
				obj[elem.clau] = this[elem.valor];
			}, this);
			let registre = {
				edifici: this.edifici,
				planta: this.planta,
				dept: this.dept,
				lloc: this.lloc,
				elements: obj
			}

			this.$store.dispatch("modulInventari/actAdd", registre)
			this.$store.dispatch("modulInventari/actGetDocs")


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
				// this.elements.splice()
			}
			this.element = new Element();
			this.nouRegistre = true;
		}

  },
};
</script>

<style scoped>
</style>