import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bitcoin, Coins } from "lucide-react";

const cryptocurrencies = [
  { name: "BTC", icon: <Bitcoin className="h-6 w-6" /> },
  { name: "ETH", icon: <Coins className="h-6 w-6" /> },
  { name: "LTC", icon: <Coins className="h-6 w-6" /> },
  { name: "DOGE", icon: <Coins className="h-6 w-6" /> },
  { name: "TRX", icon: <Coins className="h-6 w-6" /> },
];

const Wallet = () => {
  const [balances, setBalances] = useState({
    BTC: 0,
    ETH: 0,
    LTC: 0,
    DOGE: 0,
    TRX: 0,
  });

  const [depositAddresses, setDepositAddresses] = useState({
    BTC: "",
    ETH: "",
    LTC: "",
    DOGE: "",
    TRX: "",
  });

  const generateDepositAddress = (currency) => {
    // In a real application, this would call an API to generate a unique address
    const mockAddress = `${currency}${Math.random().toString(36).substring(2, 15)}`;
    setDepositAddresses((prev) => ({ ...prev, [currency]: mockAddress }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Wallet</h1>
      <Tabs defaultValue="BTC" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {cryptocurrencies.map((crypto) => (
            <TabsTrigger key={crypto.name} value={crypto.name} className="flex items-center gap-2">
              {crypto.icon}
              {crypto.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {cryptocurrencies.map((crypto) => (
          <TabsContent key={crypto.name} value={crypto.name}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {crypto.icon}
                  {crypto.name} Wallet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Balance</Label>
                  <p className="text-2xl font-bold">{balances[crypto.name]} {crypto.name}</p>
                </div>
                <div>
                  <Label htmlFor={`${crypto.name}-address`}>Deposit Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id={`${crypto.name}-address`}
                      value={depositAddresses[crypto.name]}
                      readOnly
                      placeholder="Generate an address to deposit"
                    />
                    <Button onClick={() => generateDepositAddress(crypto.name)}>
                      Generate
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Send only {crypto.name} to this deposit address. Sending any other coin may result in permanent loss.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Wallet;