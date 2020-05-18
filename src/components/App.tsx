import React, { useEffect, useState } from 'react';
import {
//  approveAllowance,
  getAccounts,
/*  getBalance,
  getDueDate,
  getTokenBalance,
  getTokenAllowance,
  getTokenInvestment,
  getTokenMaxPrize,
  getTokenPayoutRate,
  investmentFund,
  investmentDefund,
  placeBet,*/
} from '../services/web3';

/*
function ApproveForm({ account }: { account?: string }) {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('');
  const [allowance, setAllowance] = useState('');
  const [ethBalance, setEthBalance] = useState('');
  useEffect(() => {
    if (!account) return;
    (async () => setBalance(await getTokenBalance(account)))();
    (async () => setAllowance(await getTokenAllowance(account)))();
    (async () => setEthBalance(await getBalance(account)))();
  }, [account]);
  async function onSubmit(event: React.FormEvent) {
    if (event) event.preventDefault();
    if (!account) return;
    await approveAllowance(account, amount);
    setAllowance(amount);
  }
  return (
    <form className="ApproveForm" onSubmit={onSubmit}>
      <fieldset disabled={!account}>
        <input name="amount" type="number" value={amount} min="0" placeholder="0" step="0.01" onChange={(e) => setAmount(e.target.value)} />
        <button type="submit">Approve</button>&nbsp;
        <label>Token Balance</label> {balance}&nbsp;
        <label>Token Allowance</label> {allowance}&nbsp;
        <label>Ether Balance</label> {ethBalance}
      </fieldset>
    </form>
  );
}

function BetForm({ account }: { account?: string }) {
  const limit = 10000;
  const [amount, setAmount] = useState('1');
  const [chance, setChance] = useState('50.00');
  const [mode, setMode] = useState('');
  const [odds, setOdds] = useState('');
  const [prize, setPrize] = useState('');
  const [profit, setProfit] = useState('');
  useEffect(() => {
    const low = 0;
    const high = Math.round(Number(chance)/100 * limit) - 1;
    const range = (high - low) + 1;
    const odds = (95 * limit) / (100 * range);
    const prize = Number(amount) * (odds - 1);
    setOdds(odds.toFixed(2));
    setPrize(prize.toFixed(2));
  }, [amount, chance]);
  useEffect(() => {
    (async () => setProfit(await getTokenMaxPrize()))();
  }, []);
  async function onSubmit(event: React.FormEvent) {
    if (event) event.preventDefault();
    if (!account) return;
    if (mode === 'lo') {
      const low = 0;
      const high = Math.round(Number(chance)/100 * limit) - 1;
      await placeBet(account, amount, low, high, limit);
    }
    if (mode === 'hi') {
      const low = Math.round((1 - Number(chance)/100) * limit);
      const high = limit - 1;
      await placeBet(account, amount, low, high, limit);
    }
  }
  return (
    <form className="BetForm" onSubmit={onSubmit}>
      <fieldset disabled={!account}>
        <input name="amount" type="number" value={amount} min="0" placeholder="0" step="0.01" onChange={(e) => setAmount(e.target.value)} />
        <input name="chance" type="number" value={chance} min="0.01" max="99.99" placeholder="50.00" step="0.01" onChange={(e) => setChance(e.target.value)} />
        <button type="submit" onClick={() => setMode('hi')}>Bet Hi</button>
        <button type="submit" onClick={() => setMode('lo')}>Bet Lo</button>&nbsp;
        <label>Odds</label> {odds}&nbsp;
        <label>Prize</label> {prize}&nbsp;
        <label>Max Profit</label> {profit}
      </fieldset>
    </form>
  );
}

function FundingForm({ account }: { account?: string }) {
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('');
  const [investment, setInvestment] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [payout, setPayout] = useState('');
  useEffect(() => {
    if (!account) return;
    (async () => setInvestment(await getTokenInvestment(account)))();
    (async () => setDueDate(await getDueDate(account)))();
  }, [account]);
  useEffect(() => {
    (async () => setPayout(await getTokenPayoutRate()))();
  }, []);
  async function onSubmit(event: React.FormEvent) {
    if (event) event.preventDefault();
    if (!account) return;
    if (mode === 'fund') {
      await investmentFund(account, amount);
    }
    if (mode === 'defund') {
      await investmentDefund(account, amount);
    }
  }
  return (
    <form className="FundingForm" onSubmit={onSubmit}>
      <fieldset disabled={!account}>
        <input name="amount" type="number" value={amount} min="0" placeholder="0" step="0.01" onChange={(e) => setAmount(e.target.value)} />
        <button type="submit" onClick={() => setMode('fund')}>Fund</button>
        <button type="submit" onClick={() => setMode('defund')}>Defund</button>&nbsp;
        <label>Token Investment</label> {investment}&nbsp;
        <label>Token Payout</label> {payout}&nbsp;
        <label>Due Date</label> {dueDate}
      </fieldset>
    </form>
  );
}
*/
function App() {
  const [accounts, setAccounts] = useState<string[] | null>(null);
  useEffect(() => {
    (async () => setAccounts(await getAccounts()))();
  });
/*
  return (
    <div className="App">
      <ApproveForm account={(accounts || [])[0]} />
      <BetForm account={(accounts || [])[0]} />
      <FundingForm account={(accounts || [])[0]} />
    </div>
  );
*/
  return (
    <div className="App">
    </div>
  );
}

export default App;
