<template>
	<div class="column">
		<div class="row" v-for="(valor, propietat) in objElements2" :key="'el'+propietat">
			<div class="col-3 borde text-bold text-uppercase ">
				{{ propietat }} 
			</div>
			<div class="col borde bg-white">
				{{ valor }}
			</div>
		</div>
	</div>
</template>


<script>
export default {
    props: ["objValor"],

		created () {
			// console.log("objValor", this.objValor);
		},
		
		computed:{
			objElements2: function(){
				let obj = {}
				Object.keys(this.objValor).forEach( ( clau ) => {
					// console.log("clau= " + clau, this.objValor.hasOwnProperty(clau))
					if (this.objValor.hasOwnProperty(clau)) {
						obj[clau] = this.objValor[clau]
					}
				})
				// console.log("---------------------")
				return obj

			}
		}
}
</script>
<style lang="css" scoped>

    .borde{
        border: 1px solid rgb(59, 59, 59);
    }

</style>