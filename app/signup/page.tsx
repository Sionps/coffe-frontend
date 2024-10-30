'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import config from "../config";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        username: username,
        password: password,
      };
      const res = await axios.post(config.apiServer + "/api/user/signIn", payload);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("next_name", res.data.name);
        localStorage.setItem("next_user_id", res.data.id);

        Swal.fire({
          title: "Login Successful",
          text: `Welcome, ${res.data.name}`,
          icon: "success",
        }).then(() => {
          router.push("/dashboard");
        });
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        Swal.fire({
          title: "Invalid Credentials",
          text: "Please check your username or password",
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: error.message || "Something went wrong!",
          icon: "error",
        });
      }
    }
  };

  return (
<div 
  className="w-full min-h-screen flex items-center justify-center bg-cover bg-center" 
  style={{ backgroundImage: `url('/3.jpg')` }}
>
  <div className="bg-white bg-opacity-100 p-12 rounded-xl shadow-2xl w-[400px]">
    <form onSubmit={handleSignIn} className="mx-auto grid gap-6">
      <div className="grid gap-4 text-center">
        <h1 className="text-4xl font-bold">Login</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="username" className="text-lg">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="p-3 text-lg"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password" className="text-lg">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 text-lg"
          />
        </div>
        <Button type="submit" className="w-full py-3 text-lg">
          Login
        </Button>
      </div>
    </form>
  </div>
</div>
  );
}
