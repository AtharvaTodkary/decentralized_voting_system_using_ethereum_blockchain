"use client"
import { useForm } from 'react-hook-form';
import { login } from '../lib/api';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        try {
            const response = await login(data.email, data.password);
            console.log('Login successful', response.data);
            // Redirect to dashboard or save user data
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <input {...register('email', { required: true })} placeholder="Email" type="email" />
                {errors.email && <span>This field is required</span>}
            </div>
            <div>
                <input {...register('password', { required: true })} placeholder="Password" type="password" />
                {errors.password && <span>This field is required</span>}
            </div>
            <button type="submit">Login</button>
        </form>
    );
}
