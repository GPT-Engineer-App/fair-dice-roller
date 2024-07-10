import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  const [wager, setWager] = useState(1); // Changed default to 1
  const [winChance, setWinChance] = useState(50);
  const [rollId, setRollId] = useState("");
  const [betHistory, setBetHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState("Player");
  const [selectedCurrency, setSelectedCurrency] = useState("BTC");
  const [balance, setBalance] = useState(0);
  const [betType, setBetType] = useState("over"); // New state for over/under decision
  const [targetNumber, setTargetNumber] = useState(3); // New state for target number
  const [desiredOdds, setDesiredOdds] = useState(2); // New state for desired odds

  useEffect(() => {
    generateNewServerSeed();
    loadBetHistory();
    const storedCurrency = localStorage.getItem('selectedCurrency') || "BTC";
    setSelectedCurrency(storedCurrency);
    updateBalance(storedCurrency);
  }, []);

  useEffect(() => {
    // Update win chance based on bet type and target number
    const newWinChance = betType === "over" ? ((6 - targetNumber) / 6) * 100 : (targetNumber / 6) * 100;
    setWinChance(newWinChance);
  }, [betType, targetNumber]);

  const updateBalance = (currency) => {
    const balances = JSON.parse(localStorage.getItem('cryptoBalances')) || {};
    setBalance(parseFloat(balances[currency] || 0));
  };

  const generateNewServerSeed = () => {
    const newServerSeed = generateServerSeed();
    setServerSeed(newServerSeed);
    setServerSeedHash(hashServerSeed(newServerSeed));
    setClientSeed(generateServerSeed());
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
    
    const newRollId = uuidv4();
    setRollId(newRollId);

    const win = betType === "over" ? result > targetNumber : result < targetNumber;
    const payout = win ? wager * desiredOdds : 0;
    
    const newBalance = balance - wager + payout;
    setBalance(newBalance);
    updateStoredBalance(newBalance);

    const newBet = saveWagerDetails(newRollId, wager, winChance, result, win, payout, betType, targetNumber);
    setBetHistory(prevHistory => [newBet, ...prevHistory]);

    generateNewServerSeed();
  };

  const updateStoredBalance = (newBalance) => {
    const balances = JSON.parse(localStorage.getItem('cryptoBalances')) || {};
    balances[selectedCurrency] = newBalance.toFixed(4);
    localStorage.setItem('cryptoBalances', JSON.stringify(balances));
    window.dispatchEvent(new CustomEvent('balanceUpdate', { 
      detail: { balance: newBalance, currency: selectedCurrency } 
    }));
  };

  const saveWagerDetails = (rollId, wager, winChance, result, win, payout, betType, targetNumber) => {
    const wagerDetails = {
      rollId,
      username: currentUser,
      wager,
      winChance,
      result,
      win,
      payout,
      betType,
      targetNumber,
      timestamp: new Date().toISOString()
    };

    const existingHistory = JSON.parse(localStorage.getItem('wagerHistory')) || [];
    const updatedHistory = [wagerDetails, ...existingHistory];
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
            <Label>Bet Type:</Label>
            <RadioGroup defaultValue="over" onValueChange={setBetType} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="over" id="over" />
                <Label htmlFor="over">Over</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="under" id="under" />
                <Label htmlFor="under">Under</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="targetNumber">Target Number:</Label>
            <Slider
              id="targetNumber"
              min={1}
              max={5}
              step={1}
              value={[targetNumber]}
              onValueChange={(value) => setTargetNumber(value[0])}
            />
            <div className="text-center mt-2">{targetNumber}</div>
          </div>
          <div>
            <Label htmlFor="desiredOdds">Desired Odds:</Label>
            <Input
              id="desiredOdds"
              type="number"
              value={desiredOdds}
              onChange={(e) => setDesiredOdds(Math.max(1, parseFloat(e.target.value)))}
              min="1"
              step="0.01"
            />
          </div>
          <div>
            <Label>Win Chance: {winChance.toFixed(2)}%</Label>
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
              <p>{(betType === "over" && diceResult > targetNumber) || (betType === "under" && diceResult < targetNumber) ? "You won!" : "You lost."}</p>
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