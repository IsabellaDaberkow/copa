import {
  addFigurinhaDB,
  listarFigurinhasDB,
  atualizarFigurinhaDB,
  pesquisarFigurinhasDB
} from '../services/database'

export interface Figurinha {
  id: number
  nome: string
  selecao: string
  foto: string
  coletada: boolean
  raridade: string
}

let cacheEmMemoria: Figurinha[] = []
let inicializado = false

function normalizarFigurinha(item: any): Figurinha {
  return {
    id: Number(item.id),
    nome: String(item.nome ?? ''),
    selecao: String(item.selecao ?? ''),
    foto: String(item.foto ?? ''),
    coletada: Boolean(item.coletada),
    raridade: String(item.raridade ?? '')
  }
}

async function garantirDadosIniciais() {
  if (inicializado) {
    return
  }

  try {
    const existentes = await listarFigurinhasDB()
    cacheEmMemoria = existentes.map(normalizarFigurinha)
  } catch (error) {
    console.warn('Usando armazenamento local para figurinhas:', error)
    cacheEmMemoria = []
  }

  inicializado = true
}

export async function addFigurinha(payload: Omit<Figurinha, 'id'>) {
  await garantirDadosIniciais()

  try {
    const criada = await addFigurinhaDB(payload)
    const figurinha = normalizarFigurinha(criada)
    cacheEmMemoria = [...cacheEmMemoria, figurinha]
    return figurinha
  } catch (error) {
    console.warn('Falha ao salvar no banco. Usando fallback em memória.', error)
    const figurinha = {
      id: Date.now(),
      ...payload
    }
    cacheEmMemoria = [...cacheEmMemoria, figurinha]
    return figurinha
  }
}

export async function listarFigurinhas() {
  await garantirDadosIniciais()
  return [...cacheEmMemoria]
}

export async function atualizarFigurinha(id: number, updates: Partial<Figurinha>) {
  await garantirDadosIniciais()

  try {
    const atualizada = await atualizarFigurinhaDB(id, updates)

    if (atualizada) {
      const figurinhaAtualizada = normalizarFigurinha(atualizada)
      cacheEmMemoria = cacheEmMemoria.map((figurinha) =>
        figurinha.id === id ? figurinhaAtualizada : figurinha
      )
      return figurinhaAtualizada
    }
  } catch (error) {
    console.warn('Falha ao atualizar no banco. Usando fallback em memória.', error)
  }

  const figurinhaExistente = cacheEmMemoria.find((figurinha) => figurinha.id === id)

  if (!figurinhaExistente) {
    return null
  }

  const figurinhaAtualizada = {
    ...figurinhaExistente,
    ...updates,
    coletada: updates.coletada ?? figurinhaExistente.coletada
  }

  cacheEmMemoria = cacheEmMemoria.map((figurinha) =>
    figurinha.id === id ? figurinhaAtualizada : figurinha
  )

  return figurinhaAtualizada
}

export async function pesquisarFigurinhas(termo: string) {
  await garantirDadosIniciais()

  const busca = termo.trim().toLowerCase()

  if (!busca) {
    return [...cacheEmMemoria]
  }

  try {
    const resultados = await pesquisarFigurinhasDB(busca)
    return resultados.map(normalizarFigurinha)
  } catch (error) {
    console.warn('Falha ao pesquisar no banco. Usando fallback em memória.', error)
    return cacheEmMemoria.filter((figurinha) =>
      figurinha.nome.toLowerCase().includes(busca) ||
      figurinha.selecao.toLowerCase().includes(busca)
    )
  }
}