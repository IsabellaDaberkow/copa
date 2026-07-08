import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAlbum } from '@/composables/useAlbum'
import { listarFigurinhasDB, atualizarFigurinhaDB, filtrarFigurinhasDB } from '@/services/database'

vi.mock('@/services/database', () => ({
  listarFigurinhasDB: vi.fn(),
  atualizarFigurinhaDB: vi.fn(),
  filtrarFigurinhasDB: vi.fn(),
  pesquisarFigurinhasDB: vi.fn()
}))

describe('useAlbum', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lista e atualiza figurinhas via composable', async () => {
    vi.mocked(listarFigurinhasDB).mockResolvedValue([
      { id: 1, nome: 'Neymar', selecao: 'Brasil', foto: 'neymar.jpg', coletada: false, raridade: 'Comum' }
    ])
    vi.mocked(atualizarFigurinhaDB).mockResolvedValue({
      id: 1,
      nome: 'Neymar',
      selecao: 'Brasil',
      foto: 'neymar.jpg',
      coletada: true,
      raridade: 'Comum'
    })

    const { figurinhas, listar, marcarColetada } = useAlbum()

    await listar()
    expect(figurinhas.value).toHaveLength(1)

    await marcarColetada(1)
    expect(atualizarFigurinhaDB).toHaveBeenCalledWith(1, { coletada: true })
  })

  it('filtra figurinhas por status usando SQL', async () => {
    vi.mocked(filtrarFigurinhasDB).mockResolvedValue([
      { id: 2, nome: 'Messi', selecao: 'Argentina', foto: 'messi.jpg', coletada: true, raridade: 'Brilhante' }
    ])

    const { figurinhas, filtro } = useAlbum()

    await filtro('coletadas')

    expect(filtrarFigurinhasDB).toHaveBeenCalledWith({ termo: '', coletada: true })
    expect(figurinhas.value).toHaveLength(1)
  })
})
