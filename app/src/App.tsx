import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import type { SiteData } from "./sitedata";
import { LightboxProvider } from "./components/Lightbox";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import Home from "./pages/Home";
import Weddings from "./pages/Weddings";
import Automobile from "./pages/Automobile";
import Pets from "./pages/Pets";

export default function App({ data }: { data: SiteData }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <LightboxProvider>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<Home data={data} />} />
        <Route path="/weddings" element={<Weddings data={data} />} />
        <Route path="/automobile" element={<Automobile data={data} />} />
        <Route path="/pets" element={<Pets data={data} />} />
        <Route path="*" element={<Home data={data} />} />
      </Routes>
      <SiteFooter />
    </LightboxProvider>
  );
}
