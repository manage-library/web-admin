import { CFooter } from '@coreui/react'
import React from 'react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        {/* <span>hieu.nguyenngoc</span> */}
        <span className="ms-1">&copy; 2022 KMA.</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
