import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignup } from "../hooks/queries/useAuth";
import ErrorAlert from "../components/reusable/ErrorAlert";
import Button from "../components/reusable/Button";

export default function Signup() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const navigate = useNavigate();

  const signupMutation = useSignup();

  const onSubmit = async (ev) => {
    ev.preventDefault();

    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };

    try {
      await signupMutation.mutateAsync(payload);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      // Error handling is done in the mutation hook
      console.error("Signup failed:", err);
    }
  };

  return (
    <div className="w-[360px] bg-white p-8 shadow-sm relative z-10 animated fadeInDown">
      <form onSubmit={onSubmit}>
        <h1 className="text-xl mb-4 text-center font-bold text-gray-900">
          Create an account
        </h1>

        {signupMutation.error && (
          <ErrorAlert error={signupMutation.error} variant="auth" />
        )}

        {/* {signupMutation.error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
            {Object.keys(signupMutation.error).map((key) => (
              <p key={key}>{signupMutation.error[key][0]}</p>
            ))}
          </div>
        )} */}

        <input
          ref={nameRef}
          placeholder="Full Name"
          className="w-full border-2 border-gray-200 p-4 mb-4 text-sm transition-all focus:border-purple-700 outline-none"
          required
          autoComplete="name"
        />
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
          autoComplete="new-password"
        />
        <input
          ref={passwordConfirmationRef}
          type="password"
          placeholder="Password Confirmation"
          className="w-full border-2 border-gray-200 p-4 mb-4 text-sm transition-all focus:border-purple-700 outline-none"
          required
          autoComplete="new-password"
        />

        <Button
          variant="auth"
          type="submit"
          disabled={signupMutation.isPending}
          loading={signupMutation.isPending}
          loadingText="Creating account..."
        >
          Signup
        </Button>

        <p className="mt-4 text-center text-gray-400 text-base">
          Already registered?{" "}
          <Link
            to="/login"
            className="text-purple-800 no-underline hover:text-purple-900"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
