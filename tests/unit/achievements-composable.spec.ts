import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAchievements } from '@/composables/useAchievements'
import { listarConquistasDB } from '@/services/database'

vi.mock('@/services/database', () => ({
  listarConquistasDB: vi.fn()
}))

describe('useAchievements', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lista as conquistas persistidas no banco', async () => {
    vi.mocked(listarConquistasDB).mockResolvedValue([
      {
        id: 1,
        nome: 'Primeira Figurinha',
        descricao: 'Coletar a primeira figurinha',
        icone: '🥇',
        desbloqueada: true,
        data_desbloqueio: '2026-07-08'
      }
    ])

    const { conquistas, listar } = useAchievements()

    await listar()

    expect(listarConquistasDB).toHaveBeenCalled()
    expect(conquistas.value).toHaveLength(1)
    expect(conquistas.value[0].nome).toBe('Primeira Figurinha')
  })
})
