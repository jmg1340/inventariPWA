<template>
  <div class="row">
    <q-card class="col-1 no-border-radius q-pa-xs">
      {{ doc.edifici }}
    </q-card>
    <q-card class="col-1 no-border-radius q-pa-xs">
      {{ doc.planta }}
    </q-card>
    <q-card class="col no-border-radius q-pa-xs">
      {{ doc.dept }}
    </q-card>
    <q-card class="col no-border-radius q-pa-xs">
      {{ doc.lloc }}
    </q-card>
    <q-card class="col no-border-radius q-pa-xs"> 
      <jmg_elements :objElements="doc.elements" />
    </q-card>

    <div class="col-auto q-mx-md">
      <div class="row justify-center items-center q-gutter-xs">
        <q-btn dense color="primary" icon="edit" />
        <q-btn dense color="negative" icon="delete_forever" @click="eliminar(doc._id)" />
      </div>
      
    </div>
  </div>
</template>

<script>
import jmg_elements from "./elements.vue";
export default {
  props: ["doc"],
  components: { jmg_elements },
  data() {
    return {};
  },

  methods: {
    async eliminar(id) {
      console.log(id)
      
      await this.$store.dispatch( "modulInventari/actRemoveDoc", id );
      await this.$store.dispatch( "modulInventari/actGetDocs" );

    },

  },
};
</script>
