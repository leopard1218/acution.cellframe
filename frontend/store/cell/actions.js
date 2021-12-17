import BigNumber from "bignumber.js";
import Web3 from 'web3';
import sleep from '../../factories/Sleep'
import ExponentialBackoff from "../../factories/ExponentialBackoff";
import ERC20 from "../../factories/web3/ERC20";
import Primary from "../../factories/web3/Primary";
import Participant from "~/factories/web3/Participant";
import Web3Modal from "../../factories/web3/Web3Modal";

export default {
  async initWithoutWallet({commit, dispatch, getters, state}) {
    const provider = new Web3.providers.HttpProvider(
      // 'https://mainnet.infura.io/v3/012cc46832a547b1a4f4de071596f544'
      'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
    )
    commit("SET_WEB3_PROVIDER", provider);
    const web3 = new Web3(provider)
    commit("SET_WEB3_INSTANCE", web3);
    commit("SET_WEB3_CHAIN_ID", 1);
    dispatch('loadAuctioData');
  },
  async init({commit, dispatch, getters, state}, reset = false) {
    try {
      if (state.web3 && state.web3.isConnected && !reset) return;
      commit("SET_INIT_LOADING", true);
      const { provider, web3 } = await Web3Modal.connect();
      commit("SET_WEB3_PROVIDER", provider);
      commit("SET_WEB3_INSTANCE", web3);
      const resetConnection = async () => {
        dispatch("disconnect");
        await dispatch("init", true);
        localStorage.cellLoggedIn = true
        localStorage.WEB3_CONNECT_CACHED_PROVIDER = '"injected"'
      };
      Web3Modal.bindProviderEvents({
        accountsChanged: resetConnection,
        chainChanged: resetConnection,
        disconnect: () => dispatch("disconnect"),
      });
      commit("SET_WEB3_CHAIN_ID", await web3.eth.getChainId());
      commit("SET_WEB3_IS_CONNECTED", true);
      const [accountAddy] = await web3.eth.getAccounts();
      commit("SET_WEB3_USER_ADDRESS", accountAddy);
      dispatch('getCellInfo');
      dispatch('loadAuctioData');
    } catch(err) {
      console.log(err)
    } finally {
      commit("SET_INIT_LOADING", false)
      localStorage.cellLoggedIn = true
    }
  },

  disconnect({ commit }) {
    commit("SET_WEB3_PROVIDER", null);
    commit("SET_WEB3_INSTANCE", null);
    commit("SET_WEB3_IS_CONNECTED", false);
    commit("SET_WEB3_CHAIN_ID", null);
    commit("SET_WEB3_USER_ADDRESS", "");

    // Clear cached provider to be able to switch between providers when disconnecting wallet
    Web3Modal.clearCachedProvider();
    localStorage.removeItem("cellLoggedIn")
  },

  async loadAuctioData({ dispatch }) {
    dispatch('getActiveAuctionInfo')
    dispatch('getFutureAuctionInfo')
    dispatch('getActiveParticipants')
    dispatch('getFutureParticipants')
    dispatch('getPassedAuctions')
    dispatch('getWinners')
  },

  async getErc20TokenInfo({ state }, tokenAddy) {
    const userAddy = state.web3.address;
    const contract = ERC20(state.web3.instance, tokenAddy);
    const [name, symbol, decimals, userBalance] = await Promise.all([
      contract.methods.name().call(),
      contract.methods.symbol().call(),
      contract.methods.decimals().call(),
      contract.methods.balanceOf(userAddy).call(),
    ]);
    return {
      address: tokenAddy,
      name,
      symbol,
      decimals,
      userBalance,
    };
  },
  
  async genericErc20Approval(
    { state },
    { spendAmount, tokenAddress, delegateAddress, unlimited }
  ) {
    if (new BigNumber(spendAmount || 0).lte(0)) return;

    unlimited = unlimited === true ? true : false;
    const userAddy = state.web3.address;
    const contract = ERC20(state.web3.instance, tokenAddress);
    const [userBalance, currentAllowance] = await ExponentialBackoff(
      async () => {
        return await Promise.all([
          contract.methods.balanceOf(userAddy).call(),
          contract.methods.allowance(userAddy, delegateAddress).call(),
        ]);
      }
    );
    if (new BigNumber(currentAllowance).lte(spendAmount || 0)) {
      await contract.methods
        .approve(
          delegateAddress,
          unlimited ? new BigNumber(2).pow(256).minus(1).toFixed() : userBalance
        )
        .send({ from: userAddy });
    }
  },

  async getCellInfo ({ commit, dispatch, getters, state }) {
    const activeNetwork = getters.activeNetwork;

    if (!activeNetwork) {
      await sleep(500);
      return await dispatch("getCellInfo");
    }

    const tokenAddr = activeNetwork.contracts.celltoken;
    const tokenInfo = await dispatch('getErc20TokenInfo', tokenAddr);
    commit('SET_CELL_INFO', tokenInfo);
  },

  async getFutureAuctionInfo({ commit, dispatch, getters, state }) {
    const activeNetwork = getters.activeNetwork;
    const web3 = state.web3.instance;

    if (!activeNetwork) {
      await sleep(500);
      return await dispatch("getFutureAuctionInfo");
    }

    const tokenAddr = activeNetwork.contracts.primary;
    const PrimaryContract = Primary(web3, tokenAddr);
    const futureAuctioin = await PrimaryContract.methods.getFutureAuction().call()
    commit('SET_FUTURE_AUCTION', futureAuctioin)
    const applications = await Promise.all(
      futureAuctioin.applicants.map(app => {
        return PrimaryContract.methods.getApplication(1, app).call()
      })
    )
    const res = applications.map((app, index) => ({ ...app, applicant: futureAuctioin.applicants[index]}))
    commit('SET_FUTURE_APPLICANTS', res)
  },

  async getActiveAuctionInfo({ commit, dispatch, getters, state }) {
    const activeNetwork = getters.activeNetwork;
    const web3 = state.web3.instance;

    if (!activeNetwork) {
      await sleep(500);
      return await dispatch("getActiveAuctionInfo");
    }

    const tokenAddr = activeNetwork.contracts.primary;
    const PrimaryContract = Primary(web3, tokenAddr);
    const activeAuction = await PrimaryContract.methods.getActiveAuction().call()
    commit('SET_ACTIVE_AUCTION', activeAuction)
    const applications = await Promise.all(
      activeAuction.applicants.map(app => {
        return PrimaryContract.methods.getApplication(0, app).call()
      })
    )
    const res = applications.map((app, index) => ({ ...app, applicant: activeAuction.applicants[index]}))
    commit('SET_ACTIVE_APPLICANTS', res)
  },

  async getActiveParticipants({ commit, dispatch, getters, state }) {
    const activeNetwork = getters.activeNetwork;
    const web3 = state.web3.instance;

    if (!activeNetwork) {
      await sleep(500);
      return await dispatch("getActiveParticipants");
    }

    const tokenAddr = activeNetwork.contracts.primary;
    const PrimaryContract = Primary(web3, tokenAddr);
    const addrs = await PrimaryContract.methods.getDeployedPartipants(0).call();
    const participants = await Promise.all(
      addrs.map(addr => {
      const ParticipantContract = Participant(web3, addr)
      return ParticipantContract.methods.getParticipantInfo().call()
    }))
    const res = participants.map((parti, index) => ({ ...parti, address: addrs[index]}))
    commit('SET_ACTIVE_PARTIES', res)
  },

  async getActiveApplicants({ commit, dispatch, getters, state }) {
    const activeNetwork = getters.activeNetwork;
    const web3 = state.web3.instance;

    if (!activeNetwork) {
      await sleep(500);
      return await dispatch("getActiveApplicants");
    }

    const tokenAddr = activeNetwork.contracts.primary;
    const PrimaryContract = Primary(web3, tokenAddr);
    const addrs = await PrimaryContract.methods.getDeployedPartipants(0).call();
    const participants = await Promise.all(
      addrs.map(addr => {
      const ParticipantContract = Participant(web3, addr)
      return ParticipantContract.methods.getParticipantInfo().call()
    }))
    const res = participants.map((parti, index) => ({ ...parti, address: addrs[index]}))
    commit('SET_ACTIVE_PARTIES', res)
  },

  async applyProject({ commit, dispatch, getters, state }, {info, isActive}) {
    const activeNetwork = getters.activeNetwork;
    const web3 = state.web3.instance;
    const userAddr = state.web3.address

    if (!activeNetwork) {
      await sleep(500);
      return await dispatch("applyProject");
    }
    
    const amount = new BigNumber('1000')
    .times(
      new BigNumber(10).pow(state.cellTokenInfo.decimals)
    )
    .toFixed()
    
    const PrimaryContract = Primary(web3, activeNetwork.contracts.primary)
    await dispatch('genericErc20Approval', {
      spendAmount: amount,
      tokenAddress: activeNetwork.contracts.celltoken,
      delegateAddress: activeNetwork.contracts.primary
    })
    await PrimaryContract.methods.applyTo(isActive, info.projectName, info.projectType, info.leases[0], info.leases[1], info.url, info.hasToken, info.tokenName, info.maxSupply, info.maxRewards, info.scorePerToken)
                                  .send({ from: userAddr })
    if (isActive == '0')
      await dispatch('getActiveParticipants')
    else 
      await dispatch('getFutureParticipants')
    await dispatch('getCellInfo')
  },

  async bidToProject({ commit, dispatch, getters, state }, {amount, leases, address}) {
    const activeNetwork = getters.activeNetwork;
    const web3 = state.web3.instance;
    const userAddr = state.web3.address

    if (!activeNetwork) {
      await sleep(500);
      return await dispatch("bidToProject");
    }

    const ParticipantContract = Participant(web3, address)
    await dispatch('genericErc20Approval', {
      spendAmount: amount,
      tokenAddress: activeNetwork.contracts.celltoken,
      delegateAddress: address
    })
    await ParticipantContract.methods.vote(leases[0], leases[1], amount)
                                  .send({ from: userAddr })
    dispatch('getActiveParticipants')
    dispatch('getCellInfo')
  },

  async approveProject({ commit, dispatch, getters, state }, {isActive, applicant}) {
    const activeNetwork = getters.activeNetwork;
    const web3 = state.web3.instance;
    const userAddr = state.web3.address

    if (!activeNetwork) {
      await sleep(500);
      return await dispatch("applyProject");
    }

    const PrimaryContract = Primary(web3, activeNetwork.contracts.primary)
    await PrimaryContract.methods.approve(isActive, applicant).send({ from: userAddr })
    
    dispatch("getActiveAuctionInfo");
  },

  async declineProject({ commit, dispatch, getters, state }, {isActive, applicant}) {
    const activeNetwork = getters.activeNetwork;
    const web3 = state.web3.instance;
    const userAddr = state.web3.address

    if (!activeNetwork) {
      await sleep(500);
      return await dispatch("applyProject");
    }
    const PrimaryContract = Primary(web3, activeNetwork.contracts.primary)
    await PrimaryContract.methods.decline(isActive, applicant).send({ from: userAddr })
    
    dispatch("getActiveAuctionInfo");
  },

  async blockProject({ commit, dispatch, getters, state }, {isActive, applicant, returnFund}) {
    const activeNetwork = getters.activeNetwork;
    const web3 = state.web3.instance;
    const userAddr = state.web3.address

    if (!activeNetwork) {
      await sleep(500);
      return await dispatch("applyProject");
    }
    const PrimaryContract = Primary(web3, activeNetwork.contracts.primary)
    await PrimaryContract.methods.blockParticipant(isActive, applicant, returnFund).send({ from: userAddr })
    
    dispatch("getActiveAuctionInfo");
  },

  async createActiveAuction({ commit, dispatch, getters, state }, {maxRange, minimalCellSlotPrice}) {
    const activeNetwork = getters.activeNetwork;
    const web3 = state.web3.instance;
    const userAddr = state.web3.address

    if (!activeNetwork) {
      await sleep(500);
      return await dispatch("createActiveAuction");
    }
    const PrimaryContract = Primary(web3, activeNetwork.contracts.primary)
    await PrimaryContract.methods.createActiveAuction(maxRange, minimalCellSlotPrice).send({ from: userAddr })
    
    dispatch("getActiveAuctionInfo");
    dispatch("getFutureAuctionInfo");
  },

  async createFutureAuction({ commit, dispatch, getters, state }, {maxRange, minimalCellSlotPrice}) {
    const activeNetwork = getters.activeNetwork;
    const web3 = state.web3.instance;
    const userAddr = state.web3.address

    if (!activeNetwork) {
      await sleep(500);
      return await dispatch("createFutureAuction");
    }
    const PrimaryContract = Primary(web3, activeNetwork.contracts.primary)
    await PrimaryContract.methods.createFutureAuction(maxRange, minimalCellSlotPrice).send({ from: userAddr })
    
    dispatch("getFutureAuctionInfo");
  },

  async getFutureParticipants({ commit, dispatch, getters, state }) {
    const activeNetwork = getters.activeNetwork;
    const web3 = state.web3.instance;

    if (!activeNetwork) {
      await sleep(500);
      return await dispatch("getFutureParticipants");
    }

    const tokenAddr = activeNetwork.contracts.primary;
    const PrimaryContract = Primary(web3, tokenAddr);
    const addrs = await PrimaryContract.methods.getDeployedPartipants(1).call();
    const participants = await Promise.all(
      addrs.map(addr => {
      const ParticipantContract = Participant(web3, addr)
      return ParticipantContract.methods.getParticipantInfo().call()
    }))
    const res = participants.map((parti, index) => ({ ...parti, address: addrs[index]}))
    commit('SET_FUTURE_PARTIES', res)
  },

  async startAuction({ commit, dispatch, getters, state }) {
    const activeNetwork = getters.activeNetwork;
    const web3 = state.web3.instance;
    const userAddr = state.web3.address

    if (!activeNetwork) {
      await sleep(500);
      return await dispatch("startAuction");
    }
    const PrimaryContract = Primary(web3, activeNetwork.contracts.primary)
    const now = parseInt(Date.now() / 1000)
    await PrimaryContract.methods.startAuction(now, now + 2 * 24 * 60 * 60).send({ from: userAddr })
    
    dispatch("getActiveAuctionInfo");
  },

  async finishAuction({ commit, dispatch, getters, state }) {
    const activeNetwork = getters.activeNetwork;
    const web3 = state.web3.instance;
    const userAddr = state.web3.address

    if (!activeNetwork) {
      await sleep(500);
      return await dispatch("finishAuction");
    }
    const PrimaryContract = Primary(web3, activeNetwork.contracts.primary)
    const now = parseInt(Date.now() / 1000)
    await PrimaryContract.methods.finishVoting(now).send({ from: userAddr })
    
    dispatch("getActiveAuctionInfo");
  },

  async selectWinnerAuction({ commit, dispatch, getters, state }) {
    const activeNetwork = getters.activeNetwork;
    const web3 = state.web3.instance;
    const userAddr = state.web3.address

    if (!activeNetwork) {
      await sleep(500);
      return await dispatch("selectWinnerAuction");
    }
    const PrimaryContract = Primary(web3, activeNetwork.contracts.primary)
    await PrimaryContract.methods.selectWinner().send({ from: userAddr })
    
    dispatch("getActiveAuctionInfo")
    dispatch('getActiveParticipants')
  },

  async getWinners({ commit, dispatch, getters, state }) {
    const activeNetwork = getters.activeNetwork;
    const web3 = state.web3.instance;

    if (!activeNetwork) {
      await sleep(500);
      return await dispatch("getWinners");
    }
    const PrimaryContract = Primary(web3, activeNetwork.contracts.primary)

    const winnerAddrs = await PrimaryContract.methods.getWinnerParticipants().call()
    const winners = await Promise.all(winnerAddrs.map(addr => {
      const ParticipantContract = Participant(web3, addr)
      return ParticipantContract.methods.getParticipantInfo().call()
    }))
    commit('SET_WINNERS', winners)
  },

  async getPassedAuctions({ commit, dispatch, getters, state }) {
    const activeNetwork = getters.activeNetwork;
    const web3 = state.web3.instance;

    if (!activeNetwork) {
      await sleep(500);
      return await dispatch("getPassedAuctions");
    }
    const PrimaryContract = Primary(web3, activeNetwork.contracts.primary)
    const auctionCnt = await PrimaryContract.methods.getPassedAuctionCount().call()
    let temp = []
    for (let i = 1; i <= auctionCnt; i++) temp.push(i)
    const auctionAddresses = await Promise.all(temp.map((val, idx) => {
      const auction = PrimaryContract.methods.getPassedAuction(idx).call()
      return auction
    }))
    const passedAuctions = await Promise.all(auctionAddresses.map(auction => (
      Promise.all(auction.map(addr => {
        const ParticipantContract = Participant(web3, addr)
        return ParticipantContract.methods.getParticipantInfo().call()
      }))
    )))
    commit('SET_PASSED_AUCTIONS', passedAuctions)
  },

  async addApprovedParticipant({ commit, dispatch, getters, state }, {isActive, info} ) {
    const activeNetwork = getters.activeNetwork;
    const web3 = state.web3.instance;
    const userAddr = state.web3.address

    if (!activeNetwork) {
      await sleep(500);
      return await dispatch("addApprovedParticipant");
    }
    const PrimaryContract = Primary(web3, activeNetwork.contracts.primary)

    await PrimaryContract.methods.createApprovedParticipant(isActive, info.owner, info.projectName, 
      info.projectType, info.leases[0], info.leases[1], info.url, info.hasToken, info.tokenName, info.maxSupply, 
      info.maxRewards, info.scorePerToken)
      .send({from: userAddr})
    if (isActive == 0)
      dispatch("getActiveAuctionInfo")
    else
      dispatch("getFutureAuctionInfo")
  }
}