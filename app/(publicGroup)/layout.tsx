
import Footer from '@/components/shared/Footer';
import { Navbar } from '@/components/shared/Navbar';
import { getMe } from '@/service/getMe';
import React from 'react'

const PublicGroupLayout = async (
    { children }: { children: React.ReactNode }
) => {
    const user = await getMe();
    return (
        <>
        <Navbar user={user} />
            {children}
        <Footer />
        </>
    )
}

export default PublicGroupLayout