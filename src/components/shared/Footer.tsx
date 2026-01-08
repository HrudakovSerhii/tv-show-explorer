import React, { Suspense } from 'react';

import FooterCurrentDate from '@/components/shared/FooterCurrentDate';

const Footer: React.FC = () => {
  return (
    <footer className="border-border bg-background-input mt-400 w-full border-t">
      <div className="mx-auto flex max-w-[960px] flex-col gap-200 px-250 py-200 text-center">
        <div className="flex flex-wrap items-center justify-center gap-200">
          <a
            className="text-text-subtle hover:text-text-brand dark:hover:text-icon-accent-blue min-w-40 text-base leading-normal font-normal transition-colors"
            href="https://www.linkedin.com/in/serhii-hrudakov/"
          >
            Who did this?
          </a>
          <a
            className="text-text-subtle hover:text-text-brand dark:hover:text-icon-accent-blue min-w-40 text-base leading-normal font-normal transition-colors"
            href="https://github.com/HrudakovSerhii/tv-show-explorer"
          >
            Where this is stored?
          </a>
        </div>
        <Suspense fallback={<span>...</span>}>
          <FooterCurrentDate />
        </Suspense>
      </div>
    </footer>
  );
};

export default Footer;
