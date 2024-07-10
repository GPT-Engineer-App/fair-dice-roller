import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const BetFeed = ({ bets }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bets</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Chance</TableHead>
              <TableHead>Wager</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Payout</TableHead>
              <TableHead>Bet ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bets.map((bet) => (
              <TableRow key={bet.rollId}>
                <TableCell>{bet.username}</TableCell>
                <TableCell>{bet.winChance}%</TableCell>
                <TableCell>{bet.wager.toFixed(2)}</TableCell>
                <TableCell>{bet.result}</TableCell>
                <TableCell>{bet.payout.toFixed(2)}</TableCell>
                <TableCell className="font-mono text-xs">{bet.rollId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BetFeed;