<template>
  <div class="card">
    <div class="modal-card-head">
      <h4>Add Approved Project</h4>
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
        <b-slider :min="1" :max="8" :step="1" v-model="info.leases"></b-slider>
      </b-field>
      <b-field label="Reference URL">
        <b-input v-model="info.url" type="url" />
      </b-field>
      <b-field label="Owner Address">
        <b-input v-model="info.owner" required />
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
      <b-button class="button btn-sm bg-maroon" :loading="isLoading" @click="add">
        ADD
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
    isActive: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isLoading: false,
      info: {
        leases: [1, 8],
        hasToken: false,
        projectName: '',
        projectType: '',
        url: '',
        tokenName: '',
        maxSupply: 0,
        maxRewards: 0,
        scorePerToken: 1,
        owner: ''
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
    ...mapActions(["addApprovedParticipant"]),
    async add() {
      if (this.info.projectName === '' || this.info.projectType === '' || this.info.owner === '' || (this.info.hasToken && this.info.tokenName === '')) {
        this.$buefy.toast.open({
          duration: 2000,
          message: 'Fill the missing inputs.',
          type: 'is-warning'
        })
        return;
      }
      
      try {
        this.isLoading = true;
        await this.addApprovedParticipant({
          info: { ...this.info, projectType: this.info.projectType == '0'?true:false},
          isActive: this.isActive ? 0 : 1
        })
        this.$buefy.toast.open({
          duration: 3000,
          message: "Successfully added!",
          type: "is-success"
        });
      } catch (err) {
        console.log(err)
        this.$buefy.toast.open({
          duration: 3000,
          message: "Failed to add a participant",
          type: "is-danger"
        });
      } finally {
        this.isLoading = false;
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
  margin: $margin * 2 auto $margin / 6
  font-size: 18px
  font-weight: 700
  color: #CE1C58
  +is-block

.copy-button
  width: 15px
  height: auto
  min-width: 15px
  display: block
  margin-right: $margin / 2
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
  margin-top: $margin / 2
</style>
