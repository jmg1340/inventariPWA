<template>
  <div>
    <q-table
      title="Inventari HOSPITAL"
      :data="docs"
      :columns="columnes"
      row-key="__id"
      separator="cell"
      dense
      :pagination="initialPagination"
      :filter="filter"
      :filter-method="myfilterMethod"
      class="my-sticky-header-table"
    >
      <template v-slot:top-right>
        <div class="row q-gutter-md">
          <div class="column q-gutter-md">
            <div class="col-2">
              <q-input
                borderless
                outlined
                rounded
                dense
                debounce="30"
                label="Edifici"
                v-model="filter.fedifici"
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
          <div class="column q-gutter-md">

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
                label="element.CLAU"
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
                label="element.VALOR"
                v-model="filter.felement.valor"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>

            </div>
          </div>
        </div>

        <q-btn
          class="q-ml-sm"
          color="teal"
          noCaps
          label="Afegir..."
          @click="add"
        />
        <q-space />
      </template>

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
            <jmg_elements :objElements="props.row.elements" />
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

    <jmg_formulari
      :obrirFormulari="obrirFormulari"
      :idMongo="idMongo"
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
          style: "width: 30%"
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
      }
    };
  },

  created() {
    this.$store.dispatch("modulInventari/actGetDocs");
  },

  computed: {
    docs() {
      return this.$store.state.modulInventari.docs;
    }
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

      return this.docs.filter(row => {
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
          console.log(elements)
          return Object.keys(elements).some( (clau) => new RegExp(this.filter.felement.valor, "i").test(elements[clau])  )
        }
      }
    }



  }
};
</script>

<style lang="sass" scoped>
  tr:nth-child(even) 
    background-color: #f5f5f579 !important
 
</style>
