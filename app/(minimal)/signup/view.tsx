'use client'

import { useRouter } from 'next/navigation'
import { signUpAction } from '@/actions/auth'
import { AuthHeader } from '@/components/Auth/AuthHeader'
import { GoogleButton } from '@/components/Auth/GoogleButton'
import { SignUpForm } from '@/components/Auth/SignUpForm'
import { useReturnPath } from '@/hooks/useReturnPath'
import type { SignUpInput } from '@/lib/dto/auth'

type SignUpViewProps = {
  nextPath: string
  googleEnabled: boolean
}

export const SignUpView = ({ nextPath, googleEnabled }: SignUpViewProps) => {
  const router = useRouter()
  const { resolve, clear } = useReturnPath()
  const target = resolve(nextPath)

  const handleSubmit = async (values: SignUpInput) => {
    const result = await signUpAction(values)
    if (result.ok) {
      clear()
      // A Route Handler (such as an email link under `/api/`) is not an app page: the client
      // router cannot render it, so the browser must navigate to it.
      const isRouteHandler = target.startsWith('/api/')
      if (isRouteHandler) {
        window.location.assign(target)
      } else {
        router.replace(target)
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
      {googleEnabled && <GoogleButton nextPath={target} />}
    </>
  )
}
