// pages/admin.js
import '../app/globals.css'
// import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// import Navigation from './app/navigation';
import OrganizationPage from './OrganizationPage';
import { useRouter } from 'next/router';

const AdminPage = () => {
  const router = useRouter();
  const organizationName = router.query.organizationName;
  
  return (
    <div className="container mt-10">
      {/* <Navigation /> */}
      <OrganizationPage organizationName={organizationName}/>
    </div>
  );
};

export default AdminPage;
