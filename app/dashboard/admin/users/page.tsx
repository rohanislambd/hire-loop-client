import { getUsers } from '@/lib/api/users';
import React from 'react';

const AdminUserPage = async() => {

    const users = await getUsers()
    console.log('users', users);
    return (
        <div>
            admin user page
        </div>
    );
};

export default AdminUserPage;