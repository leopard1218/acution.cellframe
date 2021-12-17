export default {
  SET_INIT_LOADING(state, isLoading) {
    state.initLoading = isLoading;
  },

  SET_CELL_INFO(state, info) {
    const keys = Object.keys(info);
    state.cellTokenInfo = {
      ...state.cellTokenInfo,
      ...keys.reduce((o, key) => ({ ...o, [key]: info[key] }), {}),
    };
  },

  SET_WEB3_IS_CONNECTED(state, isConnected) {
    state.web3.isConnected = isConnected;
  },

  SET_WEB3_CHAIN_ID(state, chainId) {
    state.web3.chainId = chainId;
  },

  SET_WEB3_INSTANCE(state, web3) {
    state.web3.instance = web3;
  },

  SET_WEB3_PROVIDER(state, provider) {
    state.web3.provider = provider;
  },

  SET_WEB3_USER_ADDRESS(state, addy) {
    state.web3.address = addy;
  },

  SET_WEB3_MAIN_BALANCE(state, balance) {
    state.web3.mainCurrencyBalance = balance;
  },

  SET_ACTIVE_AUCTION(state, auctionInfo) {
    state.activeAuction = auctionInfo
  },

  SET_ACTIVE_PARTIES(state, parties) {
    state.activeParticipants = parties
  },

  SET_ACTIVE_APPLICANTS(state, applicants) {
    state.activeApplicants = applicants
  },

  SET_WINNERS(state, winners) {
    state.winners = winners
  },

  SET_PASSED_AUCTIONS(state, passedAuctions) {
    state.passedAuctions = passedAuctions
  },

  SET_FUTURE_AUCTION(state, auctionInfo) {
    state.futureAuction = auctionInfo
  },
  
  SET_FUTURE_APPLICANTS(state, applicants) {
    state.futureApplicants = applicants
  },
  
  SET_FUTURE_PARTIES(state, parties) {
    state.futureParticipants = parties
  },
}
