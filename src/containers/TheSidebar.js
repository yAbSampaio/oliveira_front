import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CNavbarBrand,
  CImg,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

// sidebar nav config
import navigation from './_nav'

const TheSidebar = () => {
  const dispatch = useDispatch()
  const show = useSelector(state => state.sidebarShow)

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({type: 'set', sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        {/* <CIcon
          className="c-sidebar-brand-full"
          name="logo-negative"
          height={35}
        />
        <CIcon
          className="c-sidebar-brand-minimized"
          name="sygnet"
          height={35}
        /> */}

              <CImg
              className="c-sidebar-brand-full"
              style={{ width: "100%", height: "100%",border: '0.2px solid grey' }}
                src="https://cdn.discordapp.com/attachments/300483456440336385/788962643523665920/banner.png"
                //className="d-inline-block align-top"
                //alt="CoreuiVue"
              />
              <CImg
              className="c-sidebar-brand-minimized"
              style={{ width: "100%", height: "100%",border: '0.2px solid grey' }}
                src="https://cdn.discordapp.com/attachments/300483456440336385/788961555701563422/logo_icon.png"
                //className="d-inline-block align-top"
                //alt="CoreuiVue"
              />
      </CSidebarBrand>
      <CSidebarNav>

        <CCreateElement
          items={navigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none"/>
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
