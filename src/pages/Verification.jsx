import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { hashServerSeed } from "@/lib/provablyFair";

const Verification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { serverSeed, serverSeedHash } = location.state || {};

  const handleNewGame = () => {
    navigate("/");
  };

  const verifyHash = serverSeed && hashServerSeed(serverSeed) === serverSeedHash;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Original Server Seed:</Label>
            <p className="text-sm bg-muted p-2 rounded break-all">
              {serverSeed || "No server seed available"}
            </p>
          </div>
          <div>
            <Label>Server Seed Hash:</Label>
            <p className="text-sm bg-muted p-2 rounded break-all">
              {serverSeedHash || "No hash available"}
            </p>
          </div>
          <p className="text-sm">
            You can verify the fairness of the game by hashing the original server seed
            and comparing it with the hash provided at the start of the game.
          </p>
          {verifyHash !== undefined && (
            <p className={`text-sm font-bold ${verifyHash ? 'text-green-600' : 'text-red-600'}`}>
              {verifyHash ? 'Verification successful!' : 'Verification failed!'}
            </p>
          )}
          <Button onClick={handleNewGame} className="w-full">
            New Game
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Verification;