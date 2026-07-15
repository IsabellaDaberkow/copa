import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAlbum } from '@/composables/useAlbum'
import { listarFigurinhasDB, atualizarFigurinhaDB, filtrarFigurinhasDB, recalcularConquistasDB } from '@/services/database'

vi.mock('@/services/database', () => ({
  listarFigurinhasDB: vi.fn(),
  atualizarFigurinhaDB: vi.fn(),
  filtrarFigurinhasDB: vi.fn(),
  pesquisarFigurinhasDB: vi.fn(),
  recalcularConquistasDB: vi.fn()
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
    vi.mocked(recalcularConquistasDB).mockResolvedValue([1, 2])

    const { figurinhas, listar, marcarColetada } = useAlbum()

    await listar()
    expect(figurinhas.value).toHaveLength(1)

    await marcarColetada(1)
    expect(atualizarFigurinhaDB).toHaveBeenCalledWith(1, { coletada: true, collected_at: expect.any(String) })
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

  it('alterna o estado de favorito de uma figurinha', async () => {
    vi.mocked(listarFigurinhasDB).mockResolvedValue([
      { id: 1, nome: 'Neymar', selecao: 'Brasil', foto: 'neymar.jpg', coletada: false, favorite: false, raridade: 'Comum' }
    ])
    vi.mocked(atualizarFigurinhaDB).mockResolvedValue({
      id: 1,
      nome: 'Neymar',
      selecao: 'Brasil',
      foto: 'neymar.jpg',
      coletada: false,
      favorite: true,
      raridade: 'Comum'
    })

    const { listar, alternarFavorito } = useAlbum()

    await listar()
    await alternarFavorito(1)

    expect(atualizarFigurinhaDB).toHaveBeenCalledWith(1, { favorite: true })
  })
})
