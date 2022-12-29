import styles from "./App.module.css"

import { Route, Link, Routes } from "react-router-dom"
import HomePage from "./pages"
import OtherPage from "./pages/others"
import FibonacciPage from "./pages/fib"

function App() {
  return (
    <div className={styles.root}>
      <header>
        <h1>Find your fibonacci number</h1>
        <div className={styles.navigation}>
          <Link to="/">Home</Link>
          <span>|</span>
          <Link to="/fib">Fibonacci Page</Link>
          <span>|</span>
          <Link to="/other">Other Page</Link>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/fib" element={<FibonacciPage />} />
        <Route path="/other" element={<OtherPage />} />
      </Routes>
    </div>
  )
}

export default App
