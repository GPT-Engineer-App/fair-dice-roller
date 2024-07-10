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
            Welcome to the Provably Fair Dice Game! Click 'Start Game' to begin.
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