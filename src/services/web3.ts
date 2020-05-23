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
const ERC721_ENUMERABLE_ABI = require('../contracts/ERC721Enumerable.json');
const ERC165_ABI = require('../contracts/ERC165.json');

// const ERC721_METADATA_INTERFACE_ID = '0x5b5e139f';
const ERC721_INTERFACE_ID = '0x80ac58cd';
// const ERC721_ENUMERABLE_INTERFACE_ID = '0x780e9d63';

function toCents(amount: string, decimals: number): string {
  return (Number(amount) * (10 ** decimals)).toFixed(0);
}

function fromCents(amount: string, decimals: number): string {
  return (Number(amount) / (10 ** decimals)).toFixed(decimals);
}

export function isValidAddress(address: string): boolean {
  return web3.utils.isAddress(address);
}

export async function resolveName(name: string): Promise<string> {
  if (/^0x[0-9A-Fa-f]{40}$/.test(name)) return name;
  return web3.eth.ens.getAddress(name);
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

async function ERC721_name(contract: string): Promise<string> {
  const abi = new web3.eth.Contract(ERC721_METADATA_ABI, contract);
  return abi.methods.name().call();
}

async function ERC721_symbol(contract: string): Promise<string> {
  const abi = new web3.eth.Contract(ERC721_METADATA_ABI, contract);
  return abi.methods.symbol().call();
}

async function ERC721_tokenURI(contract: string, tokenId: string): Promise<string> {
  const abi = new web3.eth.Contract(ERC721_METADATA_ABI, contract);
  return abi.methods.tokenURI(tokenId).call();
}

async function ERC721_balanceOf(contract: string, address: string): Promise<string> {
  const abi = new web3.eth.Contract(ERC721_ABI, contract);
  return abi.methods.balanceOf(address).call();
}

async function ERC721_tokenOfOwnerByIndex(contract: string, address: string, index: string): Promise<string> {
  const abi = new web3.eth.Contract(ERC721_ENUMERABLE_ABI, contract);
  return abi.methods.tokenOfOwnerByIndex(address, index).call();
}

async function ERC721_safeTransferFrom(account: string, contract: string, address: string, tokenId: string, data: string): Promise<void> {
  const abi = new web3.eth.Contract(ERC721_ABI, contract);
  return new Promise((resolve, reject) => {
    abi.methods.safeTransferFrom(account, address, tokenId, data)
      .send({ from: account })
      .once('confirmation', (confNumber: any, receipt: any) => resolve())
      .once('error', reject);
  });
}

export async function getERC721Name(contract: string): Promise<string> {
  return ERC721_name(contract);
}

export async function getERC721Symbol(contract: string): Promise<string> {
  return ERC721_symbol(contract);
}

export async function getERC721TokenURI(contract: string, tokenId: string): Promise<string> {
  return ERC721_tokenURI(contract, tokenId);
}

export async function getERC721Balance(account: string, contract: string): Promise<string> {
  const balance = await ERC721_balanceOf(contract, account);
  return fromCents(balance, 0);
}

export async function getERC721TokenIdByIndex(account: string, contract: string, index: number): Promise<string> {
  return ERC721_tokenOfOwnerByIndex(contract, account, String(index));
}

export async function transferERC721(account: string, contract: string, address: string, tokenId: string, data: string): Promise<void> {
  return ERC721_safeTransferFrom(account, contract, address, tokenId, data);
}

export async function supportsERC721(contract: string): Promise<boolean> {
  return ERC165_supportsInterface(contract, ERC721_INTERFACE_ID);
}

async function ERC165_supportsInterface(contract: string, interfaceId: string): Promise<boolean> {
  const abi = new web3.eth.Contract(ERC165_ABI, contract);
  return abi.methods.supportsInterface(interfaceId).call();
}
