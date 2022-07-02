import { CSpinner } from '@coreui/react'
import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useProfile } from 'src/hooks/useAdmin'
// routes config
import routes from '../routers/routes'

const AppContent = () => {
  const { data: user } = useProfile()

  return (
    <Suspense fallback={<CSpinner color="primary" />}>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            exact={route.exact}
            name={route.name}
            element={<route.element />}
          />
        ))}
        <Route path="*" element={<Navigate to="404" replace />} />
      </Routes>
    </Suspense>
  )
}

export default React.memo(AppContent)
