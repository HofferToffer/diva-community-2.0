import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import DivaRun from "./pages/DivaRun";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import CheckoutReturn from "./pages/CheckoutReturn";
import Blog from "./pages/Blog";
import Recrete from "./pages/Recrete";
import BlogPost1 from "./pages/BlogPost1";
import BlogPost2 from "./pages/BlogPost2";
import BlogPost3 from "./pages/BlogPost3";
import BlogPost4 from "./pages/BlogPost4";
import BlogPost5 from "./pages/BlogPost5";
import BlogPost6 from "./pages/BlogPost6";
import BlogPost7 from "./pages/BlogPost7";
import BlogPost8 from "./pages/BlogPost8";
import BlogPost9 from "./pages/BlogPost9";
import BlogPost10 from "./pages/BlogPost10";
import BlogPost11 from "./pages/BlogPost11";
import CommunityApp from "./pages/CommunityApp";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/diva-run" element={<DivaRun />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:slug" element={<Product />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/return" element={<CheckoutReturn />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/recrete" element={<Recrete />} />
          <Route path="/blog/v-jemnosti-je-nasa-sila" element={<BlogPost1 />} />
          <Route path="/blog/odvaha" element={<BlogPost2 />} />
          <Route path="/blog/girl" element={<BlogPost3 />} />
          <Route path="/blog/kreta" element={<BlogPost4 />} />
          <Route path="/blog/mudrost-zenskeho-tela" element={<BlogPost5 />} />
          <Route path="/blog/prijatie" element={<BlogPost6 />} />
          <Route path="/blog/dovolit-si" element={<BlogPost7 />} />
          <Route path="/blog/cyklus" element={<BlogPost8 />} />
          <Route path="/blog/15-rocny-sen" element={<BlogPost9 />} />
          <Route path="/blog/predstavte-si-zenu" element={<BlogPost10 />} />
          <Route path="/blog/moja-cesta-hlbsie-k-sebe" element={<BlogPost11 />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/community/*" element={<CommunityApp />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
