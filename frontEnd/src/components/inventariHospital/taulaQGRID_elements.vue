<template>
    <div class="column">
        <div class="row" v-for="(valor, propietat) in objElements2" :key="'el'+propietat">
            <div class="col-5 borde font-weight-bold text-uppercase ">
                <q-chip color="orange-10" outline square dense class="text-subtitle2"> {{ propietat }} </q-chip>
            </div>
            <div class="col borde">
                {{ valor }}
            </div>
        </div>
    </div>
</template>


<script>
export default {
    props: ["objElements", "clausAMostrar"],
		
		computed:{
			objElements2: function(){
				let obj = {}
				this.clausAMostrar.forEach( ( clau ) => {
					console.log("clau= " + clau, this.objElements.hasOwnProperty(clau))
					if (this.objElements.hasOwnProperty(clau)) {
						obj[clau] = this.objElements[clau]
					}
				})
				console.log("---------------------")
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