import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CAvatar,
  CButton,
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { AppSidebarNav } from './AppSidebarNav'
import logob from '../assets/images/logod.svg'

// sidebar nav config
import navigationU from '../_navU'


const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const navigate = useNavigate();

  return (
    <CSidebar
      className="border-end"
      colorScheme=""
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
      
       {/*  <CAvatar src={logobonheur} size="md"/> */}

        <CSidebarBrand to="/">
          <img customClassName="sidebar-brand-full" className='mx-3' src={logob} height={36} />
        </CSidebarBrand> 

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigationU} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
