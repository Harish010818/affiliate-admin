'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Navbar from '../../../components/Navbar';
import StatusBadge from '../../../components/StatusBadge';
import { apiFetch } from '../../../lib/api';

const DETAIL_FIELDS = [
  { key: 'fullName', label: 'Full name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone number' },
  { key: 'company', label: 'Company / organization' },
  { key: 'website', label: 'Website or social media' },
  { key: 'industry', label: 'Industry / category' },
  { key: 'audienceSize', label: 'Audience size' },
  { key: 'reason', label: 'Reason for joining' },
];


const ACTIONABLE_STATUSES = ['submitted', 'under_review', 'changes_requested'];

function ApplicationDetailInner() {
  const { id } = useParams();
  const router = useRouter();
  const [application, setApplication] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [changesNote, setChangesNote] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showChangesForm, setShowChangesForm] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch(`/admin/applications/${id}`);
      setApplication(data.application);
      setHistory(data.history);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(body) {
    setError('');
    setNotice('');
    setActionLoading(true);
    try {
      await apiFetch(`/admin/applications/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      setNotice('Updated.');
      setShowRejectForm(false);
      setShowChangesForm(false);
      setRejectReason('');
      setChangesNote('');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return <div className="py-24 text-center text-sm text-ink/50">Loading…</div>;
  }
  if (error && !application) {
    return <p className="max-w-2xl mx-auto px-6 py-10 text-sm text-red-700">{error}</p>;
  }

  const canAct = ACTIONABLE_STATUSES.includes(application.status);

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <button onClick={() => router.push('/applications')} className="text-sm text-ink/50 hover:text-ink mb-4">
        ← Back to applications
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">{application.fullName || application.user?.name}</h1>
        <StatusBadge status={application.status} />
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</p>
      )}
      {notice && (
        <p className="mb-4 text-sm text-brand-700 bg-brand-50 border border-brand-100 rounded-md px-3 py-2">
          {notice}
        </p>
      )}

      <div className="space-y-4 mb-8">
        {DETAIL_FIELDS.map((field) => (
          <div key={field.key}>
            <div className="text-xs text-ink/40 mb-0.5">{field.label}</div>
            <div className="text-sm text-ink">{application[field.key] || '—'}</div>
          </div>
        ))}
      </div>

      {application.rejectionReason && (
        <div className="mb-6 rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
          <span className="font-medium">Rejection reason: </span>
          {application.rejectionReason}
        </div>
      )}
      {application.changeRequestNote && (
        <div className="mb-6 rounded-md border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-800">
          <span className="font-medium">Changes requested: </span>
          {application.changeRequestNote}
        </div>
      )}

      {canAct && (
        <div className="border-t border-ink/10 pt-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => updateStatus({ status: 'approved' })}
              disabled={actionLoading}
              className="rounded-md bg-brand-600 text-white px-4 py-2 text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => {
                setShowRejectForm((v) => !v);
                setShowChangesForm(false);
              }}
              className="rounded-md border border-red-200 text-red-700 px-4 py-2 text-sm font-medium hover:bg-red-50"
            >
              Reject
            </button>
            <button
              onClick={() => {
                setShowChangesForm((v) => !v);
                setShowRejectForm(false);
              }}
              className="rounded-md border border-orange-200 text-orange-700 px-4 py-2 text-sm font-medium hover:bg-orange-50"
            >
              Request changes
            </button>
          </div>

          {showRejectForm && (
            <div className="space-y-2">
              <textarea
                placeholder="Reason for rejection"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              />
              <button
                onClick={() => updateStatus({ status: 'rejected', reason: rejectReason })}
                disabled={actionLoading || !rejectReason.trim()}
                className="rounded-md bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                Confirm rejection
              </button>
            </div>
          )}

          {showChangesForm && (
            <div className="space-y-2">
              <textarea
                placeholder="What should the applicant change?"
                value={changesNote}
                onChange={(e) => setChangesNote(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button
                onClick={() => updateStatus({ status: 'changes_requested', note: changesNote })}
                disabled={actionLoading || !changesNote.trim()}
                className="rounded-md bg-orange-600 text-white px-4 py-2 text-sm font-medium hover:bg-orange-700 disabled:opacity-50"
              >
                Send change request
              </button>
            </div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-medium text-ink/70 mb-3">Activity history</h2>
          <ul className="space-y-2">
            {history.map((item) => (
              <li key={item._id} className="text-sm text-ink/60 border-l-2 border-ink/10 pl-3">
                <span className="text-ink/40">
                  {new Date(item.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })} —{' '}
                </span>
                {item.note || item.action}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ApplicationDetailPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <ApplicationDetailInner />
    </ProtectedRoute>
  );
}
