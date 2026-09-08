'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import { apiFetch } from '../../lib/api';

function DashboardInner() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch('/admin/stats');
        setStats(data);
      } catch (err) {
        setError(err.message);
      }
    }
    load();
  }, []);

  if (error) {
    return <p className="max-w-3xl mx-auto px-6 py-10 text-sm text-red-700">{error}</p>;
  }
  if (!stats) {
    return <div className="py-24 text-center text-sm text-ink/50">Loading…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-xl font-medium mb-8">Overview</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total applications" value={stats.totalApplications} />
        <StatCard label="Pending" value={stats.pendingApplications} />
        <StatCard label="Approved affiliates" value={stats.approvedAffiliates} />
        <StatCard label="Rejected" value={stats.rejectedApplications} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <DashboardInner />
    </ProtectedRoute>
  );
}
