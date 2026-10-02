import React from 'react'
import PropTypes from 'prop-types'
import { Pagination as UIPagination, PaginationItem as UIPaginationItem } from '../../ui/Pagination'

// ---------------------------------------------------------------------------
//  Pagination — client-side pager used by the list screens.
//  Renders nothing when a single page is needed (less noise on small lists).
// ---------------------------------------------------------------------------

const range = (from, to) => {
  const pages = []
  for (let page = from; page <= to; page += 1) pages.push(page)
  return pages
}

/** Builds a compact page list: 1 … 4 5 [6] 7 8 … 20 */
export const buildPageList = (page, pageCount) => {
  if (pageCount <= 7) return range(1, pageCount)
  if (page <= 4) return [...range(1, 5), '…', pageCount]
  if (page >= pageCount - 3) return [1, '…', ...range(pageCount - 4, pageCount)]
  return [1, '…', page - 1, page, page + 1, '…', pageCount]
}

const Pagination = ({ page = 1, pageCount = 1, onChange, total, pageSize, className = '' }) => {
  const safeCount = Math.max(1, pageCount)
  const from = total ? (page - 1) * (pageSize || 0) + 1 : undefined
  const to = total && pageSize ? Math.min(page * pageSize, total) : undefined

  return (
    <div className={`gp-pagination ${className}`.trim()}>
      {total !== undefined && total !== null ? (
        <span className="gp-pagination__summary">
          {from && to ? `${from}–${to} sur ${total}` : `${total} élément${total > 1 ? 's' : ''}`}
        </span>
      ) : (
        <span />
      )}

      {safeCount > 1 ? (
        <UIPagination align="end" aria-label="Pagination" className="mb-0">
          <UIPaginationItem
            disabled={page <= 1}
            onClick={() => page > 1 && onChange?.(page - 1)}
            aria-label="Page précédente"
          >
            ‹
          </UIPaginationItem>

          {buildPageList(page, safeCount).map((item, index) =>
            item === '…' ? (
              <UIPaginationItem key={`gap-${index}`} disabled>
                …
              </UIPaginationItem>
            ) : (
              <UIPaginationItem
                key={item}
                active={item === page}
                onClick={() => onChange?.(item)}
                aria-current={item === page ? 'page' : undefined}
              >
                {item}
              </UIPaginationItem>
            ),
          )}

          <UIPaginationItem
            disabled={page >= safeCount}
            onClick={() => page < safeCount && onChange?.(page + 1)}
            aria-label="Page suivante"
          >
            ›
          </UIPaginationItem>
        </UIPagination>
      ) : null}
    </div>
  )
}

Pagination.propTypes = {
  page: PropTypes.number,
  pageCount: PropTypes.number,
  onChange: PropTypes.func,
  total: PropTypes.number,
  pageSize: PropTypes.number,
  className: PropTypes.string,
}

export default Pagination
