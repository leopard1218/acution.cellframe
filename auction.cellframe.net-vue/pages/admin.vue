<template>
  <div class="cell-auction">
    <b-tabs :multiline="true" :expanded="true" v-model="tabIndex">
      <b-tab-item label="ACTIVE" value="active">
        <template>
          <div class="auction-info">
            <div class="auction-status">
              <div>
                <div>Range</div>
                <div>{{activeAuction.maxRange}}</div>
              </div>
              <div>
                <div>Status</div>
                <div>{{auctionStatus}}</div>
              </div>
            </div>
            <div>
              <b-button v-if="activeAuction.auctionState == '0'" type="is-success" @click="createActive">CREATE</b-button>
              <b-button v-if="activeAuction.auctionState == '1'" type="is-success" @click="start">START</b-button>
              <b-button v-if="activeAuction.auctionState == '2'" type="is-success" @click="finish">FINISH</b-button>
              <b-button v-if="activeAuction.auctionState == '3'" type="is-success" @click="selectWinner">SELECT WINNER</b-button>
              <b-button v-if="activeAuction.auctionState == '2' || activeAuction.auctionState == '1'" type="is-primary" class="button btn-sm bg-maroon" @click="addParticipant(true)">ADD</b-button>
            </div>
          </div>
          <b-table :bordered="true" :data="activeApplicants">
            <b-table-column field="name" label="Project Name" v-slot="props">
              {{props.row.project_name}}
            </b-table-column>
            <b-table-column field="type" label="Crowdloan" v-slot="props">
              {{props.row.project_type ? 'YES' : 'NO'}}
            </b-table-column>
            <b-table-column field="leases" label="Leases" v-slot="props">
              {{parseInt(props.row.range/100)}}-{{props.row.range%100}}
            </b-table-column>
            <b-table-column field="owner" label="Owner" v-slot="props">
              {{start_and_end(props.row.applicant)}}
            </b-table-column>
            <b-table-column label="Status" v-slot="props">
              <b-tag v-if="props.row.state == 0" type="is-primary">Pending</b-tag>
              <b-tag v-if="props.row.state == 1" type="is-success">Approved</b-tag>
              <b-tag v-if="props.row.state == 2" type="is-warning">Declined</b-tag>
              <b-tag v-if="props.row.state == 3" type="is-danger">Blocked</b-tag>
            </b-table-column>
            <b-table-column label="Action" v-slot="props">
              <b-button v-if="props.row.state == 1" size="is-small" @click="blockConfirm(0, props.row)">Block</b-button>
              <template v-if="props.row.state == 0">
                <b-button size="is-small" type="is-primary" @click="approveConfirm(0, props.row)">APPROVE</b-button>
                <b-button size="is-small" type="is-warning" @click="declineConfirm(0, props.row)">DECLINE</b-button>
              </template>
            </b-table-column>
          </b-table>
        </template>
      </b-tab-item>
      <b-tab-item label="FUTURE" value="future">
        <template>
          <div class="auction-info">
            <div class="auction-status">
              <div>
                <div>Range</div>
                <div>{{futureAuction.maxRange}}</div>
              </div>
              <div>
                <div>MinimalCostPrice</div>
                <div>{{futureAuction.minimalCellSlotPrice}}</div>
              </div>
            </div>
            <div>
              <b-button v-if="futureAuction.auctionState == '0'" type="is-success" @click="createFuture">CREATE</b-button>
              <b-button v-if="futureAuction.auctionState == '1'" type="is-primary" class="button btn-sm bg-maroon" @click="addParticipant(false)">ADD</b-button>
            </div>
          </div>
          <b-table :bordered="true" :data="futureApplicants">
            <b-table-column field="name" label="Project Name" v-slot="props">
              {{props.row.project_name}}
            </b-table-column>
            <b-table-column field="type" label="Crowdloan" v-slot="props">
              {{props.row.project_type ? 'YES' : 'NO'}}
            </b-table-column>
            <b-table-column field="leases" label="Leases" v-slot="props">
              {{parseInt(props.row.range/100)}}-{{props.row.range%100}}
            </b-table-column>
            <b-table-column field="owner" label="Owner" v-slot="props">
              {{start_and_end(props.row.applicant)}}
            </b-table-column>
            <b-table-column label="Status" v-slot="props">
              <b-tag v-if="props.row.state == 0" type="is-primary">Pending</b-tag>
              <b-tag v-if="props.row.state == 1" type="is-success">Approved</b-tag>
              <b-tag v-if="props.row.state == 2" type="is-warning">Declined</b-tag>
              <b-tag v-if="props.row.state == 3" type="is-danger">Blocked</b-tag>
            </b-table-column>
            <b-table-column label="Action" v-slot="props">
              <b-button v-if="props.row.state == 1" size="is-small" @click="blockConfirm(1, props.row)">Block</b-button>
              <template v-if="props.row.state == 0">
                <b-button size="is-small" type="is-primary" @click="approveConfirm(1, props.row)">APPROVE</b-button>
                <b-button size="is-small" type="is-warning" @click="declineConfirm(1, props.row)">DECLINE</b-button>
              </template>
            </b-table-column>
          </b-table>
        </template>
      </b-tab-item>
    </b-tabs>

    <b-modal
      v-model="isBlockModalActive"
      :has-modal-card="true"
    >
      <div class="card">
        <div class="card-content">
         <div>Return Fund?</div>
          <b-button size="is-small" type="is-success" @click="block(isActive, currentApp.applicant, true)">YES</b-button>
          <b-button size="is-small" type="is-info" @click="block(isActive, currentApp.applicant, false)">NO</b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
