<template>
  <div>
    <v-card
      v-for="item in items"
      :key="item.identy"
    >
      <v-card-text>
        {{ item.data }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'FacilitiesESComponent',

  props: {
    items: {
      type: Array,
      required: true
    }
  },

  data: () => ({
    objectTypes: [
      { text: 'потребители', value: 'CONSUMER' },
      { text: 'генераторы', value: 'GENERATOR' },
      { text: 'хранение', value: 'STORAGE' },
      { text: 'альтернативная энергетика', value: 'GREEGENERATOR' }
    ]
  })
}
</script>
