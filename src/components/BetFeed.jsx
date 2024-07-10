import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BetFeed = ({ bets, currentUser }) => {
  const [selectedBet, setSelectedBet] = useState(null);
  const [filter, setFilter] = useState("all");

  const filteredBets = filter === "user" ? bets.filter(bet => bet.username === currentUser) : bets;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Recent Bets</CardTitle>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter bets" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bets</SelectItem>
            <SelectItem value="user">My Bets</SelectItem>
          </SelectContent>
        </Select>
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
            {filteredBets.map((bet) => (
              <TableRow key={bet.rollId}>
                <TableCell>{bet.username}</TableCell>
                <TableCell>{bet.winChance}%</TableCell>
                <TableCell>{bet.wager.toFixed(2)}</TableCell>
                <TableCell>{bet.result}</TableCell>
                <TableCell>{bet.payout.toFixed(2)}</TableCell>
                <TableCell className="font-mono text-xs">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => setSelectedBet(bet)}
                      >
                        {bet.rollId}
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Bet Details</DialogTitle>
                      </DialogHeader>
                      {selectedBet && (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">Username:</span>
                            <span className="col-span-3">{selectedBet.username}</span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">Wager:</span>
                            <span className="col-span-3">{selectedBet.wager.toFixed(2)}</span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">Chance:</span>
                            <span className="col-span-3">{selectedBet.winChance}%</span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">Result:</span>
                            <span className="col-span-3">{selectedBet.result}</span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">Payout:</span>
                            <span className="col-span-3">{selectedBet.payout.toFixed(2)}</span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">Bet ID:</span>
                            <span className="col-span-3">{selectedBet.rollId}</span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold col-span-4">Result Slider:</span>
                            <Slider
                              className="col-span-4"
                              value={[selectedBet.result]}
                              max={100}
                              step={1}
                              disabled
                            />
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BetFeed;