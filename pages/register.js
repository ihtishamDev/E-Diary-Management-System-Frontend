import { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { Form, Input, Button, Checkbox } from 'antd'


export default function Register() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [agree, setAgree] = useState(false)
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(false)

    const onFinish = async () => {
        setLoading(true)
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'}/auth/register`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            }
        )
        if (res.ok) {
            setMsg('Registered — please login')
            setTimeout(() => router.push('registerEmail'), 900)
        } else {
            const j = await res.json()
            setMsg(j.detail || 'Error')
        }
        setLoading(false)
    }

    return (
        <div className="bg-[url('/images/dashboard/dashboard_back.png')] bg-no-repeat bg-cover min-h-screen">
            <div className="flex xl:justify-center xl:items-center flex-col xl:flex-row xl:gap-[136px] h-screen xl:px-[104px]">
                {/* Mobile logo */}
                <div className="xl:hidden flex justify-left w-full p-2 bg-white">
                    <Image
                        src="/images/icons/login-logo.svg"
                        height={100}
                        width={100}
                        alt="Logo"
                    />
                </div>

                {/* Avatar + text for mobile */}
                <div className="xl:hidden flex justify-center items-center h-screen mt-10 md:mt-0 px-4">
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
                                Create your account and start your e-Diary journey
                            </p>
                            <p className="font-plus_jakarta_sans text-h6 md:text-h4 font-normal text-lightGray">
                                Sign up to save your memories securely and access them anywhere.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Left Section – Registration form */}
                <div className="max-w-[512px] mx-auto w-full mt-10 md:mt-0 px-4 h-screen">
                    <div className="xl:flex hidden justify-center md:justify-start">
                        <Image
                            src="/images/icons/e-diarylogo.jpg"
                            height={100}
                            width={130}
                            alt="Logo"
                            className="my-[54px] rounded-full"
                        />
                    </div>

                    <div className="space-y-3 flex flex-col">
                        <p className="font-plus_jakarta_sans text-h3 md:text-h2 font-semibold text-darkGray">
                            Sign Up
                        </p>
                        <p className="font-plus_jakarta_sans text-h5 md:text-h4 font-normal text-lightGray">
                            Register to get started with your diary
                        </p>
                    </div>

                    <div className="py-[45px] space-y-6 loginFeild">
                        <Form
                            name="register"
                            initialValues={{
                                name: '',
                                email: '',
                                password: '',
                                confirmPassword: '',
                                agree: false,
                            }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            {/* Full Name */}
                            <Form.Item
                                name="name"
                                rules={[
                                    { required: false, message: 'Please enter your full name!' },
                                    { min: 2, message: 'Name must be at least 2 characters' },
                                    {
                                        pattern: /^[A-Za-z ]+$/,
                                        message: 'Only letters and spaces allowed',
                                    },
                                ]}
                            >
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="rounded-[4px] text-[#79747E] border-[#79747E]"
                                    placeholder="Full Name"
                                />
                            </Form.Item>

                            {/* Email */}
                            <Form.Item
                                name="email"
                                rules={[
                                    { required: false, message: 'Please enter your email!' },
                                    { type: 'email', message: 'Enter a valid email!' },
                                ]}
                            >
                                <Input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="rounded-[4px] text-[#79747E] border-[#79747E]"
                                    placeholder="john.doe@gmail.com"
                                />
                            </Form.Item>

                            {/* Password */}
                            <Form.Item
                                name="password"
                                rules={[
                                    { required: false, message: 'Please enter a password!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value) {
                                                return Promise.resolve()
                                            }

                                            const lengthOK = value.length >= 8
                                            const hasLower = /[a-z]/.test(value)
                                            const hasUpper = /[A-Z]/.test(value)
                                            const hasNumber = /\d/.test(value)
                                            const hasSpecial = /[!@#$%^&*]/.test(value)

                                            if (lengthOK && hasLower && hasUpper && hasNumber && hasSpecial) {
                                                return Promise.resolve()
                                            }
                                            return Promise.reject(
                                                new Error(
                                                    'Min 8 chars, include upper, lower, number & special character'
                                                )
                                            )
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="rounded-[4px] text-[#79747E] border-[#79747E]"
                                />
                            </Form.Item>


                            {/* Confirm Password */}
                            <Form.Item
                                name="confirmPassword"
                                dependencies={['password']}
                                rules={[
                                    { required: false, message: 'Please confirm password!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve()
                                            }
                                            return Promise.reject(
                                                new Error('Passwords do not match!')
                                            )
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="rounded-[4px] text-[#79747E] border-[#79747E]"
                                    placeholder="Confirm Password"
                                />
                            </Form.Item>

                            {/* Terms & Conditions */}
                            <Form.Item
                                name="agree"
                                valuePropName="checked"
                                rules={[
                                    {
                                        validator: (_, value) =>
                                            value
                                                ? Promise.resolve()
                                                : Promise.reject(
                                                    new Error(
                                                        'You must agree to Terms & Conditions'
                                                    )
                                                ),
                                    },
                                ]}
                            >
                                <Checkbox
                                    checked={agree}
                                    onChange={(e) => setAgree(e.target.checked)}
                                >
                                    I agree to the{' '}
                                    <a href="#" className="text-[#0254CF] underline">
                                        Terms & Conditions
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="text-[#0254CF] underline">
                                        Privacy Policy
                                    </a>
                                </Checkbox>
                            </Form.Item>


                            <Form.Item>
                                <Button
                                    className="w-full md:max-w-[212px] bg-[#0254CF] mt-2"
                                    block
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                >
                                    <p className="font-plus_jakarta_sans text-white font-semibold mt-2">
                                        Sign Up
                                    </p>
                                </Button>
                            </Form.Item>

                            {msg && <p className="text-red-600">{msg}</p>}


                            <div className="text-center">
                                <Button
                                    type="link"
                                    onClick={() => router.push('/')}
                                    className="text-[#0254CF]"
                                >
                                    Already have an account? Log in
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>

                {/* Right Section – desktop avatar */}
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
                            <p className="font-plus_jakarta_sans text-h4 md:text-[40px] md:leading-[45px] font-semibold text-darkGray">
                                Welcome On E-Diary Management System!
                            </p>
                            <p className="font-plus_jakarta_sans text-h6 md:text-h4 font-normal text-lightGray">
                                Start capturing your thoughts right away and let your ideas flow freely.
                                Organize your diary with ease, keeping every note safe, neat, and easy to revisit.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}














// import { useState } from 'react'
// import { useRouter } from 'next/router'
// export default function Register() {
//     const router = useRouter()
//     const [name, setName] = useState('')
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//     const [msg, setMsg] = useState('')
//     async function submit(e) {
//         e.preventDefault()
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'}/auth/register`, {
//             method: 'POST', headers: { 'Content-Type': 'application/json' }, body:
//                 JSON.stringify({ name, email, password })
//         })
//         if (res.ok) {
//             setMsg('Registered — please login');
//             setTimeout(() => router.push('/'), 900)
//         }
//         else { const j = await res.json(); setMsg(j.detail || 'Error') }
//     }
//     return (
//         <main className="max-w-xl mx-auto mt-12 p-6 bg-white shadow rounded">
//             <h1 className="text-2xl font-semibold mb-4">Register</h1>
//             <form onSubmit={submit} className="space-y-3">
//                 <input className="w-full border rounded px-3 py-2" placeholder="Full
// name" value={name} onChange={e => setName(e.target.value)} />
//                 <input className="w-full border rounded px-3 py-2" placeholder="Email"
//                     value={email} onChange={e => setEmail(e.target.value)} />
//                 <input className="w-full border rounded px-3 py-2"
//                     placeholder="Password" type='password' value={password}
//                     onChange={e => setPassword(e.target.value)} />
//                 <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bgindigo-700" type="submit">Register</button>
//             </form>
//             <p className="mt-3">{msg}</p>
//         </main>
//     )
// }
