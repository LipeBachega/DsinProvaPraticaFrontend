import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Aqui o React é montado uma única vez no elemento `root` do HTML.
// O StrictMode ajuda a revelar efeitos colaterais durante o desenvolvimento.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
