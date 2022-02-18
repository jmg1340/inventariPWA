<template>
	<div>
		<q-btn label="+ propietat" color="positive" size="xs" class="q-mb-xs" @click="addProp" />
		<div  v-for="(valor, propietat) in objValor" :key="'el'+propietat">
			<jmg_PropVal 
				:propietat="propietat" 
				:valor="valor"
				@eliminarProp = "deleteProp"
				@actualitzarProp = "updateProp"
				@actualitzarValor = "updateVal"
				/>
		</div>
	</div>

</template>


<script>
import jmg_PropVal from "./formulariDoc_edicioPropietat-Valor.vue"

export default {
		components: {jmg_PropVal},
    props: ["objValor"],


		created () {
			// console.log("objValor", this.objValor);
		},

		methods: {
			addProp ()          { this.$emit("novaPropietat") },
			deleteProp ( prop ) { this.$emit("eliminaPropietat", prop) },
			updateProp ( obj )  { this.$emit("actualitzarProp2", obj) },
			updateVal  ( obj )  { this.$emit("actualitzarVal2", obj)  },
			

		},
		

}
</script>
<style lang="css" scoped>

    .borde{
        border: 1px solid rgb(59, 59, 59);
    }

</style>