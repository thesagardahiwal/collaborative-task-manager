import { useAuth } from "../hooks/useAuth";
import Input from "../components/Input";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormType } from "../schema/register.schema";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { registerMutation } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema)
  });
  const navigate = useNavigate();
  const onSubmit = (data: RegisterFormType) => {
    registerMutation.mutate(data, {
        onSuccess: (res: any) => {
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/dashboard");
        },
        onError: (error: any) => {
            console.error("Registration error:", error);
        }
    });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-96 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Create Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <Input label="Name" {...register("name")} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <Input label="Email" type="email" {...register("email")} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <Input label="Password" type="password" {...register("password")} />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <Button 
            style={{width: '100%', marginTop: '1rem'}}
          >
            Register
          </Button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <a href="/" className="text-blue-600">Login</a>
        </p>
      </div>
    </div>
  );
}
