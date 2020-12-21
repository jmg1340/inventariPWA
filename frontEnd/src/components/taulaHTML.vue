<template>
  <q-page class="q-pa-lg">
    <div class="column">
      <div class="row">
        <q-card class="col-1 no-border-radius q-pa-xs bg-grey-9 text-white">Ed.</q-card>
        <q-card class="col-1 no-border-radius q-pa-xs bg-grey-9 text-white">Pl.</q-card>
        <q-card class="col no-border-radius q-pa-xs bg-grey-9 text-white">Departament.</q-card>
        <q-card class="col no-border-radius q-pa-xs bg-grey-9 text-white">Lloc.</q-card>
        <q-card class="col no-border-radius q-pa-xs bg-grey-9 text-white">Elements</q-card>
        <div class="col-auto">&nbsp;</div>
      </div>
      <jmg_fila v-for="(doc, index) in docs" :key="index" :doc="doc"/>
    </div>
  </q-page>
</template>

<script>
import jmg_fila from "../components/fila.vue";
export default {
  components: { jmg_fila },
  data() {
    return {
    };
  },

  created(){
    this.$store.dispatch( "modulInventari/actGetDocs" );
  },

  computed: {
    docs () {
      return this.$store.state.modulInventari.docs;
    },
  },
};
</script>

<style>

</style>
