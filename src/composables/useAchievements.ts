import { ref } from 'vue'
import { listarConquistasDB } from '../services/database'

export interface Achievement {
  id: number
  nome: string
  descricao: string
  icone: string
  desbloqueada: boolean
  data_desbloqueio: string | null
}

const conquistas = ref<Achievement[]>([])

export function useAchievements() {
  async function listar() {
    const resultado = await listarConquistasDB()
    conquistas.value = resultado
    return conquistas.value
  }

  return {
    conquistas,
    listar
  }
}
