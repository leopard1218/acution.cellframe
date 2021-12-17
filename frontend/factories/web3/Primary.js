export default function Primary(web3, contractAddy) {
  return new web3.eth.Contract(primaryABI, contractAddy);
}

const primaryABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "cellSlotsAddress_",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "PLEDGE_AMOUNT",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "isActive",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "_type",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "st_range",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "end_range",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_metaURI",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "hasGovernance",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "token_name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "max_supply",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "max_reward",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "mag",
        "type": "uint256"
      }
    ],
    "name": "applyTo",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "isActive",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "applicant",
        "type": "address"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "auctionEndPhaseStartTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "auctionEndTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "auctionFinishTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "auctionStartTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "auctions",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "numOfApplicants",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxRange",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minimalCellSlotPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "auctionState",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "isActive",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "manager",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "blockedType_",
        "type": "bool"
      }
    ],
    "name": "blockParticipant",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "burnSlot",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "cellSlots",
    "outputs": [
      {
        "internalType": "contract CellSlotsInterface",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "isActive",
        "type": "uint256"
      }
    ],
    "name": "claimBack",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "range",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "createActiveAuction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "isActive",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_participant",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "_type",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "st_range",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "end_range",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_metaURI",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "hasGovernance",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "token_name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "max_supply",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "max_reward",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "mag",
        "type": "uint256"
      }
    ],
    "name": "createApprovedParticipant",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "range",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "createFutureAuction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "isActive",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "applicant",
        "type": "address"
      }
    ],
    "name": "decline",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "endTime_",
        "type": "uint256"
      }
    ],
    "name": "finishVoting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getActiveAuction",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "auctionState",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "applicants",
        "type": "address[]"
      },
      {
        "internalType": "uint256",
        "name": "maxRange",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minimalCellSlotPrice",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "isActive",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "applicant",
        "type": "address"
      }
    ],
    "name": "getApplication",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "project_name",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "project_type",
            "type": "bool"
          },
          {
            "internalType": "string",
            "name": "link",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "range",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "hasGovernance",
            "type": "bool"
          },
          {
            "internalType": "string",
            "name": "token_name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "max_supply",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "max_reward",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "mag_num",
            "type": "uint256"
          },
          {
            "internalType": "int256",
            "name": "state",
            "type": "int256"
          }
        ],
        "internalType": "struct Primary.Application",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "isActive",
        "type": "uint256"
      }
    ],
    "name": "getDeployedPartipants",
    "outputs": [
      {
        "internalType": "contract Participant[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getFutureAuction",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "auctionState",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "applicants",
        "type": "address[]"
      },
      {
        "internalType": "uint256",
        "name": "maxRange",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minimalCellSlotPrice",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getPassedAuction",
    "outputs": [
      {
        "internalType": "contract Participant[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPassedAuctionCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getWinnerParticipants",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isPrimary",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "ownerAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "rank",
        "type": "uint256"
      }
    ],
    "name": "mintSlotTo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "passedAuctions",
    "outputs": [
      {
        "internalType": "contract Participant",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "requestId",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "randomness",
        "type": "uint256"
      }
    ],
    "name": "rawFulfillRandomness",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "selectWinner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newAddress",
        "type": "address"
      }
    ],
    "name": "setCellSlotsAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "isActive",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "setMinimalCellSlotPrice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "startTime_",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endPhaseStartTime_",
        "type": "uint256"
      }
    ],
    "name": "startAuction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "winnerParticipants",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
