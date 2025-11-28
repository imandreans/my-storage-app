import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { getFiles } from "./actions/upload";
import Uploader from "./components/uploader";
import FileList from "./components/file-list";

export default async function Home() {
  const files = await getFiles();

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Storage App</h1>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <SignedIn>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-4">
                My Files ({files.length})
              </h2>
              <FileList files={files} />
            </div>

            <div>
              <Uploader />
            </div>
          </div>
        </SignedIn>

        <SignedOut>
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-4">Welcome to My Storage</h2>
            <p className="text-gray-600 mb-8">Sign in to manage your files</p>
            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg">
                Get Started
              </button>
            </SignInButton>
          </div>
        </SignedOut>
      </div>
    </main>
  );
}
