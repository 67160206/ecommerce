import AuthForm from '@/components/auth-form'
export default function Page({ searchParams }: { searchParams: { next?: string } }) { return <AuthForm mode="register" next={searchParams.next || '/'} /> }
