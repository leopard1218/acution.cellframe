<template>
  <div class="card">
    <div class="modal-card-head">
      <h4>Apply Your Project</h4>
    </div>
    <div class="modal-card-body">
      <b-field label="Name" custom-class="label">
        <b-input v-model="info.projectName" required />
      </b-field>
      <b-field label="Type">
        <b-select v-model="info.projectType" required >
          <option value="0">Crowdloan</option>
          <option value="1">Private</option>
        </b-select>
      </b-field>
      <b-field label="Lease">
        <b-slider :min="1" :max="maxRange" :step="1" v-model="info.leases"></b-slider>
      </b-field>
      <b-field label="Reference URL">
        <b-input v-model="info.url" type="url" />
      </b-field>
      <b-field>
        <b-switch :value="true" type="is-success" v-model="info.hasToken">
          Governance Token
        </b-switch>
      </b-field>
      <template v-if="info.hasToken">
        <b-field label="Token Name">
          <b-input v-model="info.tokenName" />
        </b-field>
        <b-field label="MAX SUPPLY">
          <b-numberinput v-model="info.maxSupply" min="0" />
        </b-field>
        <b-field label="MAX REWARDS">
          <b-numberinput v-model="info.maxRewards" min="0" />
        </b-field>
        <b-field label="ScorePerToken">
          <b-numberinput v-model="info.scorePerToken" min="1" />
        </b-field>
      </template>
    </div>
    <footer class="modal-card-foot">
      <b-button class="button btn-sm bg-maroon" :loading="isLoading" @click="apply">
        Apply Now
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
    maxRange: {
      type: Number,
      default: 8
    },
    isActive: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      isLoading: false,
      info: {
        leases: [1, this.maxRange],
        hasToken: false,
        projectName: '',
        projectType: '',
        url: '',
        tokenName: '',
        maxSupply: 0,
        maxRewards: 0,
        scorePerToken: 1
      }
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
    ...mapActions(["applyProject"]),
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
    async apply() {
      console.log(this.info.projectName, this.info.projectType, this.info.hasToken, this.info.tokenName)
      if (this.info.projectName === '' || this.info.projectType === '' || (this.info.hasToken && this.info.tokenName === '')) {
        this.$buefy.toast.open({
          duration: 2000,
          message: 'Fill the missing inputs.',
          type: 'is-warning'
        })
        return;
      }
      const pledge = new BigNumber('1000').times(new BigNumber('10').pow(this.celltoken.decimals))
      if (pledge.lt(this.celltoken.userBalance)) {
        this.$buefy.toast.open({
          duration: 2000,
          message: 'Insufficient Funds. User must have at least 1000$CELL.',
          type: 'is-warning'
        })
        return;
      }
      try {
        this.isLoading = true;
        await this.applyProject({
          info: { ...this.info, projectType: this.info.projectType == '0'?true:false},
          isActive: this.isActive
        })
        this.$buefy.toast.open({
          duration: 5000,
          message: "Successfully applied! Wait to be approved.",
          type: "is-success"
        });
      } catch (err) {
        console.log(err)
        this.$buefy.toast.open({
          duration: 5000,
          message: "Something Went Wrong!",
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
