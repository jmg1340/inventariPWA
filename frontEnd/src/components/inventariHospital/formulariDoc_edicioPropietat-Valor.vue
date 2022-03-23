<template>

		<div class="row items-center">
			<div class="col-5 borde text-bold text-uppercase ">
				<q-select outlined v-model="prop" :options="opcionsPropietat" dense />
				<!-- {{ propietat }}  -->
			</div>
			<div class="col borde bg-white">
				<q-input outlined v-model="val" dense/>
				<!-- {{ valor }} -->
			</div>
			<div class="col-auto">
				<q-btn flat dense icon="delete" color="negative" size="sm" @click="eliminarPropietat"/>
			</div>
		</div>
</template>


<script>
export default {
    props: ["propietat", "valor"],
		created () { 
			// console.log("propietat", this.propietat, "valor", this.valor)
			let propTrobada = this.opcionsPropietat.find( obj => obj.value === this.propietat )
			this.prop = (propTrobada === undefined) ? {label: "nova Prop", value: "nova prop"} : propTrobada
			
			this.val = this.valor
		},

		data () {
			return {
				prop: null,
				val: null,

				opcionsPropietat: [
					{label: "ns", value: "ns"},
					{label: "dossier", value: "dossier"},
					{label: "mac", value: "mac"},
					{label: "marca", value: "marca"},
					{label: "model", value: "model"},
					{label: "macTelf", value: "macTelf"},
					{label: "macDX", value: "macDX"},
					{label: "switch", value: "switch"},
					{label: "portsw", value: "portsw"},
					{label: "roseta", value: "roseta"},
					
				],
			}
		},

		watch: {
			prop: function( newProp, oldProp){
				this.$emit("actualitzarProp", { "newProp": newProp.value, "oldProp": (oldProp === null) ? null : oldProp.value } )
			},

			val: function( newVal, oldVal ){
				this.$emit("actualitzarValor", { "newVal": newVal, "oldVal": oldVal, "actualProp": this.prop.value} )
			},
			
		},

		methods: {

			/** 
			* Elimina una propietat del element.
			*/
			eliminarPropietat () {
				this.$emit("eliminarProp", this.propietat)
			}
		}


		
}
</script>
<style lang="css" scoped>

    .borde{
        border: 1px solid rgb(59, 59, 59);
    }

</style>