<template>
  <div>
    <app-header />
    <section class="app-content">
      <div class="flex-container">
        <Nuxt />
        <div class="rules">
          <h2>RULES</h2>
          <ol>
            <li>
              <p>The end of the auction is signaled by the expiration of a candle flame, which was intended to ensure that no one could know exactly when the auction would end and make the last bid.</p>
            </li>
            <li>
              <p>Anyone can register their project to participate in our Cellslot auction. Required are project name, briefing, website, and 1000 CELL tokens deposit (returns after win or loss in an auction).</p>
            </li>
            <li>
              <p>CellSlots have a range between 1 and 8. Each range point equals to 3 month.</p>
              <p>For example, if Alice bids 100 CELL on range 1-3, it gives 300 scores, Bob bids 200 CELL on range 1-1, and it gives him 200 scores. Joe bids 50 CELL on 1-8 range, and it gives 400 scores, so Joe won.</p>
            </li>
            <li>
              <p>A project could be crowdloan or private. In the case of crowdloan, everybody can bid on it, receiving project tokens (usually governance, but that’s up to the project’s owner) for locking their CELL tokens in. If it is a private bid, only the owner can bid.</p>
            </li>
            <li>
              <p>Winner gets CellSlot NFT with a unique number. Its number can then be used to connect CellChain to the Cellframe Backbone or resell it. If this is the case and the new owner wants to use it to include their project on the backbone, they must pass the review of the Cellframe team or the Cellframe Governance.</p>
            </li>
            <li>
              <p>To get a slot for two years, the participant must collect at least 250.000 CELL.</p>
              <p>Minimal is 3 month period (31.250 CELL).</p>
              <p>All this time, CELL will be locked.</p>
            </li>
          </ol>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import AppHeader from '~/components/AppHeader.vue'
export default {
  name: 'CellAuction',
  components: {
    AppHeader
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
@import "/assets/utilities/_component-variables.sass"

.app-content
  .flex-container
    @include flexbox(column, center, center)
    margin: auto
    .rules
      width: 100%
      max-width: 900px
      h2
        text-align: center
        margin: 0 0 16px
        color: #a4a3c0
      ol
        width: 100%
        max-width: 680px
        margin: 0 auto
        li
          counter-increment: index
          display: flex
          flex-direction: column
          margin: 0 0 8px
          &:before
            content: counters(index, ".", decimal-leading-zero)
            position: absolute
            font-size: 24px
            line-height: initial
            font-weight: bold
            color: #a4a3c0
          p
            margin: 0 0 8px
            padding: 0 0 0 40px

</style>
