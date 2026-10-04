import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renderiza y responde al click', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Jugar</Button>)
    await user.click(screen.getByRole('button', { name: 'Jugar' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('respeta disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Bloqueado
      </Button>,
    )
    await user.click(screen.getByRole('button', { name: 'Bloqueado' }))
    expect(onClick).not.toHaveBeenCalled()
  })
})
