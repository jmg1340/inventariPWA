
<template>
	<q-input outlined v-model="dClau" dense />	
</template>


<script>
export default {
    props: ["clau"],

		created () { 
			this.dClau = this.clau
		},

		data () {
			return {
				dClau: null
			}
		},

		watch: {
			dClau: function( newVal, oldVal ) {
				// console.log("newVal", newVal, "oldVal", oldVal)
				this.$emit("actualitzarClau", { "newVal": newVal, "oldVal": oldVal} )
			} 
		},
		

 
		
}
</script>

<style lang="css" scoped>

    .borde{
        border: 1px solid rgb(59, 59, 59);
    }

</style>