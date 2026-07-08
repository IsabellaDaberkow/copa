import { describe, expect, it } from 'vitest'
import {
  addFigurinha,
  listarFigurinhas,
  atualizarFigurinha,
  pesquisarFigurinhas
} from '../../src/data/stickers'

describe('serviço de figurinhas', () => {
  it('adiciona, lista, atualiza e pesquisa figurinhas', async () => {
    const criada = await addFigurinha({
      nome: 'Teste',
      selecao: 'Brasil',
      foto: 'teste.png',
      coletada: false,
      raridade: 'Comum'
    })

    expect(criada.id).toBeDefined()

    const lista = await listarFigurinhas()
    expect(lista.some((figurinha) => figurinha.id === criada.id)).toBe(true)

    const atualizada = await atualizarFigurinha(criada.id, { coletada: true })
    expect(atualizada?.coletada).toBe(true)

    const resultados = await pesquisarFigurinhas('Teste')
    expect(resultados.some((figurinha) => figurinha.id === criada.id)).toBe(true)
  })
})
