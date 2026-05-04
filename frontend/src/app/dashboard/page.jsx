import DashboardView from '@/modules/dashboard/DashboardView'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import React from 'react'

const page = () => {
  return (
    <ProtectedRoute>
      <div>
        <DashboardView/>
      </div>
    </ProtectedRoute>
  )
}

export default page;
