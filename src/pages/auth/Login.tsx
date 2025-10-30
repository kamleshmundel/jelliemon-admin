import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES, STORAGE_VAR } from "../../utils/constants";
import authServices from "./services";
import { notify } from "../../utils/helpers";
import { useState } from "react";
import { Comps } from "../../components";

const initForm = { email: "", password: "", remember: false };

export default function Login() {
    const nav = useNavigate();

    const [loading, setLoading] = useState(false);
    const loader = {
        set: () => setLoading(true),
        remove: () => setLoading(false),
    }

    const schema = Yup.object({
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().min(6, "Min 6 chars").required("Required")
    });

    const onSubmit = async (values: typeof initForm) => {
        try {
            loader.set();
            const { data } = await authServices.login(values);

            localStorage.setItem(STORAGE_VAR.ACCESS_TOKEN, data.access)
            localStorage.setItem(STORAGE_VAR.REFRESH_TOKEN, data.refresh)
            localStorage.setItem(STORAGE_VAR.USER, "")

            nav(ROUTES.users)
        } catch (err: any) {
            notify.error(err.message);

        } finally {
            loader.remove();
        }
    }

    return (
        <>
            {loading && <Comps.Loader />}
            <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
    <div className="w-full max-w-sm bg-gray-900 p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6 text-white">Admin Login</h1>
        <Formik
            initialValues={initForm}
            validationSchema={schema}
            onSubmit={onSubmit}
        >
            <Form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-200">Email</label>
                    <Field name="email" type="email" className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-800 text-white focus:outline-none focus:ring focus:ring-indigo-400" />
                    <ErrorMessage name="email" component="div" className="text-xs text-red-500 mt-1" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-200">Password</label>
                    <Field name="password" type="password" className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-800 text-white focus:outline-none focus:ring focus:ring-indigo-400" />
                    <ErrorMessage name="password" component="div" className="text-xs text-red-500 mt-1" />
                </div>
                <div className="flex justify-between items-center text-sm">
                    <label className="flex items-center gap-2 text-gray-200">
                        <Field type="checkbox" name="remember" className="accent-indigo-600" />
                        Remember me
                    </label>

                    <Link to={ROUTES.forgetPass} className="text-indigo-400 hover:underline">Forgot password?</Link>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">Login</button>
            </Form>
        </Formik>
    </div>
</div>

        </>
    )
}
