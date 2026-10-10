'use client'

import { useRouter } from 'next/navigation'
import { signUpAction } from '@/actions/auth'
import { AuthHeader } from '@/components/Auth/AuthHeader'
import { GoogleButton } from '@/components/Auth/GoogleButton'
import { SignUpForm } from '@/components/Auth/SignUpForm'
import type { SignUpInput } from '@/lib/dto/auth'

type SignUpViewProps = {
  nextPath: string
  googleEnabled: boolean
}

export const SignUpView = ({ nextPath, googleEnabled }: SignUpViewProps) => {
  const router = useRouter()

  const handleSubmit = async (values: SignUpInput) => {
    const result = await signUpAction(values)
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
        title="Join the library"
        description="Rate what you watch, review it, and reply to other critics."
      />
      <SignUpForm onSubmit={handleSubmit} />
      {googleEnabled && <GoogleButton nextPath={nextPath} />}
    </>
  )
}
