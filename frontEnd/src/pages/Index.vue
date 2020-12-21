<template>
  <q-page class="q-pa-lg">
		<jmg_taulaGRID />
		<!-- <jmg_taula /> -->
  </q-page>
</template>

<script>
import jmg_taula from "../components/taulaQUASAR.vue";
import jmg_taulaGRID from "../components/taulaQGRID.vue";
export default {
  components: { jmg_taula, jmg_taulaGRID },
  data() {
    return {
    };
  },


};
</script>

<style>

</style>
