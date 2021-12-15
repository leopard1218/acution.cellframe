<template>
  <div class="app-header">
    <nuxt-link class="logo" to="/">
      <img src="/cellframe-logo.svg" alt="">
    </nuxt-link>
    <template v-if="isConnected && !initLoading && activeNetwork && celltoken">
      <div class="app-header__details">
        <div class="coin-balance">
          <template>
            <div class="coin-balance__amount">{{ userBalanceFormatted(celltoken) }} $CELL</div>
          </template>
        </div>
        <b-taglist class="wallet-block" attached>
          <b-tag size="is-medium" type="is-success">Connected</b-tag>
          <b-tag size="is-medium" class="bg-cell-gray">{{ start_and_end(web3.address) }}</b-tag>
        </b-taglist>
      </div>
    </template>
    <div class="buttons">
      <b-button
        v-if="!isConnected"
        :loading="initLoading"
        class="button btn-sm bg-maroon"
        @click="init"
      >
        Connect Wallet
      </b-button>
      <b-button
        v-if="isConnected && initLoading"
        :loading="initLoading"
        class="button btn-sm bg-maroon"
      >
        Connect Wallet
      </b-button>
      <button
        v-else-if="isConnected"
        class="button btn-sm bg-maroon"
        @click="disconnect"
      >
        Disconnect Wallet
      </button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapGetters } = createNamespacedHelpers('cell')
import BigNumber from "bignumber.js";

export default {
  name: "AppHeader",
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      'isConnected',
      'initLoading',
      'activeNetwork',
      'web3',
      'celltoken'
    ])
  },
  mounted() {
    setInterval(() => {
      this.updateData()
    }, 10000)
  },
  watch: {
    isConnected(val, oldVal) {
      if (val && !this.activeNetwork) {
      this.$buefy.snackbar.open({
        message: 'You are on wrong network. Please switch your network.',
        type: 'is-warning',
        position: 'is-top',
        actionText: 'Switch',
        indefinite: true,
        onAction: async () => {
          await this.web3.provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: "0x1" }]
          })
        }
      })
    }
    }

  },
  methods: {
    ...mapActions([
      'init',
      'disconnect',
      'getCellInfo'
    ]),
    updateData() {
      if (this.isConnected) {
        console.log('updatecellfino')
        this.getCellInfo()
      }
    },
    userBalanceFormatted(tokenInfo) {
      return new BigNumber(tokenInfo.userBalance)
        .div(new BigNumber(10).pow(tokenInfo.decimals))
        .toFormat(2);
    },
    intToString(num) {
      return `${(num / si[i].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].s}`;
    },
    start_and_end(str) {
      return str.substr(0, 5) + '...' + str.substr(str.length-3, str.length);
    }
  }
};
</script>

<style lang="sass" scoped>
@import "/assets/utilities/_component-variables.sass"

.app-header
  .logo
    @include size(auto, 100%)
    @include flexbox(row, center, flex-start)
    img
      height: 30px
    +mobile
      height: 38px
      img
        height: 24px
</style>
