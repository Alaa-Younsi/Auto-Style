import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/i18n/LanguageProvider";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BentoPanel } from "@/components/ui/BentoPanel";
import logo from "@/assets/auto-style-logo.png";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export function AdminLogin() {
  const { session, signIn } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (session) return <Navigate to="/admin" replace />;

  const onSubmit = async ({ email, password }: FormValues) => {
    setAuthError(null);
    const { error } = await signIn(email, password);
    if (error) {
      setAuthError(t("admin_login_error"));
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <BentoPanel className="w-full max-w-sm p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4">
          <img src={logo} alt="Auto Style" className="h-12 w-auto" />
          <h1 className="font-mono text-xs uppercase tracking-widest text-muted">
            {t("admin_login_title")}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label={t("admin_email")}
            type="email"
            placeholder="admin@autostyle.dz"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label={t("admin_password")}
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          {authError && (
            <p className="text-[10px] font-mono text-brand text-center">{authError}</p>
          )}

          <Button type="submit" size="lg" className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting ? "…" : t("admin_login_btn")}
          </Button>
        </form>
      </BentoPanel>
    </div>
  );
}
