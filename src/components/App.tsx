import React, { useEffect, useState } from 'react';
import { Button, Input, Layout, Select } from 'antd';
import {
  isValidAddress,
  resolveName,
  getAccounts,
  getETHBalance,
  transferETH,
  getERC20Name,
  getERC20Symbol,
  getERC20Balance,
  transferERC20,
  getERC721Name,
  getERC721Symbol,
  getERC721TokenURI,
  getERC721Balance,
  getERC721TokenIdByIndex,
  transferERC721,
  supportsERC721,
} from '../services/web3';

const { Content } = Layout;
const { Option } = Select;

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
    const xaddress = await resolveName(address);
    if (!isValidAddress(xaddress)) return;
    await onTransfer(xaddress, amount);
    setAddress('');
    setAmount('');
  }
  return (
      <form onSubmit={onSubmit}>
        <input name="address" type="string" value={address} onChange={(e) => setAddress(e.target.value)} />
        <input name="amount" type="string" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Button htmlType="submit">Transfer</Button>
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
    const xaddress = await resolveName(address);
    if (!isValidAddress(xaddress)) return;
    await onTransfer(xaddress, amount);
    setAddress('');
    setAmount('');
  }
  return (
    <form onSubmit={onSubmit}>
      <input name="address" type="string" value={address} onChange={(e) => setAddress(e.target.value)} />
      <input name="amount" type="string" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <Button htmlType="submit">Transfer</Button>
    </form>
  );
}

function ERC721Panel({ account, contract }: { account: string; contract: string }) {
  const [name, setName] = useState('');
  const [_symbol, setSymbol] = useState('');
  const [balance, setBalance] = useState('');
  const [tokens, setTokens] = useState<{ [token: string]: string }>({});
  useEffect(() => { updateName() }, [contract]);
  useEffect(() => { updateSymbol() }, [contract]);
  useEffect(() => { updateBalance() }, [account, contract]);
  async function updateName() {
    setName(await getERC721Name(contract));
  }
  async function updateSymbol() {
    setSymbol(await getERC721Symbol(contract));
  }
  async function updateBalance() {
    const balance = await getERC721Balance(account, contract);
    const tokens: { [token: string]: string } = {};
    for (let i = 0; i < Number(balance); i++) {
      const tokenId = await getERC721TokenIdByIndex(account, contract, i);
      const tokenURI = await getERC721TokenURI(contract, tokenId);
      tokens[tokenId] = tokenURI;
    }
    setBalance(balance);
    setTokens(tokens);
  }
  async function onTransfer(address: string, tokenId: string) {
    await transferERC721(account, contract, address, tokenId, '0x');
    await updateBalance();
  }
  return (
    <div>
      {name} {contract}<br/>
      <label>Balance</label> {balance} {_symbol}
      {Object.keys(tokens).map((token, i) =>
        <div key={i}>Token {token} {tokens[token]}</div>
      )}
      <ERC721TransferForm onTransfer={onTransfer} />
    </div>
  );
}

function ERC721TransferForm({ onTransfer } : { onTransfer: (address: string, tokenId: string) => Promise<void> }) {
  const [address, setAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  async function onSubmit(event: React.FormEvent) {
    if (event) event.preventDefault();
    const xaddress = await resolveName(address);
    if (!isValidAddress(xaddress)) return;
    await onTransfer(xaddress, tokenId);
    setAddress('');
    setTokenId('');
  }
  return (
    <form onSubmit={onSubmit}>
      <input name="address" type="string" value={address} onChange={(e) => setAddress(e.target.value)} />
      <input name="tokenId" type="string" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
      <Button htmlType="submit">Transfer</Button>
    </form>
  );
}

function AddTokenForm({ onAddToken } : { onAddToken: (contract: string) => Promise<void> }) {
  const [address, setAddress] = useState('');
  async function onSubmit(event: React.FormEvent) {
    if (event) event.preventDefault();
    const xaddress = await resolveName(address);
    if (!isValidAddress(xaddress)) return;
    await onAddToken(xaddress);
    setAddress('');
  }
  return (
      <form onSubmit={onSubmit}>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} />
        <Button type="primary" shape="round" htmlType="submit">Add Token</Button>
      </form>
  );
}

function Wallet({ account }: { account: string }) {
  const [contracts, setContracts] = useState<{ [address: string]: 'ERC20' | 'ERC721' }>({});
  async function onAddToken(contract: string) {
    const address = contract.toLowerCase();
    if (contracts[address]) return;
    let isNFT = false;
    try { isNFT = await supportsERC721(contract); } catch (e) { }
    setContracts({ ...contracts, [address]: isNFT ? 'ERC721' : 'ERC20' });
  }
  return (
    <div>
      <ETHPanel account={account} />
      {Object.keys(contracts).length > 0
        ? Object.keys(contracts).map((contract, i) =>
            <React.Fragment key={i}>
            {contracts[contract] === 'ERC20'
              ? <ERC20Panel account={account} contract={contract} />
              : null
            }
            {contracts[contract] === 'ERC721'
              ? <ERC721Panel account={account} contract={contract} />
              : null
            }
            </React.Fragment>
          )
        : 'Empty token list'
      }
      <AddTokenForm onAddToken={onAddToken} />
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
    <Layout>
      <Content>
        {accounts
          ? (<Select value={account} onChange={(value) => setAccount(value)}>
              {account === ''
                ? (<Option key={0} value={''}>No account selected</Option>)
                : null
              }
              {accounts.map((account, i) =>
                <Option key={i+1} value={account}>{account}</Option>
              )}
            </Select>)
          : 'No accounts available'
        }
        {account
          ? <AccountPanel account={account} />
          : null
        }
      </Content>
    </Layout>
  );
}

export default App;
