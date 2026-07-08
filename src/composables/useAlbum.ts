import { getCurrentInstance, onMounted, ref } from 'vue'
import {
  listarFigurinhasDB,
  atualizarFigurinhaDB,
  pesquisarFigurinhasDB,
  filtrarFigurinhasDB
} from '../services/database'

interface Figurinha {
  id: number
  nome: string
  selecao: string
  foto: string
  coletada: boolean
  raridade: string
}

const figurinhas = ref<Figurinha[]>([])

export function useAlbum() {
  async function listar(termo = '', status: 'todos' | 'coletadas' | 'pendentes' = 'todos') {
    let resultado: Figurinha[] = []

    if (status === 'coletadas') {
      resultado = await filtrarFigurinhasDB({ termo, coletada: true })
    } else if (status === 'pendentes') {
      resultado = await filtrarFigurinhasDB({ termo, coletada: false })
    } else if (termo.trim()) {
      resultado = await pesquisarFigurinhasDB(termo)
    } else {
      resultado = await listarFigurinhasDB()
    }

    figurinhas.value = resultado.map((item: any) => ({
      ...item,
      coletada: Boolean(item.coletada)
    }))

    return figurinhas.value
  }

  async function pesquisar(termo = '', status: 'todos' | 'coletadas' | 'pendentes' = 'todos') {
    return listar(termo, status)
  }

  async function filtro(status: 'todos' | 'coletadas' | 'pendentes' = 'todos', termo = '') {
    return listar(termo, status)
  }

  async function marcarColetada(id: number) {
    const figurinha = figurinhas.value.find((f) => f.id === id)

    if (!figurinha) {
      return null
    }

    const atualizada = await atualizarFigurinhaDB(id, {
      coletada: !figurinha.coletada
    })

    if (atualizada) {
      figurinha.coletada = Boolean(atualizada.coletada)
      figurinhas.value = figurinhas.value.map((item) =>
        item.id === id ? { ...item, coletada: Boolean(atualizada.coletada) } : item
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
    filtro
  }
}