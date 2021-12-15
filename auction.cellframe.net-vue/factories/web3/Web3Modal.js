import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const NOOP = () => {};

export default {
  provider: null,
  web3: null,
  web3Modal: null,

  async connect() {
    if (this.provider && this.web3)
      return { provider: this.provider, web3: this.web3 };

    const providerOptions = {
      // https://infura.io/dashboard/ethereum
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "ecfafabdcff44308ac6a993e5225b790",
        },
      },
    };

    const web3Modal = new Web3Modal({
      cacheProvider: true, // optional
      providerOptions, // required
    });
    const provider = await web3Modal.connect();

    this.provider = provider;
    this.web3 = new Web3(provider);
    this.web3Modal = web3Modal;
    return { provider: this.provider, web3: this.web3 };
  },
  
  bindProviderEvents({
    accountsChanged,
    chainChanged,
    connect,
    disconnect,
  }) {
    if (!this.provider)
      throw new Error(
        `Make sure to connect first before binding provider events.`
      );

    this.provider.on("accountsChanged", accountsChanged || NOOP);
    this.provider.on("chainChanged", chainChanged || NOOP);
    this.provider.on("connect", connect || NOOP);
    this.provider.on("disconnect", disconnect || NOOP);
  },

  // Clear cached provider for Web3Modal
  clearCachedProvider() {
    this.web3Modal.clearCachedProvider();
  },
}
