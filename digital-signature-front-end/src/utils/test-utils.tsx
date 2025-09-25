import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { BrowserRouter } from 'react-router-dom';
import { makeStore } from '@/app/store';

// Custom render method that includes Redux provider
const customRender = (
  ui: ReactElement,
  {
    preloadedState = {},
    store = makeStore(preloadedState),
    ...renderOptions
  } = {}
) => {
  const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <Provider store={store}>
        <ThemeProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
  };

  return {
    store,
    ...render(ui, { wrapper: AllProviders, ...renderOptions }),
  };
};

// Re-export everything
export * from '@testing-library/react';
// Override render method
export { customRender as render };