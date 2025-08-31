import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFlow } from "@/hooks/use-flow";

const Navigation = () => {
  const location = useLocation();
  const { currentUser, login, logout, loggedIn } = useFlow();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/issue", label: "Issue Certificate" },
    { path: "/verify", label: "Verify Certificate" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          CertChain
        </Link>
        
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          
          {loggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {currentUser?.addr?.slice(0, 6)}...{currentUser?.addr?.slice(-4)}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                Disconnect
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={login}>
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;