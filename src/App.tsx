import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import RiddleList from './pages/RiddleList'
import RiddleDetail from './pages/RiddleDetail'
import Profile from './pages/Profile'

function App() {
  return (
    <Router>
      <div>
        <h1>Test: If you see this, the app is rendering!</h1>
        <Navbar />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/riddles" element={<RiddleList />} />
            <Route path="/riddles/:id" element={<RiddleDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
