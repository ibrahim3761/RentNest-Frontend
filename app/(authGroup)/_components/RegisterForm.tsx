"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { registerAction } from "../_action/authAction";
import { Home, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RegisterForm = () => {
    const [state, action, pending] = useActionState(registerAction, false);
    const [role, setRole] = useState("TENANT");

    const router = useRouter();

    useEffect(() => {
        if (!state) return;

        if (state.success) {
            toast.success(state.message);

            setTimeout(() => {
                router.push("/login");
            }, 1500);
        } else {
            toast.error(state.message);
        }
    }, [state, router]);

    return (
        <form className="space-y-4" action={action}>
            <Card className="space-y-4 p-5">
                <Input
                    name="name"
                    placeholder="Enter Your Name"
                    type="text"
                    required
                />

                <Input
                    name="email"
                    placeholder="Enter Your Email"
                    type="email"
                    required
                />

                <Input
                    name="password"
                    placeholder="Enter Your Password"
                    type="password"
                    required
                />

                <Input
                    name="avatarUrl"
                    placeholder="Avatar URL"
                    type="text"
                />
                <Input
                    name="phone"
                    placeholder="Phone Number"
                    type="tel"
                />
                <Input
                    name="address"
                    placeholder="Address"
                    type="text"
                />

                {/* Role Selection */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">
                        I want to register as
                    </Label>

                    {/* Hidden input so the value reaches the server action via FormData */}
                    <input type="hidden" name="role" value={role} />

                    <RadioGroup
                        value={role}
                        onValueChange={setRole}
                        className="grid grid-cols-2 gap-3"
                    >
                        <Label
                            htmlFor="role-tenant"
                            className="flex cursor-pointer items-center gap-3 rounded-md border border-input p-3 transition-colors has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
                        >
                            <RadioGroupItem value="TENANT" id="role-tenant" />
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">Tenant</span>
                                <span className="text-xs text-muted-foreground">
                                    Find a place to rent
                                </span>
                            </div>
                        </Label>

                        <Label
                            htmlFor="role-landlord"
                            className="flex cursor-pointer items-center gap-3 rounded-md border border-input p-3 transition-colors has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
                        >
                            <RadioGroupItem value="LANDLORD" id="role-landlord" />
                            <Home className="h-4 w-4 text-muted-foreground" />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">Landlord</span>
                                <span className="text-xs text-muted-foreground">
                                    List my property
                                </span>
                            </div>
                        </Label>
                    </RadioGroup>
                </div>

                <Button type="submit" className="w-full">
                    {pending ? "Creating Account..." : "Register"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-primary hover:underline"
                    >
                        Login
                    </Link>
                </div>
            </Card>
        </form>
    );
};

export default RegisterForm;