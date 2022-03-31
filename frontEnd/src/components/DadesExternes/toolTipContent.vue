<template>

  <span>
		<!-- <div>
			Aixo es una prova
		</div> -->
		
    <div class="row q-gutter-md">
      <div class="col">
        EDIFICI {{ objDades.edifici}} <br>
        PLANTA: {{ objDades.planta }} <br>
        DEPT: {{ objDades.dept }} <br>
        LLOC: {{ objDades.lloc }}
      </div>
      <div class="col">
				
        <div v-for="(elemPropValor, id) in objDades.elementsPropValor" :key="'e'+id">
          {{ elemPropValor }}
        </div>
        
      </div>
    </div>
  </span>

</template>

<script>
export default {
  props: ["idMongo"],

  computed:{

    objDades () {
      // array documents de inventari hospital
      const arrDocsHosp = this.$store.state.modulInventari.docs;

      // console.log("this.idMongo", this.idMongo)
      const objTrobat = arrDocsHosp.find( obj => obj._id === this.idMongo )

      // console.log("objTrobat", objTrobat)


      // if ( objTrobat !== undefined ) {
        const obj = {}

        obj.edifici = objTrobat.edifici || "no hi ha informacio"
        obj.planta = objTrobat.planta || "no hi ha informacio"
        obj.dept = objTrobat.dept || "no hi ha informacio"
        obj.lloc = objTrobat.lloc || "no hi ha informacio"

				const arr = []
				Object.keys(objTrobat.elements).forEach ( element => {
					Object.keys(objTrobat.elements[element]).forEach ( propietat => {
						arr.push(`${element} - ${propietat}: ${objTrobat.elements[element][propietat]}`)
					})
				})
				console.log("arr", arr)
        obj.elementsPropValor = arr
      // } else {

      // }

			console.log("obj", obj)
      return obj
    }

  }

}
</script>

<style>

</style>