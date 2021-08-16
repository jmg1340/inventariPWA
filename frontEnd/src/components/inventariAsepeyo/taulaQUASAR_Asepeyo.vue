<template>
  <div>
    <q-table
      title="Inventari ASEPEYO"
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
                label="Centro"
                v-model="filter.fcentro"
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
                label="Puesto"
                v-model="filter.fpuesto"
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
                label="Den. Puesto"
                v-model="filter.fDP"
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
                label="NSerie"
                v-model="filter.fNS"
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
                label="DOSSIER"
                v-model="filter.fDos"
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
                label="DESIGNACION"
                v-model="filter.fDes"
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
                label="PIN"
                v-model="filter.fPIN"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>


          </div>
        </div>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="cen" :props="props">
            {{ props.row.Centro }}
          </q-td>
          <q-td key="pu" :props="props">
            {{ props.row.Puesto }}
          </q-td>
          <q-td key="dp" :props="props">
            {{ props.row.DenPuesto }}
          </q-td>
          <q-td key="NS" :props="props">
            {{ props.row.NSerie }}
          </q-td>
          <q-td key="Dossier" :props="props">
            {{ props.row.Dossier }}
          </q-td>
          <q-td key="Des" :props="props">
            {{ props.row.Designacion }}
          </q-td>
          <q-td key="Pin" :props="props">
            {{ props.row.PIN }}
          </q-td>

        </q-tr>
      </template>
    </q-table>

  </div>
</template>

<script>

export default {
  data() {
    return {
      filter: { fcentro: "", fpuesto: "", fDP: "", fNS: "", fDos: "", fDes: "", fPIN: "" },
      columnes: [
        {
          name: "cen",
          label: "CENTRO",
          field: "Centro",
          style: "text-align: center",
          headerClasses: "bg-grey-8 text-white",
          align: "center",
          style: "width: 5%"
        },
        {
          name: "pu",
          label: "PUESTO",
          field: "Puesto",
          style: "text-align: center",
          headerClasses: "bg-grey-8 text-white",
          align: "center",
          style: "width: 5%"
        },
        {
          name: "dp",
          label: "DEN.PUESTO",
          field: "DenPuesto",
          style: "text-align: left",
          headerClasses: "bg-grey-8 text-white",
          align: "left",
          style: "width: 20%"
        },
        {
          name: "NS",
          label: "NSerie",
          field: "NSerie",
          style: "text-align: left",
          headerClasses: "bg-grey-8 text-white",
          align: "left",
          style: "width: 30%"
        },
        {
          name: "Dossier",
          label: "DOSSIER",
          field: "Dossier",
          style: "text-align: left",
          headerClasses: "bg-grey-8 text-white",
          align: "left",
          style: "width: 30%"
        },
        {
          name: "Des",
          label: "DESIGNACION",
          field: "DESIGNACION",
          style: "text-align: left",
          headerClasses: "bg-grey-8 text-white",
          align: "left",
          style: "width: 40%"
        },
        {
          name: "Pin",
          label: "PIN",
          field: "PIN",
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
    this.$store.dispatch("modulInventari/actGetDocsAsepeyo");
  },

  computed: {
    docs() {
      return this.$store.state.modulInventari.docsAsepeyo;
    }
  },

  methods: {
    
		myfilterMethod() {
			console.log("estic a myFilterMethod")
      return this.docs.filter(row => {
				console.log(row)
        if (
          new RegExp(this.filter.fcentro, "i").test(row.Centro) &&
          new RegExp(this.filter.fpuesto, "i").test(row.Puesto) &&
          new RegExp(this.filter.fDP, "i").test(row.DenPuesto) &&
          new RegExp(this.filter.fNS, "i").test(row.NSerie) &&
          new RegExp(this.filter.fDos, "i").test(row.Dossier) &&
          new RegExp(this.filter.fDes, "i").test(row.Designacion) &&
          new RegExp(this.filter.fPIN, "i").test(row.PIN)
        ){
          return true;
        } else {
          return false;
        }
      });
    },



  }
};
</script>

<style lang="sass" scoped>
  tr:nth-child(even) 
    background-color: #f5f5f579 !important
 
</style>
