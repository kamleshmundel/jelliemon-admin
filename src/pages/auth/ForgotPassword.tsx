import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { ROUTES } from "../../utils/constants";

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [show, setShow] = useState({ pass: false, confirm: false });
    const nav = useNavigate();

    const EmailSchema = Yup.object({ email: Yup.string().email("Invalid").required("Required") });
    const OTPSchema = Yup.object({ otp: Yup.string().length(4, "4 digits").required("Required") });
    const ResetSchema = Yup.object({
        password: Yup.string().min(6, "Min 6 chars").required("Required"),
        confirm: Yup.string().oneOf([Yup.ref("password")], "Passwords must match").required("Required")
    });

    const sendEmail = (v: any) => { setEmail(v.email); setStep(2) };
    const verifyOtp = (_v: any) => { setStep(3) };
    const resetPass = (_v: any) => { alert("Password reset successful"); nav(ROUTES.login) };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow">
                <h1 className="text-2xl font-semibold text-center mb-6">Forgot Password</h1>

                {step === 1 && (
                    <Formik initialValues={{ email: "" }} validationSchema={EmailSchema} onSubmit={sendEmail}>
                        <Form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <Field name="email" type="email" className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200" />
                                <ErrorMessage name="email" component="div" className="text-xs text-red-500 mt-1" />
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">Send OTP</button>
                        </Form>
                    </Formik>
                )}

                {step === 2 && (
                    <Formik initialValues={{ otp: "" }} validationSchema={OTPSchema} onSubmit={verifyOtp}>
                        <Form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Enter OTP sent to {email}</label>
                                <Field name="otp" type="text" maxLength="4" className="w-full border rounded-md px-3 py-2 text-center tracking-widest focus:outline-none focus:ring focus:ring-indigo-200" />
                                <ErrorMessage name="otp" component="div" className="text-xs text-red-500 mt-1" />
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">Verify OTP</button>
                        </Form>
                    </Formik>
                )}

                {step === 3 && (
                    <Formik initialValues={{ password: "", confirm: "" }} validationSchema={ResetSchema} onSubmit={resetPass}>
                        <Form className="space-y-4">
                            <div className="relative">
                                <label className="block text-sm font-medium mb-1">New Password</label>
                                <Field name="password" type={show.pass ? "text" : "password"} className="w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring focus:ring-indigo-200" />
                                <button type="button" onClick={() => setShow(s => ({ ...s, pass: !s.pass }))} className="absolute right-3 top-8 text-slate-500">
                                    {show.pass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                <ErrorMessage name="password" component="div" className="text-xs text-red-500 mt-1" />
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                                <Field name="confirm" type={show.confirm ? "text" : "password"} className="w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring focus:ring-indigo-200" />
                                <button type="button" onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))} className="absolute right-3 top-8 text-slate-500">
                                    {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                <ErrorMessage name="confirm" component="div" className="text-xs text-red-500 mt-1" />
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">Reset Password</button>
                        </Form>
                    </Formik>
                )}
            </div>
        </div>)
}
