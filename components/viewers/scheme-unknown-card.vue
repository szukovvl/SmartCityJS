<template>
  <v-card
    class="card-with-border"
    flat
  >
    <v-card-title class="d-flex flex-nowrap text-no-wrap">
      <v-avatar
        class="mr-2"
        tile
        color="yellow darken-3"
      >
        <v-icon dark>
          mdi-timeline-question-outline
        </v-icon>
      </v-avatar>
      #{{ hub.hub.address }}
    </v-card-title>
    <div class="d-inline-flex">
      <div
        v-for="port in hub.hub.inputs"
        :key="port.address"
        :class="getPortClass(port)"
      >
        {{ getPortName(port) }}
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'SchemeUnknownCadr',

  props: {
    hub: {
      type: Object,
      required: true,
      default () {
        return { hub: { } }
      }
    }
  },

  data: () => ({
  }),

  methods: {
    getPortClass (port) {
      const text = 'px-2 py-1 mx-1 mt-1 white--text'
      if (this.hub.hub !== undefined) {
        const line = this.hub.ports.find(e => e.portaddr === port.address)
        if (port !== undefined && line !== undefined) {
          if (line.oesport.error !== undefined) {
            return text + ' deep-orange accent-3'
          } else {
            return text + ' yellow darken-3'
          }
        }
      }
      return text + ' blue-grey lighten-1'
    },
    getPortName (port) {
      if (this.hub.hub !== undefined && port !== undefined) {
        const line = this.hub.ports.find(e => e.portaddr === port.address)
        if (line !== undefined && line.owndata !== undefined) {
          return line.owndata.subnet.identy
        } else {
          return '#' + port.address
        }
      }
      return ''
    }
  }
}
</script>

<style scoped>
.card-with-border.v-sheet.v-card {
  border: 2px solid #F9A825;
  border-radius: 8px;
}
</style>
