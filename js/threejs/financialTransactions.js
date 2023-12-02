// js/threejs/financialTransactions.js

class FinancialTransactions {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.web3 = new Web3(blockchain.provider);
    this.contract = new this.web3.eth.Contract(blockchain.contractABI, blockchain.contractAddress);
  }

  async makeTransaction(fromAddress, toAddress, amount, callback) {
    const transactionParameters = {
      to: toAddress,
      from: fromAddress,
      value: this.web3.utils.toWei(amount.toString(), 'ether')
    };

    try {
      const txHash = await this.web3.eth.sendTransaction(transactionParameters);
      callback(null, txHash);
    } catch (error) {
      callback(error, null);
    }
  }

  async executeSmartContractFunction(functionName, params, fromAddress, callback) {
    const contractFunction = this.contract.methods[functionName](...params);
    const encodedABI = contractFunction.encodeABI();

    const transactionParameters = {
      to: this.blockchain.contractAddress,
      from: fromAddress,
      data: encodedABI
    };

    try {
      const txHash = await this.web3.eth.sendTransaction(transactionParameters);
      callback(null, txHash);
    } catch (error) {
      callback(error, null);
    }
  }
}

// Shared dependencies
const blockchainConfig = {
  provider: 'https://network.io',
  contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
  contractABI: [] // The actual ABI should be provided here
};

// Instantiate the financial transactions handler
const financialTransactions = new FinancialTransactions(blockchainConfig);

// Example usage:
// financialTransactions.makeTransaction('0xFromAddress', '0xToAddress', 1, (error, txHash) => {
//   if (error) {
//     console.error('Transaction Error:', error);
//   } else {
//     console.log('Transaction Success:', txHash);
//   }
// });

// financialTransactions.executeSmartContractFunction('transfer', ['0xToAddress', 100], '0xFromAddress', (error, txHash) => {
//   if (error) {
//     console.error('Smart Contract Error:', error);
//   } else {
//     console.log('Smart Contract Success:', txHash);
//   }
// });