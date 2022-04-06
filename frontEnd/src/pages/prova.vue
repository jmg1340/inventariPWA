<template>
  <q-page class="q-pa-md">
		PROVA


		<q-table
			title="Telèfons"
			:data="rows"
			:columns="columns"
			row-key="name"
		/>

		<pre>{{ rows }}</pre>	

  </q-page>
</template>

<script>


export default {



  data() {
    return {


      columns: [
        {
          name: "DEVICE_NAME",
          label: "DEVICE_NAME2",
          field: "DEVICE_NAME",
          // sortable: true,
        },
        {
          name: "DESCRIPTION",
          label: "DESCRIPTION2",
          field: "DESCRIPTION",
        },

      ],

      rows: [
        {
          DEVICE_NAME: "SEP247E12BF7684",
          DESCRIPTION: "Supervision_Quirofano_UCI_0885",
        },
        {
          DEVICE_NAME: "SEPF87B204FFA2D",
          DESCRIPTION: "Prequirofano 4_0885",
        },

      ],
    };
  }


};
</script>

<style>
</style>