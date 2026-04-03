import './index.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Member from './pages/Member.jsx'
import Celebrations from './pages/Celebrations.jsx'
import AddMember from './pages/AddMember.jsx'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/home" element={<Home />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/login" element={<div className="p-6">Login page coming soon.</div>} />
				<Route path="/add-member" element={<AddMember />} />
				<Route path="/celebrations" element={<Celebrations />} />
				<Route path="/members" element={<Member />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App;
