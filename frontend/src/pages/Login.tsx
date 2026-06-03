import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(identifier, password)
      navigate('/Home')
    } catch (err) {
      setError('Login gagal, silahkan coba lagi.')
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleLogin}>
        <Card className="w-87.5">
          <h1 className="text-2xl font-bold text-center text-green-600">Circle</h1>
          <CardHeader>
            <CardTitle>Login to Circle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Input
              placeholder="Email / Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" className="w-full bg-green-600">
              Login
            </Button>

            <h3 className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a href="/register" className="text-green-500 hover:underline">Register</a>
            </h3>

          </CardContent>
        </Card>
      </form>
    </div>
  )
}