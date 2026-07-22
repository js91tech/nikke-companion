import { META_SOURCE } from '../data/metaSource'

export function MetaBadge({ className = '' }: { className?: string }) {
  return (
    <p className={`meta-badge fine-print ${className}`}>
      Meta snapshot {META_SOURCE.asOf} ·{' '}
      <a className="text-link" href={META_SOURCE.primary} target="_blank" rel="noreferrer">
        Prydwen
      </a>
      {' · '}
      <a className="text-link" href={META_SOURCE.anomaly} target="_blank" rel="noreferrer">
        AI guides
      </a>
    </p>
  )
}
