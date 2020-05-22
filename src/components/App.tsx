import React, { useEffect, useState } from 'react';
import {
  isValidAddress,
  getAccounts,
  getAccountBalance,
  getERC20Balance,
  transferERC20,
} from '../services/web3';

function ERC20Panel({ account, contract }: { account: string; contract: string }) {
  const [balance, setBalance] = useState('');
  useEffect(() => { updateBalance() }, [contract, account]);
  async function updateBalance() {
    setBalance(await getERC20Balance(contract, account));
  }
  async function onTransfer(address: string, amount: string) {
    await transferERC20(account, contract, address, amount);
    await updateBalance();
  }
  return (
    <div>
      {contract}<br/>
      <label>Token Balance</label> {balance}
      <ERC20TransferForm onTransfer={onTransfer} />
    </div>
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

function ERC20Wallet({ account }: { account: string }) {
  const [contracts, setContracts] = useState<string[]>([]);
  async function onAddToken(contract: string) {
    // TODO check if implements ERC-20 interface
    if (!contracts.includes(contract)) setContracts(contracts.concat([contract]));
  }
  return (
    <div>
      <ERC20AddForm onAddToken={onAddToken} />
      {contracts.length > 0
        ? contracts.map((contract, i) =>
            <ERC20Panel key={i} account={account} contract={contract} />
          )
        : 'Empty token list'
      }
    </div>
  );
}

function AccountPanel({ account }: { account: string }) {
  const [balance, setBalance] = useState('');
  useEffect(() => {
    (async () => setBalance(await getAccountBalance(account)))();
  }, [account]);
  return (
    <div className="AccountPanel">
      <label>Ether Balance</label> {balance}
      <ERC20Wallet account={account} />
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