//TODO: Restrict users. Only owner can access this page.
import BigNumber from 'bignumber.js'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('cell')
import AddModal from '../components/modals/AddModal.vue'
import CreateAuctionModal from '../components/modals/CreateAuctionModal.vue'
export default {
  data () {
    return {
      isLoading: false,
      isBlockModalActive: false,
      isActive: 0,
      currentApp: {},
      tabIndex: 'active'
    }
  },
  computed: {
    ...mapGetters([
      "initLoading",
      "activeAuction",
      "activeApplicants",
      "futureAuction",
      "futureApplicants"
    ]),
    auctionStatus() {
      switch(this.activeAuction.auctionState) {
        case '1':
          return 'PENDING...'
        case '2':
          return 'ON AUCTION'
        case '3':
          return 'FINISHED VOTING'
        default:
          return 'NO AUCTION'
      }
    }
  },

  mounted () {
    this.$nextTick(() => {
      if (typeof localStorage.getItem("cellLoggedIn") !== 'object' && localStorage.getItem("cellLoggedIn") == 'true') {
        this.init(true)
      }
    })

    setInterval(() => {
      this.updateData()
    }, 10000)
  },
  methods: {
    ...mapActions(['init', 'approveProject', 'declineProject', 'blockProject', 'startAuction', 'finishAuction',
                    'selectWinnerAuction',
      'getActiveAuctionInfo',
      'getFutureAuctionInfo']),
    start_and_end(str) {
      return str.substr(0, 6) + '...' + str.substr(str.length-4, str.length)
    },
    scoreFormatted(score) {
      return new BigNumber(score)
        .div(new BigNumber(10).pow(this.celltoken.decimals))
        .toFormat()
    },
    updateData() {
      if (this.tabIndex == 'active') {
        console.log('updating admin active')
        this.getActiveAuctionInfo()
      } else if (this.tabIndex == 'future') {
        console.log('updating admin future')
        this.getFutureAuctionInfo()
      }
    },
    async addParticipant(isActive) {
      try {
        this.isLoading = true
        this.$buefy.modal.open({
          parent: this,
          component: AddModal,
          customClass: '',
          trapFocus: true,
          fullScreen: true,
          props: {
            'maxRange': Number(this.activeAuction.maxRange),
            'isActive': isActive
          }
        })
      } catch (error) {
        this.$buefy.toast.open({
          duration: 3000,
          message: "Error occured!",
          type: "is-danger"
        });
        console.log(error);
      } finally {
        this.isLoading = false
      }
    },

    approveConfirm(isActive, app) {
      this.$buefy.dialog.confirm({
        message: `<span style="color: black">Approve ${app.project_name}?</span>`,
        title: 'Approve',
        onConfirm: () => this.approve(isActive, app)
      })
    },

    declineConfirm(isActive, app) {
      this.$buefy.dialog.confirm({
        message:  `<span style="color: black">Decline ${app.project_name}?</span>`,
        title: 'Decline',
        type: 'is-warning',
        onConfirm: () => this.decline(isActive, app)
      })
    },

    blockConfirm(isActive, app) {
      this.$buefy.dialog.confirm({
        message:  `<span style="color: black">Block ${app.project_name}?</span>`,
        title: 'Block',
        type: 'is-danger',
        onConfirm: () => {this.isBlockModalActive = true, this.currentApp = app, this.isActive = isActive}
      })
    },

    async approve(isActive, applicant) {
      try {
        this.isLoading = true
        await this.approveProject({isActive, applicant: applicant.applicant})
        this.$buefy.toast.open({
          duration: 2000,
          message: "Approved successfully",
          type: "is-success"
        });
      } catch (error) {
        console.log(error)
        this.$buefy.toast.open({
          duration: 2000,
          message: "Approve failed",
          type: "is-danger"
        });
      } finally {
        this.isLoading = false
      }
    },

    async decline(isActive, applicant) {
      try {
        this.isLoading = true
        await this.declineProject({isActive, applicant: applicant.applicant})
        this.$buefy.toast.open({
          duration: 2000,
          message: "Declined successfully",
          type: "is-success"
        });
      } catch (error) {
        console.log(error)
        this.$buefy.toast.open({
          duration: 2000,
          message: "Decline failed",
          type: "is-danger"
        });
      } finally {
        this.isLoading = false
      }
    },

    async block(isActive, applicant, returnFund) {
      try {
        this.isLoading = true
        await this.blockProject({isActive, applicant, returnFund})
        this.$buefy.toast.open({
          duration: 2000,
          message: "Blocked successfully",
          type: "is-success"
        });
      } catch (error) {
        console.log(error)
        this.$buefy.toast.open({
          duration: 2000,
          message: "Block failed",
          type: "is-danger"
        });
      } finally {
        this.isLoading = false
      }
    },

    async createActive() {
      this.$buefy.modal.open({
        parent: this,
        component: CreateAuctionModal,
        customClass: '',
        trapFocus: true,
        hasModalCard: true,
        props: {
          isActive: true
        }
      })
    },

    async start() {
      try {
        this.isLoading = true
        await this.startAuction()
        this.$buefy.toast.open({
          duration: 2000,
          message: "Start Auction Successed",
          type: "is-success"
        })
      } catch (error) {
        console.log(error)
        this.$buefy.toast.open({
          duration: 2000,
          message: "Start Auction Failed",
          type: "is-danger"
        })
      } finally {
        this.isLoading = false
      }
    },

    async finish() {
      try {
        this.isLoading = true
        await this.finishAuction()
        this.$buefy.toast.open({
          duration: 2000,
          message: "Finish Auction Successed",
          type: "is-success"
        })
      } catch (error) {
        console.log(error)
        this.$buefy.toast.open({
          duration: 2000,
          message: "Finish Auction Failed",
          type: "is-danger"
        })
      } finally {
        this.isLoading = false
      }
    },

    async selectWinner() {
      try {
        this.isLoading = true
        await this.selectWinnerAuction()
        this.$buefy.toast.open({
          duration: 2000,
          message: "SelectWinner Successed",
          type: "is-success"
        })
      } catch (error) {
        console.log(error)
        this.$buefy.toast.open({
          duration: 2000,
          message: "Start Auction Failed",
          type: "is-danger"
        })
      } finally {
        this.isLoading = false
      }
    },

    async createFuture() {
      this.$buefy.modal.open({
        parent: this,
        component: CreateAuctionModal,
        customClass: '',
        trapFocus: true,
        hasModalCard: true,
        props: {
          isActive: false
        }
      })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
@import "/assets/utilities/_component-variables.sass"

.cell-auction
  padding: 0
  @include size(100%, auto, 900px)
  @include flexbox(column, flex-start, center)

  border-radius: 3px
  box-shadow: 0 1em 2em -.9em rgba(0,0,0,.7)
  overflow: hidden
  +mobile

  .auction-info
    @include flexbox(row, center, space-between)
    padding: 0.5em 0.75em
    background-color: rgba(255, 255, 255, 0.05)
    border-radius: 4px
    +mobile
      @include flexbox(column, center, space-between)
      width: 100%
      max-width: 500px
      margin-left: auto
      margin-right: auto
      button
        width: 100%
    .auction-status
      @include flexbox(row, flex-start)
      width: 100%
      max-width: 500px
      gap: 32px
      +mobile
        @include flexbox(row, flex-start, space-between)
        margin-bottom: 8px
        gap: 16px
    .auction-apply
      +mobile
        width: 100%
</style>
