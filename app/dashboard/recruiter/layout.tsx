import { requireRole } from '@/lib/core/serversession';
import React from 'react';

const RecruiterDashboardLayout = async({children}:{children: React.ReactNode}) => {

    await requireRole("recruiter")
    return children;
      
  
};

export default RecruiterDashboardLayout;