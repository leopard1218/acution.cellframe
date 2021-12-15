<template>
  <div class="card">
    <div class="modal-card-head">
      <h4>Create Auction</h4>
    </div>
    <div class="modal-card-body">
      <template v-if="futureAuction.auctionState == 0">
        <b-field label="Lease" custom-class="label">
          <b-numberinput v-model="maxRange" :min="1" :max="8" required />
        </b-field>
        <b-field label="Minimul Score">
          <b-numberinput :min="0" :max="250000"  v-model="minCost" required />
        </b-field>
      </template>
      <template v-else>
        <h2>There is an upcoming auction...</h2>
      </template>
    </div>
    <footer class="modal-card-foot">
      <b-button class="button btn-sm bg-maroon" :loading="isLoading" @click="createAuction">
        CREATE
      </b-button>
    </footer>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapGetters } = createNamespacedHelpers("cell");
export default {
  name: "ApplyModal",
  props: {
    isActive: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isLoading: false,
      maxRange: 8,
      minCost: 250000
    };
  },
  computed: {
    ...mapGetters(["isConnected", "futureAuction", "activeAuction"]),
  },
  watch: {
    isConnected(connected) {
      if (!connected) {
        this.$parent.close()
      }
    }
  },
  mounted() {
  },
  methods: {
    ...mapActions(["createActiveAuction", "createFutureAuction"]),
    async createAuction() {
      try {
        this.isLoading = true
        if (this.isActive)
          await this.createActiveAuction({ maxRange: this.maxRange, minimalCellSlotPrice: this.minCost })
        else 
          await this.createFutureAuction({ maxRange: this.maxRange, minimalCellSlotPrice: this.minCost })
        this.$buefy.toast.open({
          duration: 3000,
          message: "Auction was created successfully.",
          type: "is-success"
        });
      } catch (error) {
        console.log(error)
        this.$buefy.toast.open({
          duration: 3000,
          message: "Auction creation failed.",
          type: "is-danger"
        });
      } finally {
        this.isLoading = false
        this.$parent.close()
      }
    }
  }
};
</script>

<style lang="sass" scoped>
@import "/assets/utilities/_component-variables.sass"

$color: #ffffff

.modal-card-body
  padding: $margin * 2.3
  background: #080025
  border-bottom: 4px solid #2D176A
  color: #ffffff
  border-radius: 0px
  // @include size(100%, 100%)

.label 
  color: #ffffff

.modal-card-head
  padding: $margin $margin * 2.3
  background: #080025
  color: #FFF
  border-bottom: 4px solid #2D176A
  border-radius: 0px

.modal-card-foot
  background: #080025
  padding-right: $margin * 2.3
  justify-content: flex-end
  border: none
  border-radius: 0px

.message
  margin-top: $margin
  background: #2D176A
  border: none
  color: #fff
  padding: 1.25em 1.5em
  h5
    margin-bottom: $margin
    color: #CE1C58

.card
  border: 6px solid #2D176A
</style>
