<template>
  <v-row class="mt-2">
    <div v-if="$store.state.hasGamer">
      <v-col>
        <SchemeOesView :data="scheme.find(e => e.address === $store.state.gamerKey)" />
        <SchemeView :data="scheme.find(e => e.address === $store.state.gamerKey)" />
      </v-col>
    </div>
    <div v-else>
      <v-col
        v-for="(data, index) in schemeData"
        :key="data.gamerkey"
      >
        <div class="text-subtitle-1 teal darken-4 px-2 py-1 white--text">
          {{ 'Игрок ' + (index + 1) }}
        </div>
        <div>
          <SchemeOesView :data="scheme.find(e => e.address == data.gamerkey)" />
          <SchemeView :data="scheme.find(e => e.address == data.gamerkey)" />
        </div>
      </v-col>
    </div>
  </v-row>
</template>

<script>
import SchemeView from '~/components/viewers/scheme-view.vue'
import SchemeOesView from '~/components/viewers/scheme-oes-view.vue'

export default {
  name: 'SchemesPreparation',

  components: { SchemeOesView, SchemeView },

  data: () => ({
  }),

  computed: {
    schemeData () {
      const items = this.$store.state.schemeData
      return items !== undefined ? items : []
    },
    scheme () {
      const items = this.$store.state.scheme
      return items !== undefined ? items : []
    }
  },

  created () {
    if (process.client) {
      if (this.$store.state.schemeData === undefined ||
      this.$store.state.scheme === undefined ||
      this.$store.state.schemeData.length === 0 ||
      this.$store.state.scheme.length === 0) {
        this.$store.dispatch('requestSchemesData')
      }
    }
  }
}
</script>
