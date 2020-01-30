import React, { Component } from 'react';
import './App.css';
import getWeb3 from "./getWeb3";

const BigNumber = require('bignumber.js');

const LPAP_contract_ropsten_address = '0x43CD3224f8c81B096F4C9862ef6817e66c5B70B9';
const LPAP = JSON.parse(JSON.stringify(require("./abi/LendingPoolAddressesProvider.json")));
const LP = JSON.parse(JSON.stringify(require("./abi/LendingPool.json")));

const TestDAI_address = '0xf80A32A835F79D7787E8a8ee5721D0fEaFd78108'; // address got from MetaMask Mint transaction
const TestDAI_abi = [ { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "mint", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" } ];

const FlashLoanReceiverArb_address = "0x8957Fe56aA7AE50bA3217c385D27343cfcAbA6aE"; // address on Ropsten where FlashLoanReceiverArb.sol is deployed
const FlashLoanReceiverArb_abi = [ { "inputs": [ { "internalType": "contract LendingPoolAddressesProvider", "name": "_provider", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "_reserve", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "_value", "type": "uint256" } ], "name": "borrowMade", "type": "event" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "constant": true, "inputs": [], "name": "SALT", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "TEST", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "addressesProvider", "outputs": [ { "internalType": "contract ILendingPoolAddressesProvider", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "balanceAtReserve", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "paramFromExecuteOperation", "outputs": [ { "internalType": "bytes", "name": "", "type": "bytes" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address", "name": "_reserve", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }, { "internalType": "uint256", "name": "_fee", "type": "uint256" }, { "internalType": "bytes", "name": "_params", "type": "bytes" } ], "name": "executeOperation", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ];

//////////////////////////////////////////

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      lpap_instance: null,
      lp_instance: null,
      flashloanreceiverarb_instance: null,
      testdai_instance: null,
      daibalance: null
    };
    this.makeFlashLoan = this.makeFlashLoan.bind(this);
    this.setupAaveFlashLoan = this.setupAaveFlashLoan.bind(this);
  }

  ////////////////

  async setupAaveFlashLoan() {

    const web3 = this.state.web3;
    const account = this.state.accounts[0];

    const LPAP_instance = new web3.eth.Contract(LPAP.abi, LPAP_contract_ropsten_address);
    console.log("Instance of LendingPoolAddressesProvider:", LPAP_instance);

    const LP_address = await LPAP_instance.methods.getLendingPool().call();
    console.log("    getLendingPool() => Lending pool address: ", LP_address)

    const LP_instance = new web3.eth.Contract(LP.abi, LP_address);
    console.log("Instance of LendingPool: ", LP_instance)

    const TestDAI_instance = new web3.eth.Contract(TestDAI_abi, TestDAI_address);
    console.log('Instance of TestDAI: ', TestDAI_instance);

    const FlashLoanReceiverArb_instance = new web3.eth.Contract(FlashLoanReceiverArb_abi, FlashLoanReceiverArb_address);
    console.log('Instance of FlashLoanReceiverArb: ', FlashLoanReceiverArb_instance);

    /// Check the liquidity of a reserve using the function getReserveData(address _reserve),
    /// where the address of the reserve is the address of the token
    const reserveData = await LP_instance.methods.getReserveData(TestDAI_address).call();
    console.log('Test DAI Reserve Data: ', reserveData);

    /// Making test calls to query constants stored in contract
    /*
    const data_salt = await FlashLoanReceiverArb_instance.methods.SALT().call();
    const data_test = await FlashLoanReceiverArb_instance.methods.TEST().call();
    const data = await FlashLoanReceiverArb_instance.methods.paramFromExecuteOperation().call();
    const data_paramFromExecuteOperation = web3.eth.abi.decodeParameter('address', data);
    console.log(`Testing: reading public variables in FlashLoanReceiverArb contract: SALT:${data_salt}, TEST:${data_test}, paramFromExecuteOperation: ${data_paramFromExecuteOperation}`);
    */

    /// Hook up event listener
    FlashLoanReceiverArb_instance.events.borrowMade({}, (error, event)=>{})
    .on('data', function(event){
        console.log("FlashLoanReceiverArb: borrowMade() event fired:", event); // same results as the optional callback above
    });
    LP_instance.events.FlashLoan({}, (error, event)=>{})
    .on('data', function(event){
        console.log("LendingPool: FlashLoan() event fired:", event); // same results as the optional callback above
    });

    /// get contract's DAI balance in reserve
    const balance = await TestDAI_instance.methods.balanceOf(FlashLoanReceiverArb_address).call(); // balance is a string
    const ContractDaiBalanceInReserve = `${balance.slice(0,-18)}.${balance.slice(-18)}`;

    this.setState({
      lpap_instance: LPAP_instance,
      lp_instance: LP_instance,
      flashloanreceiverarb_instance: FlashLoanReceiverArb_instance,
      testdai_instance: TestDAI_instance,
      daibalance: ContractDaiBalanceInReserve
    });

  }

  ////////////////

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      console.log("web3: ", web3);

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log("accounts: ", accounts);

      this.setState({
        web3: web3,
        accounts: accounts
      })

      this.setupAaveFlashLoan();

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert('Failed to load Metamask. Check console for details.');
      console.error(error);
    }
  };

  ////////////////

  makeFlashLoan = async () => {
    const web3 = this.state.web3;
    const account = this.state.accounts[0];
    const LP_instance = this.state.lp_instance;
    const FlashLoanReceiverArb_instance = this.state.flashloanreceiverarb_instance;
    const TestDAI_instance = this.state.testdai_instance;

    var ethToBorrow = new BigNumber(0.183);
    const LOAN_AMOUNT = web3.utils.toWei(ethToBorrow.toString(), 'ether');; // in eth
    const PARAMS = web3.eth.abi.encodeParameters(['address'], [account]);
    console.log('== FlashLoan Arb == ');
    console.log('Making tx..');
    const tx_flashLoan =  await LP_instance.methods.flashLoan(FlashLoanReceiverArb_address, TestDAI_address, LOAN_AMOUNT, PARAMS).send({from: account});
    console.log('Sent tx:', tx_flashLoan);

    const balance = await TestDAI_instance.methods.balanceOf(FlashLoanReceiverArb_address).call(); // balance is a string
    const ContractDaiBalanceInReserve = `${balance.slice(0,-18)}.${balance.slice(-18)}`;

    this.setState({
      daibalance: ContractDaiBalanceInReserve
    });
  }

  ////////////////

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Experiment with Aave contract on Ropsten.
          </p>
          <p>
            FlashLoanReceiverArb's DAI balance in reserve: {this.state.daibalance}
          </p>
          <button onClick={this.makeFlashLoan}>
            Make flash loan
          </button>
        </header>
      </div>
    );
  }

}

export default App;
