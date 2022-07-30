<template>
  <div>
    <v-card
      v-for="item in items"
      :key="buildKey(item)"
    >
      <v-card-title>
        {{ item.text }}
      </v-card-title>
    </v-card>
  </div>
</template>

<script>
import {
  GAME_COMPONENT_ES_TYPES,
  API_ENERGY_SERVICE_FIND
} from '~/assets/helpers'

export default {
  name: 'FacilitiesESComponent',

  props: {
    isReload: {
      type: Boolean,
      required: true
    }
  },

  data: () => ({
    items: [
      { key: 'CONSUMER', extkey: 'HOSPITAL', text: 'Потребители 1-й категории надежности', component: undefined },
      { key: 'CONSUMER', extkey: 'INDUSTRY', text: 'Потребители 2-й категории надежности', component: undefined },
      { key: 'CONSUMER', extkey: 'DISTRICT', text: 'Потребители 3-й категории надежности', component: undefined },
      { key: 'GENERATOR', extkey: undefined, text: 'Генераторы', component: undefined },
      { key: 'STORAGE', extkey: undefined, text: 'Системы хранения', component: undefined },
      { key: 'GREEGENERATOR', extkey: 'SOLAR', text: 'Солнечная генерация', component: undefined },
      { key: 'GREEGENERATOR', extkey: 'WIND', text: 'Ветрогенерация', component: undefined }
    ]
  }),

  computed: {
  },

  watch: {
    isReload (v) {
      /* if (v) {
        this.loadComponents()
      } */
    }
  },

  created () {
  },

  methods: {
    loadComponents () {
      for (const item of GAME_COMPONENT_ES_TYPES) {
        this.$axios.$get(API_ENERGY_SERVICE_FIND + '/' + item.value, { progress: false })
          .then((v) => {
            this.setComponentData(item.value, v)
          })
          .catch((error) => {
            this.items = []
            /* eslint-disable no-console */
            if (error.response) {
              console.error('ошибка %d: %s', error.response.status, error.response.data)
            }
            /* eslint-enable no-console */
          })
      }
    },

    setComponentData (key, data) {
      /* eslint-disable no-console */
      console.log(data)
      /* eslint-enable no-console */
      /* let item
      if (key === 'CONSUMER') {
        item = this.items.find(e => e.data.consumertype === key)
      } */
      /* const item = this.items.find(e => e.key === key)
      if (item !== undefined) {
        item.component = data
      } */
    },
    buildKey: item => item.extkey === undefined ? item.key : item.key + '-' + item.extkey
  }
}
</script>
