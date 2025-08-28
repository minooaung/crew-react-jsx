import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/queries/useAuth";
import ErrorAlert from "../components/reusable/ErrorAlert";
import Button from "../components/reusable/Button";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const loginMutation = useLogin();

  const onSubmit = async (ev) => {
    ev.preventDefault();

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await loginMutation.mutateAsync(payload);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      // Error handling is done in the mutation hook
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="w-[360px] bg-white p-8 shadow-sm relative z-10 animated fadeInDown">
      <form onSubmit={onSubmit}>
        <h1 className="text-xl mb-4 text-center font-bold text-gray-900">
          Login into your account
        </h1>

        {loginMutation.error && (
          <ErrorAlert error={loginMutation.error} variant="auth" />
        )}

        {/* {loginMutation.error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
            {Object.keys(loginMutation.error).map((key) => (
              <p key={key}>{loginMutation.error[key][0]}</p>
            ))}
          </div>
        )} */}

        <input
          ref={emailRef}
          type="email"
          placeholder="Email"
          className="w-full border-2 border-gray-200 p-4 mb-4 text-sm transition-all focus:border-purple-700 outline-none"
          required
          autoComplete="username"
        />
        <input
          ref={passwordRef}
          type="password"
          placeholder="Password"
          className="w-full border-2 border-gray-200 p-4 mb-4 text-sm transition-all focus:border-purple-700 outline-none"
          required
          autoComplete="current-password"
        />

        <Button
          variant="auth"
          type="submit"
          disabled={loginMutation.isPending}
          loading={loginMutation.isPending}
          loadingText="Logging in..."
        >
          Login
        </Button>

        <p className="mt-4 text-center text-gray-400 text-base">
          Not registered?{" "}
          <Link
            to="/signup"
            className="text-purple-800 no-underline hover:text-purple-900"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
