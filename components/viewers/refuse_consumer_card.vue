<template>
  <div>
    <ConsumerCardComponent :consumer="consumer" />
    <div class="d-flex justify-center">
      <v-btn
        class="ma-2"
        color="warning"
        :disabled="consumer === undefined"
        @click="doRefuse"
      >
        Отказаться
      </v-btn>
    </div>
  </div>
</template>

<script>
import ConsumerCardComponent from '~/components/viewers/consumer-card.vue'

export default {
  name: 'RefuseConsumerCardComponent',

  components: { ConsumerCardComponent },

  props: {
    consumer: {
      type: Object,
      required: true
    }
  },

  data: () => ({
  }),

  methods: {
    doRefuse () {
      /* eslint-disable no-console */
      console.log('отказаться', this.consumer.devaddr)
      /* eslint-enable no-console */
      this.$store.dispatch('refuseOes', this.consumer.devaddr)
    }
  }
}
</script>
