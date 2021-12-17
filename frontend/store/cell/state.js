export default () => ({
  initLoading: false,
  activeNetwork: '',

  web3: {
    instance: null,
    isConnected: false,
    chainId: null,
    provider: null,
    address: "",
    mainCurrencyBalance: ""
  },

  cellTokenInfo: {
    address: "",
    name: "",
    symbol: "",
    decimals: '18',
    userBalance: "",
  },

  activeAuction: {
    auctionState: 0,
    maxRange: 0,
    minimalCellSlotPrice: 0
  },

  futureAuction: {
    auctionState: 0,
    maxRange: 0,
    minimalCellSlotPrice: 0
  },
  futureApplicants: [],
  futureParticipants: [],

  activeParticipants: [],
  activeApplicants: [],
  passedAuctions: [],
  winners: [],

  myActiveProject: {
    project_name: '',
    project_type: '',
    state: -1
  },
  myFutureProject: {
    project_name: '',
    project_type: '',
    state: -1
  },

  eth: {
    networks: [
      {
        name: "Local network",
        short_name: "eth",
        chain: "ETH",
        network: "local",
        chain_id: 1337,
        network_id: 5777,
        explorer_url: "https://ropsten.etherscan.io",
        rpc_url: "https://ropsten.infura.io/v3/%API_KEY%",
        blocks_per_day: 6450,
        native_currency: {
          symbol: "ETH",
          name: "Ethereum",
          decimals: 18,
          contractAddress: "",
          balance: "",
        },
        contracts: {
          primary: "0xba2B2b5A71C670aaC1f664beF0D1D956e08A07B1",
          cellslot: "0x807ED657F2C0A19367f89e128D79Edbd292AB598",
          celltoken: "0xCbA52B33EF62F9A5F8cDf857e03efC09CcF62176",
        },
        buy: {
          link:
            "https://app.uniswap.org/#/swap?outputCurrency=0x025c9f1146d4d94f8f369b9d98104300a3c8ca23",
          img: "img/uniswap.png",
          text: "Uniswap",
        },
      },
      {
        name: "Ethereum Ropsten",
        short_name: "eth",
        chain: "ETH",
        network: "ropsten",
        chain_id: 3,
        network_id: 3,
        explorer_url: "https://ropsten.etherscan.io",
        rpc_url: "https://ropsten.infura.io/v3/%API_KEY%",
        blocks_per_day: 6450,
        native_currency: {
          symbol: "ETH",
          name: "Ethereum",
          decimals: 18,
          contractAddress: "",
          balance: "",
        },
        contracts: {
          primary: "0xFaCBb7Aff228D6DBe14f02568F3d974CF57EAb44",
          cellslot: "0xFaBfD6212e54431D453AB24fA5BE934E4105a3e3",
          celltoken: "0xEE15815dbc19cea2811F87318a535078f4430E0e",
        },
        buy: {
          link:
            "https://app.uniswap.org/#/swap?outputCurrency=0x025c9f1146d4d94f8f369b9d98104300a3c8ca23",
          img: "img/uniswap.png",
          text: "Uniswap",
        },
      },
      {
        name: "Ethereum Mainnet",
        short_name: "eth",
        chain: "ETH",
        network: "mainnet",
        chain_id: 1,
        network_id: 1,
        explorer_url: "https://etherscan.io",
        rpc_url: "https://mainnet.infura.io/v3/%API_KEY%",
        blocks_per_day: 6450,
        native_currency: {
          symbol: "ETH",
          name: "Ethereum",
          decimals: 18,
          contractAddress: "",
          balance: "",
        },
        contracts: {
          primary: "0xd8CB0cf6bA6FEf670ad3958D91a05b2069aC9C8b",
          cellslot: "0x06af6474e24986E6B9e32F465BF67F6c3Cd10660",
          celltoken: "0x26c8AFBBFE1EBaca03C2bB082E69D0476Bffe099",
        },
        buy: {
          link:
            "https://app.uniswap.org/#/swap?outputCurrency=0x025c9f1146d4d94f8f369b9d98104300a3c8ca23",
          img: "img/uniswap.png",
          text: "Uniswap",
        },
      },
      {
        name: "Ethereum rinkeby",
        short_name: "eth",
        chain: "ETH",
        network: "rinkeby",
        chain_id: 4,
        network_id: 4,
        explorer_url: "https://rinkeby.etherscan.io",
        rpc_url: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        blocks_per_day: 6450,
        native_currency: {
          symbol: "ETH",
          name: "Ethereum",
          decimals: 18,
          contractAddress: "",
          balance: "",
        },
        contracts: {
          primary: "0xd8CB0cf6bA6FEf670ad3958D91a05b2069aC9C8b",
          cellslot: "0x06af6474e24986E6B9e32F465BF67F6c3Cd10660",
          celltoken: "0x26c8AFBBFE1EBaca03C2bB082E69D0476Bffe099",
        },
        buy: {
          link:
            "https://app.uniswap.org/#/swap?outputCurrency=0x025c9f1146d4d94f8f369b9d98104300a3c8ca23",
          img: "img/uniswap.png",
          text: "Uniswap",
        }
      }
    ]
  }
})
