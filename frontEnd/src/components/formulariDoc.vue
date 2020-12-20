<template>
  <q-dialog v-model="activar"> 
    
    <div class="q-pa-md" style="max-width: 400px">

      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
      >
        <q-input
          filled
          v-model="edifici"
          label="Edifici"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Escriu edifici']"
        />

        <q-input
          filled
          type="text"
          v-model="planta"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Escriu planta']"
        />

        <q-input
          filled
          type="text"
          v-model="dept"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Escriu deptartament']"
        />

        <q-input
          filled
          type="text"
          v-model="lloc"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Escriu lloc de treball']"
        />


        <div>
          <q-btn label="Submit" type="submit" color="primary"/>
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>

    </div>


</template>

<script>
export default {
  props: ["activar"],
  data () {
    return {
      
      edifici: '',
			planta: '',
			dept: '',
			lloc: '',
			elements: {}

    }
  },

  methods: {
    onSubmit () {

    },

    onReset () {
 			this.edifici = '',
			this.planta = '',
			this.dept = '',
			this.lloc = '',
			this.elements = {}
    }
  }
}
</script>

<style scoped>

</style>