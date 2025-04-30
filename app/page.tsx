import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Home</h1>
      <h1>Some popular links:</h1>
      <div className="text-blue-600  flex gap-4">
        <Link className="hover:text-blue-800 hover:underline" href={"/sign-up"}>
          SignUp
        </Link>
        <Link className="hover:text-blue-800 hover:underline" href={"/sign-in"}>
          SignIn
        </Link>
        <Link
          className="hover:text-blue-800 hover:underline"
          href={"/dashboard"}
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
