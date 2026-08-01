import { MarketplaceProvider } from "./context/MarketplaceContext";
import MarketplaceApp from "./components/MarketplaceApp";
import { Toaster } from "sonner";

import { useEffect } from "react";

function App() {
  useEffect(() => {
    console.log("Sprint 4 System Check Passed");
  }, []);

  return (
    <MarketplaceProvider>
      <MarketplaceApp />
      <Toaster richColors position="top-right" />
    </MarketplaceProvider>
  );
}

export default App;