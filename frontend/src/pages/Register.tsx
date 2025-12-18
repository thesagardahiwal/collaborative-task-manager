import { useAuth } from "../hooks/useAuth";
import Input from "../components/Input";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormType } from "../schema/register.schema";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { User, Mail, Lock, CheckCircle, AlertCircle, EyeOff, Eye } from "lucide-react";
import { useState } from "react";

export default function Register() {
    const { registerMutation } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<RegisterFormType>({
        resolver: zodResolver(registerSchema),
        mode: "onChange"
    });
    const navigate = useNavigate();
    
    const password = watch("password", "");
    
    const onSubmit = (data: RegisterFormType) => {
        registerMutation.mutate(data, {
            onSuccess: (res: any) => {
                localStorage.setItem("user", JSON.stringify(res.data.user));
                localStorage.setItem("token", res.data.token);
                navigate("/dashboard");
            },
            onError: (error: any) => {
                console.error("Registration error:", error);
            }
        });
    };

    const passwordStrength = () => {
        if (!password) return { score: 0, color: "bg-gray-200", text: "Empty" };
        
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        const strength = [
            { score: 0, color: "bg-red-500", text: "Very Weak" },
            { score: 1, color: "bg-red-400", text: "Weak" },
            { score: 2, color: "bg-yellow-500", text: "Fair" },
            { score: 3, color: "bg-green-400", text: "Good" },
            { score: 4, color: "bg-green-600", text: "Strong" }
        ][score];
        
        return strength;
    };

    const passwordChecks = [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
        { label: "Contains number", met: /[0-9]/.test(password) },
        { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) }
    ];

    return (
        <AuthLayout 
            title="Create Account" 
            type="register"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="John Doe"
                                {...register("name")}
                                className="pl-12 w-full pr-4 py-3"
                                hasError={!!errors.name}
                            />
                        </div>
                        {errors.name && (
                            <p
                                className="mt-2 text-sm text-red-600 flex items-center gap-1"
                            >
                                <AlertCircle className="w-4 h-4" />
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Work Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            type="email"
                            placeholder="you@company.com"
                            {...register("email")}
                            className="pl-12 pr-4 py-3"
                            hasError={!!errors.email}
                        />
                    </div>
                    {errors.email && (
                        <p
                            className="mt-2 text-sm text-red-600 flex items-center gap-1"
                        >
                            <AlertCircle className="w-4 h-4" />
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            {...register("password")}
                            className="pl-12 pr-12 py-3"
                            hasError={!!errors.password}
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
                    
                    {/* Password Strength Meter */}
                    {password && (
                        <div 
                            className="mt-3 space-y-3"
                        >
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Password strength:</span>
                                    <span className="font-medium" style={{ 
                                        color: passwordStrength().color.replace('bg-', 'text-') 
                                    }}>
                                        {passwordStrength().text}
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${passwordStrength().color} transition-all duration-300`}
                                        style={{ width: `${(passwordStrength().score / 4) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {passwordChecks.map((check, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        {check.met ? (
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0" />
                                        )}
                                        <span className={`text-xs ${check.met ? 'text-green-600' : 'text-gray-500'}`}>
                                            {check.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {errors.password && (
                        <p 
                            className="mt-2 text-sm text-red-600 flex items-center gap-1"
                        >
                            <AlertCircle className="w-4 h-4" />
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    loading={registerMutation.isPending}
                    className="w-full py-3 hover:bg-blue-500 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                    variant="primary"
                >
                    {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                </Button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link 
                        to="/" 
                        className="font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}