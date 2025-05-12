import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Hello
        </h1>

        <SignedOut>
          <div className="space-x-4">
            <SignInButton>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="flex justify-center mt-4">
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </div>
  );
}