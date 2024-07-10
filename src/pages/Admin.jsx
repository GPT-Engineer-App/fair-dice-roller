import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Admin = () => {
  const [loggedInUsers, setLoggedInUsers] = useState(0);
  const [profitLossData, setProfitLossData] = useState([]);
  const [totalWagered, setTotalWagered] = useState(0);
  const [cashOutRequests, setCashOutRequests] = useState(0);
  const [houseEdge, setHouseEdge] = useState(1); // Default house edge of 1%

  useEffect(() => {
    // Simulating data fetching
    setLoggedInUsers(Math.floor(Math.random() * 100));
    setTotalWagered(Math.floor(Math.random() * 10000));
    setCashOutRequests(Math.floor(Math.random() * 50));

    // Generate mock data for profit/loss graph
    const mockData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      profit: Math.random() * 1000 - 500,
    }));
    setProfitLossData(mockData);
  }, []);

  const handleHouseEdgeChange = (e) => {
    const newEdge = parseFloat(e.target.value);
    if (!isNaN(newEdge) && newEdge >= 0 && newEdge <= 100) {
      setHouseEdge(newEdge);
    }
  };

  const updateHouseEdge = () => {
    // Here you would typically update the house edge in your backend
    console.log(`House edge updated to ${houseEdge}%`);
    // You might want to show a success message to the admin
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Logged-in Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{loggedInUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Wagered Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">${totalWagered.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cash-out Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{cashOutRequests}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>House Edge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={houseEdge}
                onChange={handleHouseEdgeChange}
                min="0"
                max="100"
                step="0.1"
                className="w-24"
              />
              <Label>%</Label>
              <Button onClick={updateHouseEdge}>Update</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Profit/Loss for the Day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profitLossData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="profit" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;