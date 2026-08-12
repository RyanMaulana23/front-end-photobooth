import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/seo/Header';
import StatsCards from '../../features/admin/components/StatsCards';
import SessionList from '../../features/admin/components/SessionList';
import CustomerTable from '../../features/admin/components/CustomerTable';
import {
  useAdminProfile,
  useAdminSessions,
  useAdminCustomers,
  useAdminLogout,
  useAdminRealtimeSubscription,
} from '../../features/admin/hooks/useAdminData';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sessions'); // 'sessions' | 'customers'
  const [customerSearchEmail, setCustomerSearchEmail] = useState('');

  // Native Supabase Realtime WebSocket Listener (<1 second instant updates)
  useAdminRealtimeSubscription();

  // Check auth token
  const token = localStorage.getItem('admin_access_token');
  useEffect(() => {
    if (!token) {
      navigate('/auth/login');
    }
  }, [token, navigate]);

  // Queries
  const { data: profile, isLoading: isProfileLoading } = useAdminProfile();
  const { data: sessions = [], isLoading: isSessionsLoading } =
    useAdminSessions();
  const { data: customers = [], isLoading: isCustomersLoading } =
    useAdminCustomers(customerSearchEmail);

  // Logout Mutation
  const { mutate: logoutAdmin, isPending: isLoggingOut } = useAdminLogout();

  const handleLogout = () => {
    logoutAdmin(undefined, {
      onSettled: () => {
        navigate('/auth/login');
      },
    });
  };

  // Calculate total photos count
  const totalPhotos = sessions.reduce((acc, item) => {
    return acc + (item.photos?.length || 0);
  }, 0);

  const adminEmail = profile?.email || 'Admin Portal';
  const lastLoginFormatted = profile?.lastLogin
    ? new Date(profile.lastLogin).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Sesi Aktif';

  return (
    <>
      <Header title="Dashboard Admin | DSC Photobox" />
      <div className="min-h-svh bg-cream text-ink flex flex-col font-sans">
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-line px-4 sm:px-8 py-3.5 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Left: Brand Logo & Title */}
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="flex flex-col decoration-none select-none group"
              >
                <span className="text-xl sm:text-2xl font-bold font-display tracking-tight text-maroon group-hover:opacity-90 transition-opacity">
                  DSC Photobox
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[2.5px] text-terracotta font-semibold leading-none">
                  Admin Dashboard
                </span>
              </Link>
            </div>

            {/* Right: Profile Info & Logout Action */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end text-xs">
                <span className="font-bold text-ink flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {isProfileLoading ? 'Memuat...' : adminEmail}
                </span>
                <span className="text-[10px] text-[#7a7266] font-mono">
                  Login: {lastLoginFormatted}
                </span>
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-maroon/10 hover:bg-maroon text-maroon hover:text-white border border-maroon/20 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                title="Keluar dari akun admin"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden sm:inline">
                  {isLoggingOut ? 'Keluar...' : 'Keluar'}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-8">
          {/* Welcome Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-linear-to-r from-sidebar via-cream to-white border border-line shadow-xs">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-maroon m-0 tracking-tight">
                Ringkasan Pengelolaan Photobooth
              </h1>
              <p className="text-xs sm:text-sm text-[#7a7266] mt-1">
                Pantau seluruh sesi foto terambil, foto tersimpan, dan data
                pelanggan terintegrasi.
              </p>
            </div>
          </div>

          {/* Stats Widgets Overview */}
          <StatsCards
            totalSessions={sessions.length}
            totalCustomers={customers.length}
            totalPhotos={totalPhotos}
            isLoading={isSessionsLoading || isCustomersLoading}
          />

          {/* Tab Navigation & Data Section */}
          <div className="space-y-6">
            {/* Nav Tabs */}
            <div className="flex items-center gap-2 border-b border-line pb-px">
              <button
                onClick={() => setActiveTab('sessions')}
                className={`py-2.5 px-5 font-display font-bold text-sm rounded-t-xl transition-all cursor-pointer border-b-2 ${
                  activeTab === 'sessions'
                    ? 'border-terracotta text-terracotta bg-white/60 shadow-xs'
                    : 'border-transparent text-[#7a7266] hover:text-maroon hover:bg-white/30'
                }`}
              >
                📸 Sesi Foto ({sessions.length})
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                className={`py-2.5 px-5 font-display font-bold text-sm rounded-t-xl transition-all cursor-pointer border-b-2 ${
                  activeTab === 'customers'
                    ? 'border-terracotta text-terracotta bg-white/60 shadow-xs'
                    : 'border-transparent text-[#7a7266] hover:text-maroon hover:bg-white/30'
                }`}
              >
                👥 Data Pelanggan ({customers.length})
              </button>
            </div>

            {/* Tab Body */}
            <div>
              {activeTab === 'sessions' && (
                <SessionList
                  sessions={sessions}
                  customers={customers}
                  isLoading={isSessionsLoading}
                />
              )}

              {activeTab === 'customers' && (
                <CustomerTable
                  customers={customers}
                  isLoading={isCustomersLoading}
                  searchEmail={customerSearchEmail}
                  onSearchChange={(val) => setCustomerSearchEmail(val)}
                />
              )}
            </div>
          </div>
        </main>

        {/* Admin Footer */}
        <footer className="mt-auto border-t border-line py-4 px-6 text-center text-xs text-[#a79c8c] font-mono">
          DSC Photobox Admin Panel • Handcrafted for Developer Student Club
        </footer>
      </div>
    </>
  );
}
