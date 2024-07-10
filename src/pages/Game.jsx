import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { generateServerSeed, hashServerSeed, generateDiceRoll } from "@/lib/provablyFair";
import { v4 as uuidv4 } from 'uuid';
import BetFeed from "@/components/BetFeed";
import { Bitcoin, Coins } from "lucide-react";

const cryptocurrencies = {
  BTC: <Bitcoin className="h-5 w-5" />,
  ETH: <Coins className="h-5 w-5" />,
  LTC: <Coins className="h-5 w-5" />,
  DOGE: <Coins className="h-5 w-5" />,
  TRX: <Coins className="h-5 w-5" />,
};

const Game = () => {
  const navigate = useNavigate();
  const [serverSeed, setServerSeed] = useState("");
  const [serverSeedHash, setServerSeedHash] = useState("");
  const [clientSeed, setClientSeed] = useState("");
  const [diceResult, setDiceResult] = useState(null);
  const [wager, setWager] = useState(10);
  const [winChance, setWinChance] = useState(50);
  const [rollId, setRollId] = useState("");
  const [betHistory, setBetHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState("Player"); // Simulating a logged-in user
  const [selectedCurrency, setSelectedCurrency] = useState("BTC");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    generateNewServerSeed();
    loadBetHistory();
    const storedCurrency = localStorage.getItem('selectedCurrency') || "BTC";
    setSelectedCurrency(storedCurrency);
    updateBalance(storedCurrency);
  }, []);

  const updateBalance = (currency) => {
    const balances = JSON.parse(localStorage.getItem('cryptoBalances')) || {};
    setBalance(parseFloat(balances[currency] || 0));
  };

  const generateNewServerSeed = () => {
    const newServerSeed = generateServerSeed();
    setServerSeed(newServerSeed);
    setServerSeedHash(hashServerSeed(newServerSeed));
    setClientSeed(generateServerSeed()); // Prefill client seed
  };

  const loadBetHistory = () => {
    const history = JSON.parse(localStorage.getItem('wagerHistory')) || [];
    setBetHistory(history);
  };

  const handleRollDice = () => {
    if (wager > balance) {
      alert("Insufficient balance");
      return;
    }
    const result = generateDiceRoll(serverSeed, clientSeed);
    setDiceResult(result);
    
    // Generate a unique roll ID
    const newRollId = uuidv4();
    setRollId(newRollId);

    // Determine win or loss
    const win = (result / 6) * 100 <= winChance;
    const payout = win ? (wager * (100 / winChance)) : 0;
    
    const newBalance = balance - wager + payout;
    setBalance(newBalance);
    updateStoredBalance(newBalance);

    // Save wager details
    const newBet = saveWagerDetails(newRollId, wager, winChance, result, win, payout);
    setBetHistory(prevHistory => [newBet, ...prevHistory]);

    // Generate new server seed for the next roll
    generateNewServerSeed();
  };

  const updateStoredBalance = (newBalance) => {
    const balances = JSON.parse(localStorage.getItem('cryptoBalances')) || {};
    balances[selectedCurrency] = newBalance.toFixed(4);
    localStorage.setItem('cryptoBalances', JSON.stringify(balances));
    // Dispatch event to update navbar balance
    window.dispatchEvent(new CustomEvent('balanceUpdate', { 
      detail: { balance: newBalance, currency: selectedCurrency } 
    }));
  };

  const saveWagerDetails = (rollId, wager, winChance, result, win, payout) => {
    const wagerDetails = {
      rollId,
      username: currentUser,
      wager,
      winChance,
      result,
      win,
      payout,
      timestamp: new Date().toISOString()
    };

    // Retrieve existing wager history or initialize an empty array
    const existingHistory = JSON.parse(localStorage.getItem('wagerHistory')) || [];
    
    // Add new wager details to the history
    const updatedHistory = [wagerDetails, ...existingHistory];
    
    // Save updated history back to localStorage
    localStorage.setItem('wagerHistory', JSON.stringify(updatedHistory));

    return wagerDetails;
  };

  const handleEndGame = () => {
    navigate("/verification", { state: { serverSeed, serverSeedHash, rollId } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Provably Fair Dice Game</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Balance:</Label>
            <div className="flex items-center">
              {cryptocurrencies[selectedCurrency]}
              <span className="ml-2 font-bold">{balance.toFixed(4)} {selectedCurrency}</span>
            </div>
          </div>
          <div>
            <Label htmlFor="wager">Wager Amount:</Label>
            <Input
              id="wager"
              type="number"
              value={wager}
              onChange={(e) => setWager(Math.max(0, parseFloat(e.target.value)))}
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <Label htmlFor="winChance">Win Chance: {winChance}%</Label>
            <Slider
              id="winChance"
              min={1}
              max={99}
              step={1}
              value={[winChance]}
              onValueChange={(value) => setWinChance(value[0])}
            />
          </div>
          <div>
            <Label htmlFor="serverSeedHash">Server Seed Hash:</Label>
            <Input id="serverSeedHash" value={serverSeedHash} readOnly />
          </div>
          <div>
            <Label htmlFor="clientSeed">Client Seed (optional):</Label>
            <Input
              id="clientSeed"
              value={clientSeed}
              onChange={(e) => setClientSeed(e.target.value)}
              placeholder="Enter any text as your seed"
            />
          </div>
          <Button onClick={handleRollDice} className="w-full">
            Roll Dice
          </Button>
          {diceResult && (
            <div className="text-center">
              <Label>Dice Result:</Label>
              <p className="text-4xl font-bold">{diceResult}</p>
              <p>{(diceResult / 6) * 100 <= winChance ? "You won!" : "You lost."}</p>
              <p className="text-sm mt-2">Roll ID: {rollId}</p>
            </div>
          )}
          <Button onClick={handleEndGame} className="w-full">
            End Game
          </Button>
        </CardContent>
      </Card>
      <BetFeed bets={betHistory} currentUser={currentUser} />
    </div>
  );
};

export default Game;