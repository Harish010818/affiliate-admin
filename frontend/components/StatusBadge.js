const STYLES = {
  draft: 'bg-ink/5 text-ink/60',
  submitted: 'bg-sky-50 text-sky-700',
  under_review: 'bg-amber-50 text-amber-700',
  changes_requested: 'bg-orange-50 text-orange-700',
  approved: 'bg-brand-100 text-brand-700',
  rejected: 'bg-red-50 text-red-700',
};

const LABELS = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under review',
  changes_requested: 'Changes requested',
  approved: 'Approved',
  rejected: 'Rejected',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
        STYLES[status] || 'bg-ink/5 text-ink/60'
      }`}
    >
      {LABELS[status] || status}
    </span>
  );
}
