import { useAuth } from "../hooks/useAuth";
import Input from "../components/Input";
import Button from "../components/Button";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { loginMutation } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    
    const handleLogin = () => {
        loginMutation.mutate(form, {
            onSuccess: (res: any) => {
                localStorage.setItem("user", JSON.stringify(res.data.user));
                navigate("/dashboard");
            }
        });
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="w-96 bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-bold mb-4">Login</h2>

                <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })}
                />

                <Input
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, password: e.target.value })}
                />

                <Button
                    onClick={() => handleLogin()}
                    style={{ width: '100%', marginTop: '1rem' }}
                >
                    Login
                </Button>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Don't have an account? <a href="/register" className="text-blue-600">Register</a>
                </p>
            </div>
        </div>
    );
}
