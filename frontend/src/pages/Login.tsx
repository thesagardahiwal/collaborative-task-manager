import { useAuth } from "../hooks/useAuth";
import Input from "../components/Input";
import Button from "../components/Button";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";

export default function Login() {
    const { loginMutation } = useAuth();
    const { updateUser } = useAuthContext();
    const [form, setForm] = useState({ 
        email: "", 
        password: "" 
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!form.email || !form.password) {
            setError("Please fill in all fields");
            return;
        }

        loginMutation.mutate(form, {
            onSuccess: (res: any) => {
                localStorage.setItem("user", JSON.stringify(res.data.user));
                localStorage.setItem("token", res.data.token);
                updateUser(res.data.user);
                navigate("/dashboard");
            },
            onError: (err: any) => {
                const message = err.response?.data?.message || "Invalid credentials";
                setError(message);
            }
        });
    };

    return (
        <AuthLayout 
            title="Welcome Back" 
            subtitle="Sign in to your account to continue"
            type="login"
        >
            <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                    <div
                        className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="email"
                                placeholder="you@company.com"
                                value={form.email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setForm({ ...form, email: e.target.value });
                                    setError("");
                                }}
                                className="pl-12 pr-4 py-3"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setForm({ ...form, password: e.target.value });
                                    setError("");
                                }}
                                className="pl-12 pr-12 py-3"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    loading={loginMutation.isPending}
                    className="w-full py-3.5 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                    variant="primary"
                >
                    {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-gray-600">
                    Don't have an account?{" "}
                    <Link 
                        to="/register" 
                        className="font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Create account
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}