'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Navbar from '../../../components/Navbar';
import { apiFetch } from '../../../lib/api';

const METRIC_FIELDS = [
  { key: 'clicks', label: 'Clicks' },
  { key: 'conversions', label: 'Conversions' },
  { key: 'revenue', label: 'Revenue (₹)' },
  { key: 'commissionEarned', label: 'Commission earned (₹)' },
];

const TARGET_FIELDS = [
  { key: 'monthlyClickTarget', label: 'Monthly click target' },
  { key: 'monthlyConversionTarget', label: 'Monthly conversion target' },
  { key: 'monthlyRevenueTarget', label: 'Monthly revenue target (₹)' },
];

function AffiliateDetailInner() {
  const { userId } = useParams();
  const router = useRouter();
  const [affiliate, setAffiliate] = useState(null);
  const [metricsForm, setMetricsForm] = useState({});
  const [targetsForm, setTargetsForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [savingMetrics, setSavingMetrics] = useState(false);
  const [savingTargets, setSavingTargets] = useState(false);


  const load = useCallback(async () => {
    try {
      const data = await apiFetch('/admin/affiliates');
      const found = data.affiliates.find((a) => a.user._id === userId);
      if (!found) throw new Error('Affiliate not found.');
      setAffiliate(found);
      setMetricsForm({
        clicks: found.metrics?.clicks ?? 0,
        conversions: found.metrics?.conversions ?? 0,
        revenue: found.metrics?.revenue ?? 0,
        commissionEarned: found.metrics?.commissionEarned ?? 0,
      });
      setTargetsForm({
        monthlyClickTarget: found.metrics?.targets?.monthlyClickTarget ?? 0,
        monthlyConversionTarget: found.metrics?.targets?.monthlyConversionTarget ?? 0,
        monthlyRevenueTarget: found.metrics?.targets?.monthlyRevenueTarget ?? 0,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  function updateMetricField(key) {
    return (e) => setMetricsForm((f) => ({ ...f, [key]: e.target.value }));
  }
  function updateTargetField(key) {
    return (e) => setTargetsForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function saveMetrics(e) {
    e.preventDefault();
    setError('');
    setNotice('');
    setSavingMetrics(true);
    try {
      await apiFetch(`/admin/affiliates/${userId}/metrics`, {
        method: 'PUT',
        body: JSON.stringify({
          clicks: Number(metricsForm.clicks),
          conversions: Number(metricsForm.conversions),
          revenue: Number(metricsForm.revenue),
          commissionEarned: Number(metricsForm.commissionEarned),
        }),
      });
      setNotice('Metrics updated.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingMetrics(false);
    }
  }

  async function saveTargets(e) {
    e.preventDefault();
    setError('');
    setNotice('');
    setSavingTargets(true);
    try {
      await apiFetch(`/admin/affiliates/${userId}/targets`, {
        method: 'PUT',
        body: JSON.stringify({
          monthlyClickTarget: Number(targetsForm.monthlyClickTarget),
          monthlyConversionTarget: Number(targetsForm.monthlyConversionTarget),
          monthlyRevenueTarget: Number(targetsForm.monthlyRevenueTarget),
        }),
      });
      setNotice('Targets updated.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingTargets(false);
    }
  }

  if (loading) return <div className="py-24 text-center text-sm text-ink/50">Loading…</div>;
  if (error && !affiliate) {
    return <p className="max-w-xl mx-auto px-6 py-10 text-sm text-red-700">{error}</p>;
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <button onClick={() => router.push('/affiliates')} className="text-sm text-ink/50 hover:text-ink mb-4">
        ← Back to affiliates
      </button>

      <h1 className="text-xl font-medium mb-1">{affiliate.user.name}</h1>
      <p className="text-sm text-ink/60 mb-8">
        {affiliate.user.email} · Referral code: {affiliate.user.referralCode}
      </p>

      {error && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>
      )}
      {notice && (
        <p className="mb-4 text-sm text-brand-700 bg-brand-50 border border-brand-100 rounded-md px-3 py-2">
          {notice}
        </p>
      )}

      <form onSubmit={saveMetrics} className="space-y-4 mb-10">
        <h2 className="text-sm font-medium text-ink/70">Performance metrics</h2>
        {METRIC_FIELDS.map((field) => (
          <div key={field.key}>
            <label className="block text-sm text-ink/70 mb-1">{field.label}</label>
            <input
              type="number"
              value={metricsForm[field.key]}
              onChange={updateMetricField(field.key)}
              className="w-full rounded-md border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={savingMetrics}
          className="rounded-md bg-brand-600 text-white px-4 py-2 text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
        >
          {savingMetrics ? 'Saving…' : 'Save metrics'}
        </button>
      </form>

      <form onSubmit={saveTargets} className="space-y-4">
        <h2 className="text-sm font-medium text-ink/70">Monthly targets</h2>
        {TARGET_FIELDS.map((field) => (
          <div key={field.key}>
            <label className="block text-sm text-ink/70 mb-1">{field.label}</label>
            <input
              type="number"
              value={targetsForm[field.key]}
              onChange={updateTargetField(field.key)}
              className="w-full rounded-md border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={savingTargets}
          className="rounded-md border border-ink/15 px-4 py-2 text-sm font-medium hover:bg-ink/5 disabled:opacity-50"
        >
          {savingTargets ? 'Saving…' : 'Save targets'}
        </button>
      </form>
    </div>
  );
}

export default function AffiliateDetailPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <AffiliateDetailInner />
    </ProtectedRoute>
  );
}
