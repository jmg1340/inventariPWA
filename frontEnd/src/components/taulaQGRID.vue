<template>
  <q-card
    :class="
      !$q.dark.isActive
        ? 'my-lg q-pa-md q-ma-sm bg-grey-2'
        : 'my-lg q-pa-md q-ma-sm bg-grey-8'
    "
  >
    <q-toolbar>

        <q-toolbar-title class="example-title" style="padding: 5px 20px"
          ><span class="ellipsis">Llistat</span></q-toolbar-title
        >

    </q-toolbar>
    <q-card-section>
      <q-grid
        :data="docs"
        :columns="columnes"
        :columns_filter="true"
        :draggable="true"
				dense
				:pagination="initialPagination"
				separator="cell"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="edifici">
              {{ props.row.edifici }}
            </q-td>
            <q-td key="pl">
              {{ props.row.planta }}
            </q-td>
            <q-td key="dpt">
              {{ props.row.dept }}
            </q-td>
            <q-td key="lloc">
              {{ props.row.lloc }}
            </q-td>
            <q-td key="el">
							<jmg_elements :objElements="props.row.elements" />
              <!-- {{ props.row.elements }} -->
            </q-td>
            <q-td key="id">
              <div class="row justify-center items-center q-gutter-xs">
                <q-btn dense color="warning" icon="edit" />
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
      </q-grid>
    </q-card-section>
  </q-card>
</template>

<script>
import jmg_elements from "./taulaQGRID_elements.vue";
export default {
  components: { jmg_elements },
  data() {
    return {
      columnes: [
        {
          name: "ed",
          label: "EDIFICI",
          field: "edifici",
          style: "text-align: center",
          headerClasses: "bg-grey-8 text-white",
					align: "center",
					sortable: true,
					style: 'width: 5%'
        },
        {
          name: "pl",
          label: "PLANTA",
          field: "planta",
          style: "text-align: center",
          headerClasses: "bg-grey-8 text-white",
					align: "center",
					sortable: true,
					style: 'width: 5%'
        },
        {
          name: "dpt",
          label: "DEPT",
          field: "dept",
          style: "text-align: left",
          headerClasses: "bg-grey-8 text-white",
					align: "left",
					sortable: true,
					style: 'width: 20%'
        },
        {
          name: "lloc",
          label: "LLOC",
          field: "lloc",
          style: "text-align: left",
          headerClasses: "bg-grey-8 text-white",
					align: "left",
					sortable: true,
					style: 'width: 30%'
        },
        {
          name: "el",
          label: "ELEMENTS",
          field: "elements",
          style: "text-align: left",
          headerClasses: "bg-grey-8 text-white",
          align: "left",
					style: 'width: 30%'
        },
        {
          name: "id",
          label: "Accions",
          field: "_id",
          style: "text-align: left",
          headerClasses: "bg-grey-8 text-white",
          align: "center",
					style: 'width: 10%'
        },
			],

			props: {
					tagParts: {
							type: Object,
							default: () => {
							}
					}
			},			

      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 5,
      },
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

  methods: {
    async eliminar(id) {
      console.log(id);

      await this.$store.dispatch("modulInventari/actRemoveDoc", id);
      await this.$store.dispatch("modulInventari/actGetDocs");
    },
  },
};
</script>

<style scoped>
</style>