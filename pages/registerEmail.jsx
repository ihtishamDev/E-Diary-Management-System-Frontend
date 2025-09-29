import Link from "next/link";
import Image from "next/image";
// import { useRouter } from "next/router";

const registerEmail = () => {
  // const router = useRouter()

  // router.push("/Login")
  return (
    <div className="bg-[url('/images/dashboard/dashboard_back.png')] bg-no-repeat bg-cover min-h-screen">
      <div className="flex  xl:items-center flex-col xl:flex-row xl:gap-[276px] h-screen xl:px-[104px]">


        <div className="max-w-[400px]  md:mt-0 h-screen">
          <div className="xl:flex hidden justify-center ">
            <Image
              src="/images/icons/e-diarylogo.jpg"
              height={100}
              width={130}
              alt="Logo"
              className="my-[54px] rounded-full"
            />
          </div>
        </div>


        <div className=" flex flex-col items-center justify-center ">
          {/* Illustration */}
          <div className="mb-6">
            <img
              src="/images/icons/registeremail.png"
              alt="Email Illustration"
              className="w-48 h-48"
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Email has been Sent
          </h1>

          {/* Description */}
          <p className="text-center text-gray-600 max-w-md mb-6">
            Welcome to <span className="font-semibold">E-Diray Management System</span>! Before we get
            started, please confirm your email address. We’ve sent a link to{" "}
            <span className="font-medium">user@email.com</span>.
          </p>

          {/* Extra Help */}
          <p className="text-gray-600 text-center max-w-md mb-6">
            If you don’t see the email, check your Spam or Junk folder, or{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              try another email address
            </Link>
            .
          </p>

          {/* Back to Login */}
          <Link
            href="/"
            className="text-green-600 font-medium hover:underline"
          >
            Back to login
          </Link>
        </div>

      </div>


    </div>

  )
}

export default registerEmail