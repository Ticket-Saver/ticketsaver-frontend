import React, { ReactNode } from 'react';
import Header from '../components/Header'; // Assume you have a Header component
import Footer from '../components/Footer'; // Assume you have a Footer component

interface LayoutProps {
    children: ReactNode;
}

const LayoutHeaderFooter: React.FC<LayoutProps> = ({ children }) => (
    <div data-theme="synthwave">
        <Header />
        {children}
        <Footer />
    </div>
);

export default LayoutHeaderFooter;