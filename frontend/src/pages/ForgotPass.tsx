import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(username, name, email, password)
      navigate('/login')
    } catch (err) {
      setError('Registrasi gagal, silahkan coba lagi.')
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit}>
        <Card className="w-87.5">
          <h1 className="text-2xl font-bold text-center text-green-600">Circle</h1>
          <CardHeader>
            <CardTitle>Create Account Circle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Input
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              name="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" className="w-full bg-green-600">
              Register
            </Button>

            <h3 className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="text-green-500 hover:underline">Login</a>
            </h3>

          </CardContent>
        </Card>
      </form>
    </div>
  )
}