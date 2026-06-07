import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Home from "../pages/Home"
import { useAuth } from "../hooks/useAuth"
import ThreadDetail from "@/pages/ThreadDetail"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  return <>{children}</>
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        {/* <Route path="*" element={<Navigate to="/login" />} /> */}
        <Route path="/thread/:id" element={
          <ProtectedRoute>
            <ThreadDetail />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}