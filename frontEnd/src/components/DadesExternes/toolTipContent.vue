<template>

  <q-card>
    <div class="row">
      <div class="col">
        EDIFICI {{ objDades.edifici}} <br>
        <!-- PLANTA: {{ objDades.planta }} <br>
        DEPARTAMENT: {{ objDades.departament }} <br>
        LLOC: {{ objDades.lloc }} -->
      </div>
      <div class="col">
        <!-- <div v-for="(element, id) in Object.keys(objDades.elements)" :key="'e'+id">
          {{ element.upperCase() }}
        </div> -->
        
      </div>
    </div>
  </q-card>

</template>

<script>
export default {
  props: ["idMongo"],

  computed:{

    objDades () {
      // array documents de inventari hospital
      const arrDocsHosp = this.$store.state.modulInventari.docs;

      console.log("this.idMongo", this.idMongo)
      const objTrobat = arrDocsHosp.find( { _id: this.idMongo} )

      console.log("objTrobat", objTrobat)


      // if ( objTrobat !== undefined ) {
        const obj = {}

        obj.edifici = objTrobat.edifici || "no hi ha informacio"
        obj.planta = objTrobat.planta || "no hi ha informacio"
        obj.departament = objTrobat.departament || "no hi ha informacio"
        obj.lloc = objTrobat.lloc || "no hi ha informacio"
        obj.elements = objTrobat.elements
      // } else {

      // }

      return obj
    }

  }

}
</script>

<style>

</style>