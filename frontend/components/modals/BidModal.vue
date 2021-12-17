<template>
  <div class="card">
    <div class="modal-card-head">
      <h4>Bid to {{projectName}}</h4>
    </div>
    <div class="modal-card-body">
      <b-field label="Amount" custom-class="label">
        <b-numberinput v-model="amount" :step="100" :min="100" required />
      </b-field>
      <b-field label="Lease">
        <b-slider :min="minRange" :max="maxRange"  v-model="leases"></b-slider>
      </b-field>
    </div>
    <footer class="modal-card-foot">
      <b-button class="button btn-sm bg-maroon" :loading="isLoading" @click="bid">
        BID
      </b-button>
    </footer>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import BigNumber from "bignumber.js";
const { mapActions, mapGetters } = createNamespacedHelpers("cell");
export default {
  name: "ApplyModal",
  props: {
    projectName: {
      type: String,
      default: ''
    },
    maxRange: {
      type: Number,
      default: 8
    },
    minRange: {
      type: Number,
      default: 1
    },
    address: {
      type: String,
      default: '0x0'
    }
  },
  data() {
    return {
      isLoading: false,
      leases: [1, 8],
      amount: 1000
    };
  },
  computed: {
    ...mapGetters(["isConnected", "celltoken"]),
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
    ...mapActions(["bidToProject"]),
    onCopy(e) {
      this.$buefy.toast.open({
          message: `Copied Text`,
          type: 'is-success'
      })
    },
    onError(e) {
      this.$buefy.toast.open({
          message: `Failed to Copy`,
          type: 'is-success'
      })
    },
    async bid() {
      if (this.amount < 100) {
        this.$buefy.toast.open({
          duration: 2000,
          message: 'You should bid at least 100$CELL',
          type: 'is-warning'
        })
        return;
      }
      const bidAmount = new BigNumber(this.amount).times(new BigNumber('10').pow(this.celltoken.decimals))
      if (bidAmount.gt(this.celltoken.userBalance)) {
        this.$buefy.toast.open({
          duration: 2000,
          message: 'Insufficient Funds.',
          type: 'is-warning'
        })
        return;
      }
      try {
        this.isLoading = true;
        await this.bidToProject({
          amount: bidAmount.toFixed(),
          leases: this.leases,
          address: this.address
        })
        this.$buefy.toast.open({
          duration: 3000,
          message: "Successfully bidded your tokens!",
          type: "is-success"
        });
      } catch (err) {
        console.log(err)
        this.$buefy.toast.open({
          duration: 3000,
          message: "Failed to bid!",
          type: "is-danger"
        });
      } finally {
        this.isLoading = false;
        this.$parent.close()
      }
    },
    formatUnclaimedFromTargetAmount(amount) {
      return new BigNumber(amount)
        .div(new BigNumber(10).pow(this.swap.targetToken.targetTokenDecimals))
        .toFormat();
    }
  }
};
</script>

<style lang="sass" scoped>
@use "sass:math"
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

.claim-cell
  margin-top: $margin
  &__field
    color: #FFF
    &:not(first-child)
      margin-top: $margin * 2
    &-input
      border: 3px solid #2D176A
      padding: $margin $margin * 1.5
      margin: 0em 0em
      box-shadow: none
      font-size: 1rem
      height: auto
      width: 100%
      font-weight: 600
      color: #FFF
      background: #050117

.gas-fee
  +is-relative
  margin: $margin * 2 auto math.div($margin, 6)
  font-size: 18px
  font-weight: 700
  color: #CE1C58
  +is-block

.copy-button
  width: 15px
  height: auto
  min-width: 15px
  display: block
  margin-right: math.div($margin, 2)
  margin-top: 3px
  opacity: 0.6
  &:hover
    opacity: 1

.swap-details
  display: flex !important
  @include flexbox(row-reverse, center, flex-end)
  font-size: 1em !important
  color: #FFF !important
  line-height: 1
  margin-top: math.div($margin, 2)
</style>
