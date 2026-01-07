'use client';

import React from 'react';

const FooterCurrentDate: React.FC = () => {
  return (
    <p className="text-sm leading-normal font-normal text-[#616f89] dark:text-gray-500">
      © {new Date().getFullYear()} TV Show Explorer. With help of TV-Maze :).
    </p>
  );
};

export default FooterCurrentDate;
