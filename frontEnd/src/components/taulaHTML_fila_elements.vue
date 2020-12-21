<template>
    <div class="column">
        <div class="row" v-for="(valor, propietat) in objElements" :key="'el'+propietat">
            <div class="col-5 borde font-weight-bold text-uppercase ">
                <q-chip color="warning" outline square dense class="text-subtitle2"> {{ propietat }} </q-chip>
            </div>
            <div class="col borde">
                {{ valor }}
            </div>
        </div>
    </div>
</template>


<script>
export default {
    props: ["objElements"]
}
</script>
<style lang="css" scoped>

    .borde{
        border: 1px solid black;
    }

</style>