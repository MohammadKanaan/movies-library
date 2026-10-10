'use client'

import { useRouter } from 'next/navigation'
import { signInAction } from '@/actions/auth'
import { AuthHeader } from '@/components/Auth/AuthHeader'
import { GoogleButton } from '@/components/Auth/GoogleButton'
import { LoginForm } from '@/components/Auth/LoginForm'
import type { SignInInput } from '@/lib/dto/auth'
import styles from './styles.module.scss'

type LoginViewProps = {
  nextPath: string
  googleEnabled: boolean
  /** The provider sign-in came back with an error (`?error=` on the page). */
  signInFailed?: boolean
}

export const LoginView = ({ nextPath, googleEnabled, signInFailed }: LoginViewProps) => {
  const router = useRouter()

  const handleSubmit = async (values: SignInInput) => {
    const result = await signInAction(values)
    if (result.ok) {
      // A Route Handler (such as an email link under `/api/`) is not an app page: the client
      // router cannot render it, so the browser must navigate to it.
      const isRouteHandler = nextPath.startsWith('/api/')
      if (isRouteHandler) {
        window.location.assign(nextPath)
      } else {
        router.replace(nextPath)
      }
    }
    return result
  }

  return (
    <>
      <AuthHeader
        title="Welcome back"
        description="Log in to rate films, write reviews and join the conversation."
      />
      {signInFailed && (
        <p className={styles.error} role="alert">
          Sign-in with Google could not be completed. Try again or use your password.
        </p>
      )}
      <LoginForm onSubmit={handleSubmit} />
      {googleEnabled && <GoogleButton nextPath={nextPath} />}
    </>
  )
}
