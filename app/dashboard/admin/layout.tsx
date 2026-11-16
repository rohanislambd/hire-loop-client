import { requireRole } from '@/lib/core/serversession';
import React from 'react';

const AdminDashboardLayout = async({children}:{children: React.ReactNode}) => {

    await requireRole("admin")
    return children;
      
  
};

export default AdminDashboardLayout;