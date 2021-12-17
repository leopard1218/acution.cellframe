export default {
  isConnected(state) {
    return state.web3.isConnected;
  },

  initLoading(state) {
    return state.initLoading
  },

  activeNetwork(state) {
    return state.eth.networks.find((n) => n.chain_id === state.web3.chainId);
  },

  web3(state) {
    return state.web3
  },

  celltoken(state) {
    return state.cellTokenInfo
  },

  activeAuction(state) {
    const totalScore = state.activeParticipants.reduce((totalValue, cur) => totalValue + parseInt(cur.totalValue), 0)
    return { ...state.activeAuction, totalScore }
  },

  activeParticipants(state) {
    const myAddr = state.web3.address
    const activeParticipants = state.activeParticipants
    if (activeParticipants.some(party => party.owner == myAddr)) {
      return activeParticipants
    }
    const activeApplicants = state.activeApplicants
    const application = activeApplicants.find(app => app.applicant == myAddr)
    if (application != undefined) {
      return [{
        last_score: 0,
        bidder: '',
        project_name: application.project_name,
        isCrowdloan: application.project_type,
        st_rng: parseInt(application.range/100),
        end_rng: parseInt(application.range%100),
        totalValue: 0,
        owner: myAddr,
        state: application.state
      }, 
      ...activeParticipants]
    }
    return state.activeParticipants
  },

  activeApplicants(state) {
    return state.activeApplicants
  },

  passedAuctions(state) {
    return state.passedAuctions
  },

  winners(state) {
    return state.winners
  },

  futureAuction(state) {
    return state.futureAuction
  },

  futureApplicants(state) {
    return state.futureApplicants
  },

  futureParticipants(state) {
    const myAddr = state.web3.address
    const futureParticipants = state.futureParticipants
    if (futureParticipants.some(party => party.owner == myAddr)) {
      return futureParticipants
    }
    const futureApplicants = state.futureApplicants
    const application = futureApplicants.find(app => app.applicant == myAddr)
    if (application != undefined) {
      return [{
        last_score: 0,
        bidder: '',
        project_name: application.project_name,
        isCrowdloan: application.project_type,
        st_rng: parseInt(application.range/100),
        end_rng: parseInt(application.range%100),
        totalValue: 0,
        owner: myAddr,
        state: application.state
      }, 
      ...futureParticipants]
    }
    return state.futureParticipants
  }
}
