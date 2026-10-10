'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { requestPasswordResetAction } from '@/actions/auth'
import { AuthHeader } from '@/components/Auth/AuthHeader'
import { ForgotPasswordForm } from '@/components/Auth/ForgotPasswordForm'
import { ROUTE_LOGIN } from '@/lib/constants-routes'
import type { RequestPasswordResetInput } from '@/lib/dto/auth'

export const ForgotPasswordView = () => {
  const router = useRouter()

  const handleSubmit = async (values: RequestPasswordResetInput) => {
    const result = await requestPasswordResetAction(values)
    if (result.ok) {
      toast.success('If an account exists for that email, a reset link is on its way.')
      router.replace(ROUTE_LOGIN)
    }
    return result
  }

  return (
    <>
      <AuthHeader
        title="Forgot your password?"
        description="Enter your email and we will send you a reset link."
      />
      <ForgotPasswordForm onSubmit={handleSubmit} />
    </>
  )
}
