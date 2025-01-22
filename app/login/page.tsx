export default function Login() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h1>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition duration-200"
            >
              Login
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-blue-500 hover:underline font-medium"
              >
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
  