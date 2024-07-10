import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { CircleUser, Menu, Package2, Home, DollarSign, FileCheck, Settings, Wallet, UserPlus } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

const navItems = [
  { title: "Home", to: "/", icon: <Home className="h-4 w-4" /> },
  { title: "Game", to: "/game", icon: <DollarSign className="h-4 w-4" /> },
  { title: "Verification", to: "/verification", icon: <FileCheck className="h-4 w-4" /> },
  { title: "Admin", to: "/admin", icon: <Settings className="h-4 w-4" /> },
  { title: "Wallet", to: "/wallet", icon: <Wallet className="h-4 w-4" /> },
  { title: "Register", to: "/register", icon: <UserPlus className="h-4 w-4" /> },
];

const Layout = () => {
  const [balance, setBalance] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState("BTC");

  useEffect(() => {
    // Initialize balance from localStorage or set a default value
    const storedBalance = localStorage.getItem('userBalance');
    const storedCurrency = localStorage.getItem('selectedCurrency');
    if (storedBalance && storedCurrency) {
      setBalance(parseFloat(storedBalance));
      setSelectedCurrency(storedCurrency);
    } else {
      // Fetch initial balance from the wallet
      const initialBalances = JSON.parse(localStorage.getItem('cryptoBalances')) || {};
      const initialCurrency = Object.keys(initialBalances)[0] || "BTC";
      const initialBalance = initialBalances[initialCurrency] || 0;
      setBalance(parseFloat(initialBalance));
      setSelectedCurrency(initialCurrency);
      localStorage.setItem('userBalance', initialBalance.toString());
      localStorage.setItem('selectedCurrency', initialCurrency);
    }

    const handleBalanceUpdate = (event) => {
      if (event.detail) {
        setBalance(event.detail.balance);
        setSelectedCurrency(event.detail.currency);
        localStorage.setItem('userBalance', event.detail.balance.toString());
        localStorage.setItem('selectedCurrency', event.detail.currency);
      }
    };

    window.addEventListener('balanceUpdate', handleBalanceUpdate);

    return () => {
      window.removeEventListener('balanceUpdate', handleBalanceUpdate);
    };
  }, []);

  // Expose the balance to the window object for other components to use
  useEffect(() => {
    window.userBalance = balance;
    window.updateBalance = (newBalance, currency) => {
      setBalance(newBalance);
      setSelectedCurrency(currency);
      localStorage.setItem('userBalance', newBalance.toString());
      localStorage.setItem('selectedCurrency', currency);
    };
  }, [balance, selectedCurrency]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 justify-between">
        <DesktopNav />
        <MobileNav />
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Balance: {balance.toFixed(4)} {selectedCurrency}</span>
          <UserMenu />
        </div>
      </header>
      <main className="flex-grow overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

const DesktopNav = () => (
  <nav className="hidden md:flex md:items-center md:gap-5 lg:gap-6 text-lg font-medium md:text-sm">
    <NavItem
      to="/"
      className="flex items-center gap-2 text-lg font-semibold md:text-base"
    >
      <Package2 className="h-6 w-6" />
      <span className="">Dice Game</span>
    </NavItem>
    {navItems.map((item) => (
      <NavItem key={item.to} to={item.to}>
        {item.title}
      </NavItem>
    ))}
  </nav>
);

const MobileNav = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline" size="icon" className="shrink-0 md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <nav className="grid gap-6 text-lg font-medium">
        <NavItem
          to="/"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <Package2 className="h-6 w-6" />
          <span className="">Dice Game</span>
        </NavItem>
        {navItems.map((item) => (
          <NavItem key={item.to} to={item.to}>
            {item.icon}
            {item.title}
          </NavItem>
        ))}
      </nav>
    </SheetContent>
  </Sheet>
);

const UserMenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="secondary" size="icon" className="rounded-full">
        <CircleUser className="h-5 w-5" />
        <span className="sr-only">Toggle user menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Settings</DropdownMenuItem>
      <DropdownMenuItem>Support</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Logout</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const NavItem = ({ to, children, className }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "transition-colors",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
        className,
      )
    }
  >
    {children}
  </NavLink>
);

export default Layout;