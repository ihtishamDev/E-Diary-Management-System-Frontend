import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { Form, Input, Button } from 'antd'
import { useSearchParams } from "next/navigation";

export default function Login() {
  const router = useRouter()
  const [err, setErr] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const SearchParam = useSearchParams();
  const msg = SearchParam.get("msg"); 
  // ✅ Take values from AntD form
  

  useEffect(() => {
    if (msg === "verified")
      alert("Login Successfull! Now you login your Account")
    if (msg === "invalid_token")
      alert("User not found! Kindly confirm you Registration")
    if (msg === "token_expire")
      alert("Your varifiction link is Expire")
  }, [msg])
  
  const onFinish = async (values) => {
  setIsLoading(true)
  setErr('')
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/auth/login`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      }
    )


    const data = await res.json()
    if (res.ok) router.push('/dashboard')
    else setErr(data.detail || 'Invalid credentials')
  } catch (e) {
    setErr(String(e))
  } finally {
    setIsLoading(false)
  }
}


  return (
    <div className="bg-[url('/images/dashboard/dashboard_back.png')] bg-no-repeat bg-cover min-h-screen">
      <div className="flex xl:justify-center xl:items-center flex-col xl:flex-row xl:gap-[136px] h-screen xl:px-[104px]">
        {/* Right Section (mobile logo) */}
        <div className="xl:hidden flex justify-left w-full p-2 bg-white">
          <Image
            src="/images/icons/e-diarylogo.jpg"
            height={100}
            width={100}
            alt="Logo"
          />
        </div>

        {/* Avatar + text for mobile */}
        <div className="xl:hidden flex justify-center items-center h-screen mt-10 md:mt-0 px-4">
          <div className="flex flex-col items-center px-2 md:px-0 mt-5">
            <Image
              src="/images/dashboard/e-diary.jpg"
              height={120}
              width={120}
              alt="Avatar"
              className="rounded-full mb-5"
            />
            <div className="space-y-4 text-center md:p-10">
              <p className="font-plus_jakarta_sans text-h3 md:text-[40px] md:leading-[45px] font-semibold text-darkGray">
                Hello, I am Ihtisham, your Write place to make your notes
              </p>
              <p className="font-plus_jakarta_sans text-h6 md:text-h4 font-normal text-lightGray">
                I will help you find the best place to practice your work and write your precious words.
              </p>
            </div>
          </div>
        </div>

        {/* Left Section (login form) */}
        <div className="max-w-[512px] mx-auto w-full mt-10 md:mt-0 px-4 h-screen">
          <div className="xl:flex hidden justify-center md:justify-start">
            <Image
              src="/images/icons/e-diarylogo.jpg"
              height={70}
              width={100}
              alt="Logo"
              className="my-[54px] rounded-full"
            />
          </div>

          <div className="space-y-3 flex flex-col">
            <p className="font-plus_jakarta_sans text-h3 md:text-h2 font-semibold text-darkGray">
              Login
            </p>
            <p className="font-plus_jakarta_sans text-h5 md:text-h4 font-normal text-lightGray">
              Login to access your E-Diary Notes
            </p>
          </div>

          <div className="py-[45px] space-y-6 loginFeild">
            <Form
              name="login"
              initialValues={{ email: '', password: '' }}
              onFinish={onFinish}
              autoComplete="off"
            >
              {/* Email / Username */}
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email!' },
                  {
                    type: 'email',
                    message: 'Please enter a valid email address!',
                  },
                ]}
              >
                <Input
                  className="rounded-[4px] text-[#79747E] border-[#79747E]"
                  placeholder="john.doe@gmail.com"
                />
              </Form.Item>

              {/* Password */}
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please enter your password!' },
                  () => ({
                    validator(_, value) {
                      if (!value) return Promise.resolve()
                      if (value.length >= 6) {
                        return Promise.resolve()
                      }
                      return Promise.reject(
                        new Error('Password must be at least 6 characters')
                      )
                    },
                  }),
                ]}
              >
                <Input.Password
                  className="rounded-[4px] text-[#79747E] border-[#79747E]"
                  placeholder="Password"
                />
              </Form.Item>


              <Form.Item>
                <Button
                  className="w-full md:max-w-[200px] bg-[#0254CF]"
                  block
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                >
                  <p className="font-plus_jakarta_sans text-white font-semibold mt-2">
                    Log in
                  </p>
                </Button>
              </Form.Item>

                            {err && <p className="text-red-600">{err}</p>}


              {/* Links & buttons */}
              <div className="flex flex-col md:flex-row md:justify-between gap-3">
                <Button
                  className="w-full md:w-auto border border-gray-400"
                  onClick={() => router.push('/register')}
                >
                  Create Account
                </Button>
                <Button
                  className="w-full md:w-auto border border-gray-400"
                  onClick={() => router.push('/forgetPassword')}
                >
                  Forgot Password?
                </Button>
              </div>

              {/* (Optional) Social login buttons */}
              {/* <div className="mt-6 space-y-3">
                <Button block className="border border-gray-400">
                  Continue with Google
                </Button>
                <Button block className="border border-gray-400">
                  Continue with Facebook
                </Button>
                <Button block className="border border-gray-400">
                  Continue with Apple
                </Button>
              </div> */}
            </Form>
          </div>
        </div>

        {/* Right Section (desktop avatar) */}
        <div className="xl:flex hidden justify-center items-center h-screen mt-10 md:mt-0">
          <div className="flex flex-col items-center px-4 md:px-0">
            <Image
              src="/images/dashboard/e-diary.jpg"
              height={120}
              width={120}
              alt="Avatar"
              className="md:h-[160px] md:w-[160px] rounded-full"
            />
            <div className="space-y-4 text-center md:p-10">
              <p className="font-plus_jakarta_sans text-h3 md:text-[40px] md:leading-[45px] font-semibold text-darkGray">
                Hello, I am Ihtisham Ul Haq Shami, your write place to make your notes
              </p>
              <p className="font-plus_jakarta_sans text-h6 md:text-h4 font-normal text-lightGray">
                I will help you find the best place to practice your work and write your precious words.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
