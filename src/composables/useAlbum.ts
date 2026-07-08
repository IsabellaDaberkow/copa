import { onMounted, ref } from 'vue'
import {
  listarFigurinhas,
  atualizarFigurinha,
  type Figurinha
} from '../data/stickers'

const figurinhas = ref<Figurinha[]>([])

export function useAlbum() {
  async function carregarFigurinhas() {
    figurinhas.value = await listarFigurinhas()
  }

  async function marcarColetada(id: number) {
    const figurinha = figurinhas.value.find((f) => f.id === id)

    if (!figurinha) {
      return
    }

    const atualizada = await atualizarFigurinha(id, {
      coletada: !figurinha.coletada
    })

    if (atualizada) {
      figurinha.coletada = atualizada.coletada
    }
  }

  onMounted(() => {
    void carregarFigurinhas()
  })

  return {
    figurinhas,
    marcarColetada,
    carregarFigurinhas
  }
}