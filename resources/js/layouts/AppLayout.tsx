import React, { ReactNode } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AppNavMenu from '../components/NavMenu';

interface Props {
  children: ReactNode;
}

const AppLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
        <AppNavMenu />
        <main className="p-4">{children}</main>
      <Footer />
    </>
  );
};

export default AppLayout;
