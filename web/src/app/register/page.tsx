"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

type Inputs = {
  email: string;
  password: string;
  repeatPassword: string;
};

type ServerInputs = Omit<Inputs, "repeatPassword">;

type ServerKey = keyof ServerInputs;

const Page: React.FC = () => {
  const utils = trpc.useUtils();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (data.password !== data.repeatPassword) {
      setError("repeatPassword", {
        type: "custom",
        message: "Passwords do not match",
      });
      return;
    }
    let serverData: ServerInputs = {
      email: data.email,
      password: data.password,
    };
    mutateAsync(serverData);
  };
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>();
  const { mutateAsync } = trpc.register.useMutation({
    onSuccess: (data) => {
      if ("user" in data) {
        utils.getMe.setData(undefined, { user: data.user });
        router.push("/");
      }
    },
    onError: (err) => {
      let keys: ServerKey[] = ["email", "password"];

      let key = err.data?.path;

      if (typeof key === "undefined") {
        setError("root", { type: "custom", message: err.message });
      } else {
        if ((keys as string[]).includes(key)) {
          setError(key as ServerKey, { type: "custom", message: err.message });
        } else {
          setError("root", { type: "custom", message: err.message });
        }
      }
    },
  });
  let router = useRouter();

  return (
    <div className="page">
      <div className="flex justify-center">
        <div className="card p-12">
          <div className="text-center p-4 text-primary-500 font-bold">
            Register
          </div>
          {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div>
              {/* register your input into the hook by invoking the "register" function */}
              <Input
                placeholder="email"
                autoComplete="email"
                type="email"
                {...register("email", {
                  required: true,
                  minLength: {
                    value: 3,
                    message: "Must contain at least 3 characters",
                  },
                  maxLength: {
                    value: 255,
                    message: "Must contain at most 255 characters",
                  },
                })}
              />
              {errors.email && <pre>{errors.email.message}</pre>}

              {/* include validation with required or other standard HTML validation rules */}
              <Input
                placeholder="password"
                autoComplete="current-password"
                type="password"
                {...register("password", {
                  required: true,
                  minLength: {
                    value: 6,
                    message: "Must contain at least 6 characters",
                  },
                  maxLength: {
                    value: 255,
                    message: "Must contain at most 255 characters",
                  },
                })}
              />
              {errors.password && <pre>{errors.password.message}</pre>}

              {/* include validation with required or other standard HTML validation rules */}
              <Input
                placeholder="repeat password"
                autoComplete="current-password"
                type="password"
                {...register("repeatPassword", {
                  required: true,
                  minLength: {
                    value: 6,
                    message: "Must contain at least 6 characters",
                  },
                  maxLength: {
                    value: 255,
                    message: "Must contain at most 255 characters",
                  },
                })}
              />
              {errors.repeatPassword && (
                <pre>{errors.repeatPassword.message}</pre>
              )}

              {errors.root && <pre className="mt-4">{errors.root.message}</pre>}
            </div>
            <Button type="submit" className="my-4">
              Enter
            </Button>
          </form>
          <Link href="/login" className="">
            already have an account? log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default trpc.withTRPC(Page);
