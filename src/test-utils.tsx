import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  wrapper?: (props: { children: ReactNode }) => ReactElement;
}

function DefaultWrapper({ children }: { children: ReactNode }) {
  // For structural consistency
  return <>{children}</>;
}

export function render(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const Wrapper = options?.wrapper || DefaultWrapper;

  return rtlRender(ui, {
    wrapper: Wrapper,
    ...options,
  });
}

export * from '@testing-library/react';

export { default as userEvent } from '@testing-library/user-event';
