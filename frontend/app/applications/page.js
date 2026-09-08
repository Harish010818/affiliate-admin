'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import { apiFetch } from '../../lib/api';

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under review' },
  { value: 'changes_requested', label: 'Changes requested' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

function ApplicationsInner() {
  const [status, setStatus] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const query = status ? `?status=${status}` : '';
        const data = await apiFetch(`/admin/applications${query}`);
        setApplications(data.applications);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [status]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-xl font-medium mb-6">Applications</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={`px-3 py-1.5 rounded-md text-sm ${
              status === tab.value ? 'bg-ink text-white' : 'bg-ink/5 text-ink/70 hover:bg-ink/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}

      {loading ? (
        <div className="py-16 text-center text-sm text-ink/50">Loading…</div>
      ) : applications.length === 0 ? (
        <div className="py-16 text-center text-sm text-ink/50">No applications here.</div>
      ) : (
        <div className="border border-ink/10 rounded-lg overflow-hidden divide-y divide-ink/10">
          {applications.map((app) => (
            <Link
              key={app._id}
              href={`/applications/${app._id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-ink/5"
            >
              <div>
                <div className="text-sm font-medium">{app.fullName || app.user?.name}</div>
                <div className="text-xs text-ink/50">{app.email || app.user?.email}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-ink/40">
                  {app.submittedAt
                    ? new Date(app.submittedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })
                    : '—'}
                </span>
                <StatusBadge status={app.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <ApplicationsInner />
    </ProtectedRoute>
  );
}
