// ---------------------------------------------------------------------------
//  GestiPerso UI kit — the only building blocks pages should need.
// ---------------------------------------------------------------------------
export { default as PageHeader } from './PageHeader'
export { default as StatCard } from './StatCard'
export { default as SectionCard } from './SectionCard'
export { default as TableCard } from './TableCard'
export { default as Avatar } from './Avatar'
export { default as StatusBadge, toneForStatus, labelForStatus } from './StatusBadge'
export { Toolbar, SearchInput } from './Toolbar'
export { default as Pagination, buildPageList } from './Pagination'
export { LoadingState, ErrorState, EmptyState, AsyncState, InlineAlert } from './States'
export { default as ConfirmProvider, useConfirm } from './ConfirmProvider'
export { default as ToastStack } from './ToastStack'
