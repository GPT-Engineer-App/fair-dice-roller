import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateServerSeed, hashServerSeed, generateDiceRoll } from "@/lib/provablyFair";

const Game = () => {
  const navigate = useNavigate();
  const [serverSeed, setServerSeed] = useState("");
  const [serverSeedHash, setServerSeedHash] = useState("");
  const [clientSeed, setClientSeed] = useState("");
  const [diceResult, setDiceResult] = useState(null);

  useEffect(() => {
    const newServerSeed = generateServerSeed();
    setServerSeed(newServerSeed);
    setServerSeedHash(hashServerSeed(newServerSeed));
  }, []);

  const handleRollDice = () => {
    if (!clientSeed) {
      alert("Please enter a client seed");
      return;
    }
    const result = generateDiceRoll(serverSeed, clientSeed);
    setDiceResult(result);
  };

  const handleEndGame = () => {
    navigate("/verification", { state: { serverSeed, serverSeedHash } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Provably Fair Dice Game</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="serverSeedHash">Server Seed Hash:</Label>
            <Input id="serverSeedHash" value={serverSeedHash} readOnly />
          </div>
          <div>
            <Label htmlFor="clientSeed">Enter your seed:</Label>
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
            </div>
          )}
          <Button onClick={handleEndGame} className="w-full">
            End Game
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Game;