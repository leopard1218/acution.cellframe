<template>
  <div class="cell-auction">
    <b-tabs :multiline="true" :expanded="true" v-model="tabIndex">
      <b-tab-item label="ACTIVE" value="active">
        <template v-if="activeAuction.maxRange != 0">
          <div class="auction-info">
            <div class="auction-status">
              <div>
                <div>Range</div>
                <div>{{activeAuction.maxRange}}</div>
              </div>
              <div>
                <div>TotalScore</div>
                <div>{{scoreFormatted(activeAuction.totalScore)}}</div>
              </div>
              <div>
                <div>Status</div>
                <div>{{auctionStatus}}</div>
              </div>
            </div>
            <div class="auction-apply">
              <b-button v-if="isConnected && !hasAppliedActive" type="is-primary" class="button btn-sm bg-maroon" @click="applyActive">APPLY</b-button>
            </div>
          </div>
          <b-table :bordered="true" :data="activeParticipants"
            ref="table"
            detailed
            detail-key="project_name"
            detail-transition="fade"
            :show-detail-icon="false"
            >
            <b-table-column field="lastscore" label="Last Score" v-slot="props">
              {{scoreFormatted(props.row.last_score)}}
            </b-table-column>
            <b-table-column field="bidder" label="Bidder" v-slot="props">
              {{start_and_end(props.row.bidder)}}
            </b-table-column>
            <b-table-column field="name" label="Project Name" v-slot="props">
              <a @click="props.toggleDetails(props.row)">
                {{props.row.project_name}}
              </a>
            </b-table-column>
            <b-table-column field="type" label="Crowdloan" v-slot="props">
              {{props.row.isCrowdloan ? 'YES' : 'NO'}}
            </b-table-column>
            <b-table-column field="leases" label="Leases" v-slot="props">
              {{props.row.st_rng}}-{{props.row.end_rng}}
            </b-table-column>
            <b-table-column field="totalValue" label="Score" v-slot="props">
              {{scoreFormatted(props.row.totalValue)}}
            </b-table-column>
            <b-table-column label="Action" v-slot="props" v-if="isConnected && activeAuction.auctionState >= '2'">
              <div class="buttons">
                <b-button v-if="(props.row.owner != web3.address) && props.row.isCrowdloan == true" size="is-small" @click="bidToProject(props.row)">+BID</b-button>
                <b-button v-if="props.row.owner == web3.address && props.row.state == undefined" size="is-small" type="is-success" @click="bidToProject(props.row)">+BID</b-button>
                <b-tag v-if="props.row.state == 0" type="is-primary">Pending</b-tag>
                <b-tag v-if="props.row.state == 2" type="is-warning">Declined</b-tag>
                <b-tag v-if="props.row.state == 3" type="is-danger">Blocked</b-tag>
              </div>
            </b-table-column>

            <template #detail="props">
              <article class="media">
                <figure class="media-left">
                  <p class="image is-64x64">
                    <!-- <img src="/static/img/placeholder-128x128.png"> -->
                  </p>
                </figure>
                <div class="media-content">
                  <div class="content">
                    <strong>{{ props.row.project_name }}</strong> @ <small>{{ props.row.owner }}</small>
                    <template v-if="props.row.token_name">
                      <div>Token Name: <strong>{{ props.row.token_name }}</strong> </div>
                      <div>MAX Supply: <strong>{{ props.row.totalSupply }}</strong> 
                          <span style="padding-left: 10px">Score Per Token: <strong>{{ props.row.mag }}</strong></span> </div>
                    </template>
                    <div>URL: <a :href="props.row.uri" target="_blank">{{ props.row.uri }}</a></div>
                  </div>
                </div>
              </article>
            </template>
          </b-table>
        </template>
        <template v-else>
          No Auction
        </template>
      </b-tab-item>
      <b-tab-item label="LATEST" value="latest">
        <template v-for="(auction, aindex) in passedAuctions">
          <b-table :bordered="true" :data="auction" :key="aindex">
            <b-table-column field="name" label="Project Name" v-slot="props">
              {{props.row.project_name}}
            </b-table-column>
            <b-table-column field="type" label="Crowdloan" v-slot="props">
              {{props.row.isCrowdloan ? 'YES' : 'NO'}}
            </b-table-column>
            <b-table-column field="leases" label="Leases" v-slot="props">
              {{props.row.st_rng}}-{{props.row.end_rng}}
            </b-table-column>
            <b-table-column field="totalValue" label="Score" v-slot="props">
              {{scoreFormatted(props.row.totalValue)}}
            </b-table-column>
            <b-table-column label="Owner" v-slot="props">
              {{start_and_end(props.row.owner)}}
            </b-table-column>
          </b-table>
        </template>
      </b-tab-item>
      <b-tab-item label="FUTURE" value="future">
        <template v-if="futureAuction.maxRange != 0">
          <div class="auction-info">
            <div class="auction-status">
              <div>
                <div>Range</div>
                <div>{{futureAuction.maxRange}}</div>
              </div>
            </div>
            <div>
              <b-button v-if="isConnected && !hasAppliedFuture" type="is-primary" class="button btn-sm bg-maroon" @click="applyFuture">APPLY</b-button>
            </div>
          </div>
          <b-table :bordered="true" :data="futureParticipants">
            <b-table-column field="name" label="Project Name" v-slot="props">
              {{props.row.project_name}}
            </b-table-column>
            <b-table-column field="type" label="Crowdloan" v-slot="props">
              {{props.row.isCrowdloan ? 'YES' : 'NO'}}
            </b-table-column>
            <b-table-column field="leases" label="Leases" v-slot="props">
              {{props.row.st_rng}}-{{props.row.end_rng}}
            </b-table-column>
            <b-table-column field="owner" label="Owner" v-slot="props">
              {{start_and_end(props.row.owner)}}
            </b-table-column>
            <b-table-column label="state" v-slot="props">
              <b-tag v-if="props.row.state == 0" type="is-primary">Pending</b-tag>
              <b-tag v-if="props.row.state == 2" type="is-warning">Declined</b-tag>
              <b-tag v-if="props.row.state == 3" type="is-danger">Blocked</b-tag>
              <b-tag v-else type="is-success">Approved</b-tag>
            </b-table-column>
          </b-table>
        </template>
        <template v-else>
          No Auction
        </template>
      </b-tab-item>
      <b-tab-item label="WINNERS" value="winners">
        <b-table :bordered="true" :data="winners">
          <b-table-column field="name" label="Project Name" v-slot="props">
            {{props.row.project_name}}
          </b-table-column>
          <b-table-column field="type" label="Crowdloan" v-slot="props">
            {{props.row.isCrowdloan ? 'YES' : 'NO'}}
          </b-table-column>
          <b-table-column field="leases" label="Leases" v-slot="props">
            {{props.row.st_rng}}-{{props.row.end_rng}}
          </b-table-column>
          <b-table-column field="totalValue" label="Score" v-slot="props">
            {{scoreFormatted(props.row.totalValue)}}
          </b-table-column>
          <b-table-column label="Owner" v-slot="props">
            {{start_and_end(props.row.owner)}}
          </b-table-column>
          </b-table>
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters } = createNamespacedHelpers('cell')
import ApplyModal from '../components/modals/ApplyModal.vue'
import BidModal from '../components/modals/BidModal.vue'
export default {
  data () {
    return {
      isLoading: false,
      tabIndex: 'active'
    }
  },
  computed: {
    ...mapGetters([
      "web3",
      "initLoading",
      "isConnected",
      "activeAuction",
      "activeParticipants",
      "futureAuction",
      "futureParticipants",
      "celltoken",
      "passedAuctions",
      "winners"
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
    },
    hasAppliedActive() {
      return this.activeParticipants.some(party => party.owner == this.web3.address)
    },
    hasAppliedFuture() {
      return this.futureParticipants.some(party => party.owner == this.web3.address)
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (typeof localStorage.getItem("cellLoggedIn") !== 'object' && localStorage.getItem("cellLoggedIn") == 'true') {
        this.init(true)
      } else {
        this.initWithoutWallet()
      }
    })
    setInterval(() => {
      this.updateData()
    }, 10000)
  },
  methods: {
    ...mapActions([
      'init',
      'initWithoutWallet',
      'getCellInfo',
      'getActiveAuctionInfo',
      'getFutureAuctionInfo',
      'getActiveParticipants',
      'getFutureParticipants',
      'getPassedAuctions',
      'getWinners'
      ]),
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
        console.log('updating active')
        this.getActiveAuctionInfo()
        this.getActiveParticipants()
      } else if (this.tabIndex == 'latest') {
        console.log('updating latest')
        this.getPassedAuctions()
      } else if (this.tabIndex == 'future') {
        console.log('updating future')
        this.getFutureAuctionInfo()
        this.getFutureParticipants()
      } else {
        console.log('updating winners')
        this.getWinners()
      }
    },
    async applyActive() {
      try {
        this.isLoading = true
        this.$buefy.modal.open({
          parent: this,
          component: ApplyModal,
          customClass: '',
          trapFocus: true,
          fullScreen: true,
          props: {
            'maxRange': Number(this.activeAuction.maxRange)
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
    async bidToProject(participant) {
      try {
        this.isLoading = true
        // this.$buefy.modal.open({
        //   parent: this,
        //   component: BidModal,
        //   customClass: '',
        //   trapFocus: true,
        //   hasModalCard: true,
        //   props: {
        //     projectName: participant.project_name,
        //     maxRange: Number(participant.end_rng),
        //     minRange: Number(participant.st_rng),
        //     address: participant.address
        //   }
        // })
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },

    async applyFuture() {
      this.isLoading = true
      this.$buefy.modal.open({
        parent: this,
        component: ApplyModal,
        customClass: '',
        trapFocus: true,
        fullScreen: true,
        props: {
          'maxRange': Number(this.futureAuction.maxRange),
          'isActive': '1'
        }
      })
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
@import "/assets/utilities/_component-variables.sass"

.cell-auction
  @include size(100%, auto, 900px)
  @include flexbox(column, flex-start, center)
  margin: 0 auto 32px
  padding: 0
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
