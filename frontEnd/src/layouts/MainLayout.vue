<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-grey-9">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Inventari
        </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
			overlay
    >
      <q-list  :style="{ backgroundColor: '#eee', color: 'blue'}">
        <!-- <q-item-label
          header
          class="text-grey-8"
        >
          Essential links
        </q-item-label> -->
        <!-- <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        /> -->

				<q-item to="/">
					<q-item-section avatar>
						<q-icon name="code" />
					</q-item-section>
					<q-item-section>
						<q-item-label>Inventari Hospital</q-item-label>
						<q-item-label caption>Inventari elaborat per nosaltres</q-item-label>
					</q-item-section>
				</q-item>

        <q-separator></q-separator>

        <div class="text-white bg-red-10 text-center">
          Dades externes
        </div>

        <q-separator></q-separator>


				<q-item to="/dadesElasticSearch">
					<q-item-section avatar>
						<q-icon name="code" />
					</q-item-section>
					<q-item-section>
						<q-item-label>Dades ELASTIC SEARCH</q-item-label>
						<q-item-label caption>Incorporació de dades d'Elastic Search</q-item-label>
					</q-item-section>
				</q-item>


				<q-item to="/inventariAsepeyo">
					<q-item-section avatar>
						<q-icon name="code" />
					</q-item-section>
					<q-item-section>
						<q-item-label>Inventari Asepeyo</q-item-label>
						<q-item-label caption>Inventari oficial Asepeyo</q-item-label>
					</q-item-section>
				</q-item>

				<q-item to="/telefons">
					<q-item-section avatar>
						<q-icon name="code" />
					</q-item-section>
					<q-item-section>
						<q-item-label>Telèfons fixes</q-item-label>
						<q-item-label caption>Telèfons CP8811 i CP901</q-item-label>
					</q-item-section>
				</q-item>






      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
// import EssentialLink from 'components/EssentialLink.vue'


export default {
  name: 'MainLayout',
	// components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      // essentialLinks: linksData
    }
  }
}
</script>
