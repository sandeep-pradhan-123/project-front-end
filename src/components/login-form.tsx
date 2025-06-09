"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { showToastError, showToastSuccess } from "@/utils/sonner";
import { usePostData } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore"


type LoginFormData = {
  email: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  message: string;
  data: any;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password:""
  });
  const router = useRouter()
  const { setPermissions, setToken, setUser,token,user } = useAuthStore()
  useEffect(() => {
    if (user && token) {
      console.log("user", user, "token", token)
      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; secure; samesite=strict`;
      router.push("/dashboard");
    }
  }, [user, token, router]);
  const { mutate: submitContact, isPending,reset } = usePostData<LoginFormData, LoginResponse>('/api/auth/login');
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // setSubmitStatus({});
    // Submit the contact form data using React Query
    submitContact(formData, {
      onSuccess: (res) => {
        
        const response = res.data
        
        if (response.success) {
          showToastSuccess("Login successful Admin")
          // Reset form after successful submission
          // setFormData({
          //   email: "",
          //   password:""
          // });
          // reset()
          showToastSuccess("Login successful Admin")
          setPermissions(response?.data?.user.role === "admin" ? { permissions: 1 } : { permissions: 2 })
          setToken(response?.data?.token)
          setUser(response?.data?.user)
          // router.push("/dashboard")
        } else {
          showToastError(response.message || "Something went wrong. Please try again.");
        }
      },
      onError: (error) => {
        showToastError(error.message || "Something went wrong. Please try again.");
      }
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  name="email"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" name="password" required  onChange={handleChange}/>
              </div>
              <div className="flex flex-col gap-3  items-center justify-center">
               {isPending ? (<><div className="w-5 h-5 border-t-2 border-b-2 border-black rounded-full animate-spin"></div> </>) :
                (<>
                 <Button type="submit" className="w-full">
                  Login
                </Button>
                </>)}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
