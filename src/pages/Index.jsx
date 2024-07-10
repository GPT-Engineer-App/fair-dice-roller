import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate("/game");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Provably Fair Dice Game</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            Welcome to the Provably Fair Dice Game! Here's how to play:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Set your wager amount</li>
            <li>Choose your winning chance</li>
            <li>Enter a client seed (or use the default)</li>
            <li>Click "Roll Dice" to play</li>
          </ol>
          <p className="text-sm">
            Our game uses a provably fair system to ensure transparency. The server seed is hashed and shown before each game, and you can verify the fairness after the game ends.
          </p>
          <Button onClick={handleStartGame} className="w-full">
            Start Game
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;