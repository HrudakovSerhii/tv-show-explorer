import React from 'react';

export type ShowLayoutProps = {
  children: React.ReactNode;
};

export default function ShowLayout({ children }: ShowLayoutProps) {
  return (
    <section>
      <span>Show Layout</span>
      {children}
    </section>
  );
}
