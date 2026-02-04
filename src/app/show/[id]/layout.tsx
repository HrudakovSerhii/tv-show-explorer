import React from 'react';

export type ShowLayoutProps = {
  children: React.ReactNode;
};

export default function ShowLayout({ children }: ShowLayoutProps) {
  return (
    <div className="animate-fade-in mx-auto flex w-full flex-col">
      <main className="flex flex-wrap items-center gap-100">{children}</main>
    </div>
  );
}
