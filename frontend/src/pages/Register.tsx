import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = () => {
    console.log({ name, email, password })
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[350px]">
        <h1 className="text-2xl font-bold text-center text-green-600">Circle</h1>
        <CardHeader>
          <CardTitle>Create Account Circle</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

          <Button className="w-full bg-green-600" onClick={handleRegister}>
            Register
          </Button>
          <h3 className="text-center text-sm text-muted-foreground">
            Already have an account? <a href="/login" className="text-green-500 hover:underline">Login</a>
          </h3>
        </CardContent>
      </Card>
    </div>
  )
}