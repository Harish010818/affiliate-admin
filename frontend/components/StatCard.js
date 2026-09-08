export default function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-ink/10 p-4">
      <div className="text-sm text-ink/60 mb-2">{label}</div>
      <div className="text-2xl font-medium">{value}</div>
    </div>
  );
}
