import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import UICloseButton from '../ui/CloseButton'
import { Alert as UIAlert } from '../ui/Alert'
import { Badge as UIBadge } from '../ui/Badge'
import { Button as UIButton } from '../ui/Button'
import { Card as UICard, CardBody as UICardBody, CardFooter as UICardFooter, CardGroup as UICardGroup, CardHeader as UICardHeader, CardSubtitle as UICardSubtitle, CardText as UICardText, CardTitle as UICardTitle } from '../ui/Card'
import { Form as UIForm, FormCheck as UIFormCheck, FormFeedback as UIFormFeedback, FormInput as UIFormInput, FormLabel as UIFormLabel, FormSelect as UIFormSelect, FormTextarea as UIFormTextarea, InputGroup as UIInputGroup, InputGroupText as UIInputGroupText } from '../ui/Form'
import { Col as UICol, Container as UIContainer, Row as UIRow } from '../ui/Grid'
import { ListGroup as UIListGroup, ListGroupItem as UIListGroupItem } from '../ui/ListGroup'
import { Modal as UIModal, ModalBody as UIModalBody, ModalFooter as UIModalFooter, ModalHeader as UIModalHeader, ModalTitle as UIModalTitle } from '../ui/Modal'
import { Pagination as UIPagination, PaginationItem as UIPaginationItem } from '../ui/Pagination'
import Spinner from '../ui/Spinner'
import { Table as UITable, TableBody as UITableBody, TableDataCell as UITableDataCell, TableHead as UITableHead, TableHeaderCell as UITableHeaderCell, TableRow as UITableRow } from '../ui/Table'
const cx = (...p) => p.filter(Boolean).join(' ')
export const CContainer = UIContainer
export const CRow = UIRow
export const CCol = UICol
export const CCard = UICard
export const CCardHeader = UICardHeader
export const CCardBody = UICardBody
export const CCardFooter = UICardFooter
export const CCardGroup = UICardGroup
export const CCardTitle = UICardTitle
export const CCardSubtitle = UICardSubtitle
export const CCardText = UICardText
export const CCloseButton = UICloseButton
export const CForm = UIForm
export const CFormLabel = UIFormLabel
export const CFormInput = UIFormInput
export const CFormTextarea = UIFormTextarea
export const CFormSelect = UIFormSelect
export const CFormCheck = UIFormCheck
export const CInputGroup = UIInputGroup
export const CInputGroupText = UIInputGroupText
export const CTable = UITable
export const CTableHead = UITableHead
export const CTableBody = UITableBody
export const CTableRow = UITableRow
export const CTableHeaderCell = UITableHeaderCell
export const CTableDataCell = UITableDataCell
export const CListGroup = UIListGroup
export const CListGroupItem = UIListGroupItem
export const CPagination = UIPagination
export const CPaginationItem = UIPaginationItem
export const CModal = UIModal
export const CModalHeader = UIModalHeader
export const CModalTitle = UIModalTitle
export const CModalBody = UIModalBody
export const CModalFooter = UIModalFooter
export const CButton = forwardRef(function CButton({ children, className='', color='primary', variant, size, shape, active, disabled, href, to, ...rest }, ref) {
  const v = variant === 'outline' ? 'outline' : variant === 'ghost' ? 'ghost' : 'solid'
  return <UIButton ref={ref} className={className} color={color} variant={v} size={size} shape={shape==='rounded-pill'?'pill':shape} active={active} disabled={disabled} href={href} to={to} {...rest}>{children}</UIButton>
})
export const CBadge = forwardRef(function CBadge({ children, className='', color='primary', shape, ...rest }, ref) {
  return <UIBadge ref={ref} className={className} color={color} shape={shape} {...rest}>{children}</UIBadge>
})
export const CAlert = forwardRef(function CAlert({ children, className='', color='primary', dismissible, visible, onClose, ...rest }, ref) {
  return <div ref={ref}><UIAlert className={className} color={color} dismissible={dismissible} visible={visible} onClose={onClose} {...rest}>{children}</UIAlert></div>
})
export const CFormText = ({ children, className='', ...rest }) => <div className={cx('form-text', className)} {...rest}>{children}</div>
export const CFormFeedback = ({ children, className='', invalid=true, valid, ...rest }) => <UIFormFeedback className={className} invalid={invalid} valid={valid} {...rest}>{children}</UIFormFeedback>
export const CSpinner = forwardRef(function CSpinner({ className='', color, size, variant='border', ...rest }, ref) {
  return <span ref={ref}><Spinner className={className} color={color} size={size} variant={variant} {...rest} /></span>
})
export const CBreadcrumb = ({ children, className='', ...rest }) => <nav aria-label="Fil d'Ariane" className={className} {...rest}><ol className="breadcrumb">{children}</ol></nav>
export const CBreadcrumbItem = ({ children, className='', active, ...rest }) => <li className={cx('breadcrumb-item', active?'active':null, className)} aria-current={active?'page':undefined} {...rest}>{children}</li>
export const CToast = ({ children, className='', ...rest }) => <div className={cx('gp-toast', className)} role="status" {...rest}>{children}</div>
export const CToastHeader = ({ children, className='', ...rest }) => <div className={cx('gp-toast__header', className)} {...rest}>{children}</div>
export const CToastBody = ({ children, className='', ...rest }) => <div className={cx('gp-toast__text', className)} {...rest}>{children}</div>
export const CToaster = ({ children, className='', placement, ...rest }) => <div className={cx('gp-toast-stack', className)} data-placement={placement} {...rest}>{children}</div>
CFormText.propTypes = { children: PropTypes.node, className: PropTypes.string }
