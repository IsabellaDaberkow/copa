import { getCurrentInstance, onMounted, ref } from 'vue'
import {
  listarFigurinhasDB,
  atualizarFigurinhaDB,
  pesquisarFigurinhasDB,
  filtrarFigurinhasDB,
  recalcularConquistasDB
} from '../services/database'

interface Figurinha {
  id: number
  nome: string
  selecao: string
  foto: string
  coletada: boolean
  raridade: string
  favorite: boolean
  collectedAt: string | null
}

const figurinhas = ref<Figurinha[]>([])

export function useAlbum() {
  async function listar(termo = '', status: 'todos' | 'coletadas' | 'pendentes' | 'favoritas' = 'todos') {
    let resultado: Figurinha[] = []

    if (status === 'coletadas') {
      resultado = await filtrarFigurinhasDB({ termo, coletada: true })
    } else if (status === 'pendentes') {
      resultado = await filtrarFigurinhasDB({ termo, coletada: false })
    } else if (status === 'favoritas') {
      resultado = await filtrarFigurinhasDB({ termo, favorite: true })
    } else if (termo.trim()) {
      resultado = await pesquisarFigurinhasDB(termo)
    } else {
      resultado = await listarFigurinhasDB()
    }

    figurinhas.value = resultado.map((item: any) => ({
      ...item,
      coletada: Boolean(item.coletada),
      favorite: Boolean(item.favorite),
      collectedAt: item.collected_at ?? null
    }))

    return figurinhas.value
  }

  async function pesquisar(termo = '', status: 'todos' | 'coletadas' | 'pendentes' | 'favoritas' = 'todos') {
    return listar(termo, status)
  }

  async function filtro(status: 'todos' | 'coletadas' | 'pendentes' | 'favoritas' = 'todos', termo = '') {
    return listar(termo, status)
  }

  async function marcarColetada(id: number) {
    const figurinha = figurinhas.value.find((f) => f.id === id)

    if (!figurinha) {
      return null
    }

    const atualizada = await atualizarFigurinhaDB(id, {
      coletada: !figurinha.coletada,
      collected_at: !figurinha.coletada ? new Date().toISOString() : null
    })

    if (atualizada) {
      figurinha.coletada = Boolean(atualizada.coletada)
      figurinha.collectedAt = atualizada.collected_at ?? null
      figurinhas.value = figurinhas.value.map((item) =>
        item.id === id ? { ...item, coletada: Boolean(atualizada.coletada), collectedAt: atualizada.collected_at ?? null } : item
      )
      await recalcularConquistasDB()
      return figurinha
    }

    return null
  }

  async function alternarFavorito(id: number) {
    const figurinha = figurinhas.value.find((item) => item.id === id)

    if (!figurinha) {
      return null
    }

    const atualizada = await atualizarFigurinhaDB(id, {
      favorite: !figurinha.favorite
    })

    if (atualizada) {
      figurinha.favorite = Boolean(atualizada.favorite)
      figurinhas.value = figurinhas.value.map((item) =>
        item.id === id ? { ...item, favorite: Boolean(atualizada.favorite) } : item
      )
      return figurinha
    }

    return null
  }

  if (getCurrentInstance()) {
    onMounted(() => {
      void listar()
    })
  }

  return {
    figurinhas,
    listar,
    pesquisar,
    marcarColetada,
    alternarFavorito,
    filtro
  }
}