import Web3 from 'web3';

declare global {
  interface Window { ethereum: any; web3: any; }
}

if (window.ethereum) {
  window.web3 = new Web3(window.ethereum);
  window.ethereum.enable(); // should wait?
}

if (!window.web3) throw new Error('No web3? You should consider trying MetaMask!');

const web3 = new Web3(window.web3.currentProvider);

const ERC20_METADATA_ABI = require('../contracts/ERC20Metadata.json');
const ERC20_ABI = require('../contracts/ERC20.json');
const ERC721_METADATA_ABI = require('../contracts/ERC721Metadata.json');
const ERC721_ABI = require('../contracts/ERC721.json');

function toCents(amount: string, decimals: number): string {
  return (Number(amount) * (10 ** decimals)).toFixed(0);
}

function fromCents(amount: string, decimals: number): string {
  return (Number(amount) / (10 ** decimals)).toFixed(decimals);
}

export function isValidAddress(address: string): boolean {
  return web3.utils.isAddress(address);
}

export async function getAccounts(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((error, accounts) => {
      if (error) return reject(error);
      return resolve(accounts);
    });
  });
}

export async function getETHBalance(address: string): Promise<string> {
  return new Promise((resolve, reject) => {
    web3.eth.getBalance(address, 'latest', (error, balance) => {
      if (error) return reject(error);
      return resolve(web3.utils.fromWei(balance, 'ether'));
    });
  });
}

export async function transferETH(account: string, address: string, amount: string): Promise<void> {
  return new Promise((resolve, reject) => {
    web3.eth.sendTransaction({ from: account, to: address, value: web3.utils.toWei(amount, 'ether') })
      .once('confirmation', (confNumber: any, receipt: any) => resolve())
      .once('error', reject);
  });
}

async function ERC20_name(contract: string): Promise<string> {
  const abi = new web3.eth.Contract(ERC20_METADATA_ABI, contract);
  return abi.methods.name().call();
}

async function ERC20_symbol(contract: string): Promise<string> {
  const abi = new web3.eth.Contract(ERC20_METADATA_ABI, contract);
  return abi.methods.symbol().call();
}

async function ERC20_decimals(contract: string): Promise<number> {
  const abi = new web3.eth.Contract(ERC20_METADATA_ABI, contract);
  return Number(await abi.methods.decimals().call());
}

async function ERC20_balanceOf(contract: string, address: string): Promise<string> {
  const abi = new web3.eth.Contract(ERC20_ABI, contract);
  return abi.methods.balanceOf(address).call();
}

async function ERC20_transfer(account: string, contract: string, address: string, amount: string): Promise<void> {
  const abi = new web3.eth.Contract(ERC20_ABI, contract);
  return new Promise((resolve, reject) => {
    abi.methods.transfer(address, amount)
      .send({ from: account })
      .once('confirmation', (confNumber: any, receipt: any) => resolve())
      .once('error', reject);
  });
}

export async function getERC20Name(contract: string): Promise<string> {
  return ERC20_name(contract);
}

export async function getERC20Symbol(contract: string): Promise<string> {
  return ERC20_symbol(contract);
}

export async function getERC20Balance(account: string, contract: string): Promise<string> {
  const decimals = await ERC20_decimals(contract);
  const balance = await ERC20_balanceOf(contract, account);
  return fromCents(balance, decimals);
}

export async function transferERC20(account: string, contract: string, address: string, amount: string): Promise<void> {
  const decimals = await ERC20_decimals(contract);
  return ERC20_transfer(account, contract, address, toCents(amount, decimals));
}

/*
const dappAddress = '0x00f650a9151c2666bb672b2f1e7759894e4d98b9';
const dappAbi = require('../contracts/HiLoDApp.json');
const dapp = new web3.eth.Contract(dappAbi, dappAddress);

*/

/*
export async function getTokenAllowance(address: string): Promise<string> {
  const decimals = await getTokenDecimals();
  const allowance = await token.methods.allowance(address, dappAddress).call();
  return fromCents(allowance, decimals);
}

export async function approveAllowance(address: string, amount: string): Promise<void> {
  const decimals = await getTokenDecimals();
  return new Promise((resolve, reject) => {
    token.methods.approve(dappAddress, toCents(amount, decimals))
      .send({ from: address })
      .once('confirmation', (confNumber, receipt) => resolve())
      .once('error', reject);
  });
}

export async function getTokenMaxPrize(): Promise<string> {
  const decimals = await getTokenDecimals();
  const prize = await dapp.methods.maxPrize(tokenAddress).call();
  return fromCents(prize, decimals);
}

export async function getTokenInvestment(address: string): Promise<string> {
  const decimals = await getTokenDecimals();
  const investment = await dapp.methods.investmentOf(address, tokenAddress).call();
  return fromCents(investment, decimals);
}

export async function getDueDate(address: string): Promise<string> {
  const dueDate = await dapp.methods.dueDateOf(address).call();
  return new Date(1000 * dueDate).toISOString();
}

export async function getTokenPayoutRate(): Promise<string> {
  const { _balance, _funds } = await dapp.methods.payoutRate(tokenAddress).call();
  if (Number(_funds) === 0) return '0.00%';
  return (100 * Number(_balance) / Number(_funds)).toFixed(2) + '%';
}

export async function investmentFund(address: string, amount: string): Promise<void> {
  const decimals = await getTokenDecimals();
  return new Promise((resolve, reject) => {
    dapp.methods.fund(toCents(amount, decimals), tokenAddress)
      .send({ from: address })
      .once('confirmation', (confNumber, receipt) => resolve())
      .once('error', reject);
  });
}

export async function investmentDefund(address: string, amount: string): Promise<void> {
  const decimals = await getTokenDecimals();
  return new Promise((resolve, reject) => {
    dapp.methods.defund(toCents(amount, decimals), tokenAddress)
      .send({ from: address })
      .once('confirmation', (confNumber, receipt) => resolve())
      .once('error', reject);
  });
}

export async function placeBet(address: string, amount: string, low: number, high: number, limit: number): Promise<void> {
  const decimals = await getTokenDecimals();
  return new Promise((resolve, reject) => {
    dapp.methods.bet(String(low), String(high), String(limit), toCents(amount, decimals), tokenAddress)
      .send({ from: address })
      .once('confirmation', (confNumber, receipt) => resolve())
      .once('error', reject);
  });
}
*/
