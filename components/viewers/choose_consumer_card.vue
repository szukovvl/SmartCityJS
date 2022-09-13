<template>
  <div>
    <ConsumerCardComponent :consumer="consumer" />
    <div class="d-flex justify-center">
      <v-btn
        class="ma-2"
        color="success"
        :disabled="consumer === undefined"
        @click="doChoose"
      >
        Выбрать
      </v-btn>
    </div>
  </div>
</template>

<script>
import ConsumerCardComponent from '~/components/viewers/consumer-card.vue'

export default {
  name: 'ChooseConsumerCardComponent',

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
    doChoose () {
      this.$store.dispatch('captureOes', this.consumer.devaddr)
    }
  }
}
</script>
