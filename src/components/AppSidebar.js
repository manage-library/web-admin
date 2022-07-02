import { cilMenu } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CSidebar, CSidebarBrand, CSidebarNav } from '@coreui/react'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
// sidebar nav config
import navigation from '../routers/_nav'
import { AppSidebarNav } from './AppSidebarNav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const ref = useRef(0)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        if (ref.current) dispatch({ type: 'set', sidebarShow: visible })
        else ref.current += 1
      }}
    >
      <CSidebarBrand className="d-none d-md-flex p-3 position-relative" to="/">
        <div className="position-absolute">Quản lý sách</div>

        <CIcon
          icon={cilMenu}
          size="lg"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          className="cursor-pointer ms-auto"
        />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
