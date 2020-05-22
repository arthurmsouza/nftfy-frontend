import React, { useEffect, useState } from 'react';
import {
  isValidAddress,
  getAccounts,
  getETHBalance,
  transferETH,
  getERC20Name,
  getERC20Symbol,
  getERC20Balance,
  transferERC20,
} from '../services/web3';

function ETHPanel({ account }: { account: string }) {
  const [balance, setBalance] = useState('');
  useEffect(() => { updateBalance() }, [account]);
  async function updateBalance() {
    setBalance(await getETHBalance(account));
  }
  async function onTransfer(address: string, amount: string) {
    await transferETH(account, address, amount);
    await updateBalance();
  }
  return (
    <div>
      Ethereum {account}<br/>
      <label>Balance</label> {balance} ETH
      <ETHTransferForm onTransfer={onTransfer} />
    </div>
  );
}

function ETHTransferForm({ onTransfer } : { onTransfer: (address: string, amount: string) => Promise<void> }) {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  async function onSubmit(event: React.FormEvent) {
    if (event) event.preventDefault();
    if (!isValidAddress(address)) return;
    await onTransfer(address, amount);
    setAddress('');
    setAmount('');
  }
  return (
      <form onSubmit={onSubmit}>
        <input name="address" type="string" value={address} onChange={(e) => setAddress(e.target.value)} />
        <input name="amount" type="string" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button type="submit">Transfer</button>
      </form>
  );
}

function ERC20Panel({ account, contract }: { account: string; contract: string }) {
  const [name, setName] = useState('');
  const [_symbol, setSymbol] = useState('');
  const [balance, setBalance] = useState('');
  useEffect(() => { updateName() }, [contract]);
  useEffect(() => { updateSymbol() }, [contract]);
  useEffect(() => { updateBalance() }, [account, contract]);
  async function updateName() {
    setName(await getERC20Name(contract));
  }
  async function updateSymbol() {
    setSymbol(await getERC20Symbol(contract));
  }
  async function updateBalance() {
    setBalance(await getERC20Balance(account, contract));
  }
  async function onTransfer(address: string, amount: string) {
    await transferERC20(account, contract, address, amount);
    await updateBalance();
  }
  return (
    <div>
      {name} {contract}<br/>
      <label>Balance</label> {balance} {_symbol}
      <ERC20TransferForm onTransfer={onTransfer} />
    </div>
  );
}

function ERC20TransferForm({ onTransfer } : { onTransfer: (address: string, amount: string) => Promise<void> }) {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  async function onSubmit(event: React.FormEvent) {
    if (event) event.preventDefault();
    if (!isValidAddress(address)) return;
    await onTransfer(address, amount);
    setAddress('');
    setAmount('');
  }
  return (
      <form onSubmit={onSubmit}>
        <input name="address" type="string" value={address} onChange={(e) => setAddress(e.target.value)} />
        <input name="amount" type="string" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button type="submit">Transfer</button>
      </form>
  );
}

function ERC20AddForm({ onAddToken } : { onAddToken: (contract: string) => Promise<void> }) {
  const [address, setAddress] = useState('');
  async function onSubmit(event: React.FormEvent) {
    if (event) event.preventDefault();
    if (!isValidAddress(address)) return;
    await onAddToken(address);
    setAddress('');
  }
  return (
      <form onSubmit={onSubmit}>
        <input name="address" type="string" value={address} onChange={(e) => setAddress(e.target.value)} />
        <button type="submit">Add ERC-20 Token</button>
      </form>
  );
}

function Wallet({ account }: { account: string }) {
  const [contracts, setContracts] = useState<string[]>([]);
  async function onAddToken(contract: string) {
    // TODO check if implements ERC-20 interface
    if (!contracts.includes(contract)) {
      setContracts(contracts.concat([contract]));
    }
  }
  return (
    <div>
      <ETHPanel account={account} />
      {contracts.length > 0
        ? contracts.map((contract, i) =>
            <ERC20Panel key={i} account={account} contract={contract} />
          )
        : 'Empty token list'
      }
      <ERC20AddForm onAddToken={onAddToken} />
    </div>
  );
}

function AccountPanel({ account }: { account: string }) {
  return (
    <div className="AccountPanel">
      <Wallet account={account} />
    </div>
  );
}

function App() {
  const [accounts, setAccounts] = useState<string[] | null>(null);
  const [account, setAccount] = useState('');
  useEffect(() => {
    (async () => setAccounts(await getAccounts()))();
  }, []);
  useEffect(() => {
    if (accounts === null) return;
    if (accounts.length === 0) return;
    setAccount(accounts[0]);
  }, [accounts])
  return (
    <div className="App">
      {accounts
        ? (<select onChange={(e) => setAccount(e.target.value)} value={account}>
            {account === ''
              ? (<option key={0} value={''}>No account selected</option>)
              : null
            }
            {accounts.map((account, i) =>
              <option key={i+1} value={account}>{account}</option>
            )}
          </select>)
        : 'No accounts available'
      }
      {account
        ? <AccountPanel account={account} />
        : null
      }
    </div>
  );
}

export default App;
