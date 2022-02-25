<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
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
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
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

				<q-item to="/dadesExternes">
					<q-item-section avatar>
						<q-icon name="code" />
					</q-item-section>
					<q-item-section>
						<q-item-label>Dades Externes</q-item-label>
						<q-item-label caption>Incorporació de dades externes</q-item-label>
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
