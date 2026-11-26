import { renderToString } from 'react-dom/server';
import { App } from './App';

export function renderAppHTML(): string {
  return renderToString(<App />);
}
