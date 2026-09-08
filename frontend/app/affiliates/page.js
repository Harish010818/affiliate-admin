'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';
import { apiFetch } from '../../lib/api';

function formatCurrency(n) {
  return `₹${Number(n || 0).toLocaleString('en-IN')}`;
}

function AffiliatesInner() {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch('/admin/affiliates');
        setAffiliates(data.affiliates);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="py-24 text-center text-sm text-ink/50">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-xl font-medium mb-6">Affiliates</h1>

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}

      {affiliates.length === 0 ? (
        <div className="py-16 text-center text-sm text-ink/50">No approved affiliates yet.</div>
      ) : (
        <div className="border border-ink/10 rounded-lg overflow-hidden divide-y divide-ink/10">
          {affiliates.map(({ user, metrics }) => (
            <Link
              key={user._id}
              href={`/affiliates/${user._id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-ink/5"
            >
              <div>
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-ink/50">
                  {user.email} · {user.referralCode}
                </div>
              </div>
              <div className="text-xs text-ink/50 text-right">
                <div>
                  {metrics?.clicks ?? 0} clicks · {metrics?.conversions ?? 0} conversions
                </div>
                <div>{formatCurrency(metrics?.revenue)} revenue</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AffiliatesPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <AffiliatesInner />
    </ProtectedRoute>
  );
}
