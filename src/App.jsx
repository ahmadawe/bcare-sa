import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { supabase } from "./supabase";
import "./styles.css";

import { Home } from "./pages/Home/Home";
import { DataForm } from "./pages/DataForm/DataForm";
import { Offers } from "./pages/Offers/Offers";
import { PaymentMethod } from "./pages/PaymentMethod/PaymentMethod";
import { Payment } from "./pages/Payment/Payment";
import { Admin } from "./pages/Admin/Admin";
import { Success } from "./pages/Success/Success";
import Privacy from "./pages/Privacy/Privacy";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    const checkBan = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const userIp = data.ip;

        // Initial check
        const { data: banData } = await supabase
          .from('banned_ips')
          .select('*')
          .eq('ip', userIp);
        
        if (banData && banData.length > 0) {
          setIsBanned(true);
        }

        // Listen for new bans
        const channel = supabase
          .channel('public:banned_ips')
          .on(
            'postgres_changes',
            { event: 'INSERT', filter: `ip=eq.${userIp}`, schema: 'public', table: 'banned_ips' },
            () => setIsBanned(true)
          )
          .subscribe();

        return () => supabase.removeChannel(channel);
      } catch (err) {
        console.error("Ban check error:", err);
      }
    };
    checkBan();
  }, []);

  if (isBanned) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px', backgroundColor: '#f8fafc', fontFamily: 'Tajawal, sans-serif' }}>
        <div>
          <h1 style={{ color: '#ef4444', fontSize: '48px', marginBottom: '20px' }}>⚠️</h1>
          <h2 style={{ color: '#1e293b', marginBottom: '10px' }}>عذراً، لا يمكنك الوصول إلى هذا الموقع</h2>
          <p style={{ color: '#64748b' }}>لقد تم تقييد وصولك بسبب مخالفة سياسات الاستخدام. إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع الدعم الفني.</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dataform" element={<DataForm />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/payment-method" element={<PaymentMethod />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/success" element={<Success />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </Router>
  );
}
