import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    console.log({ email, password })
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[350px]">
        <h1 className="text-2xl font-bold text-center text-green-600">Circle</h1>
        <CardHeader>
          <CardTitle>Login to Circle</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full bg-green-600 " onClick={handleLogin}>
            Login
          </Button>
            <h3 className="text-center text-sm text-muted-foreground">
              Don't have an account? <a href="/register" className="text-green-500 hover:underline">Register</a>
            </h3>
        </CardContent>
      </Card>
    </div>
  )
}