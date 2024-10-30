'use client';
import { Button } from "@/components/ui/button";
import { Home,  ShoppingCart  , Coffee} from "lucide-react";

const FooterNav = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <nav className="flex justify-around py-2 w-full">
        <Button variant="ghost" className="flex-1">
          <Home className="h-6 w-6" />
        </Button>
        <Button variant="ghost" className="flex-1">
          <Coffee className="h-6 w-6" />
        </Button>
        <Button variant="ghost" className="flex-1">
          <ShoppingCart className="h-6 w-6" />
        </Button>
      </nav>
    </footer>
  );
};

export default FooterNav;
