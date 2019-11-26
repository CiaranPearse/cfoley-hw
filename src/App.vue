<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-avatar color="indigo" size="48">
          <span class="white--text headline">HW</span>
        </v-avatar>
      </div>
    </v-app-bar>
    <v-content>
      <PropertyList/>
    </v-content>
  </v-app>
</template>

<script>
import PropertyList from './components/PropertyList'

export default {
  name: 'App',

  components: {
    PropertyList
  },

  data: () => ({
    //
  })
}
</script>
