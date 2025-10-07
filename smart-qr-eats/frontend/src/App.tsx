import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RestaurantProvider } from "./contexts/RestaurantContext";
import { SignupProvider } from "./contexts/SignupContext";
import { AuthProvider } from "./contexts/AuthContext";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Kitchen from "./pages/Kitchen";
import Admin from "./pages/Admin";
import AdminProfile from "./pages/AdminProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SignupProvider>
          <RestaurantProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/landing" element={<Landing />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Index />} />
                <Route path="/restaurant" element={<Index />} />
                <Route path="/menu" element={<Index />} />
                <Route path="/kitchen" element={<Kitchen />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/profile" element={<AdminProfile />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </RestaurantProvider>
        </SignupProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
