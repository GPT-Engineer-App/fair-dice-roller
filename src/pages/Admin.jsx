import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Admin = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">Welcome to the Admin Dashboard. This page is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;