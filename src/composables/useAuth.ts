import { ref } from 'vue'
import { addUsuario, realizarLogin } from '../services/database'

interface AuthResult {
  ok: boolean
  message: string
  user?: any
}

const usuario = ref<any>(null)

export function useAuth() {
  async function syncSession() {
    const sessao = localStorage.getItem('usuarioLogado')

    if (!sessao) {
      usuario.value = null
      return null
    }

    try {
      const dados = JSON.parse(sessao) as { id?: number; nome?: string; login?: string }
      usuario.value = dados
      return dados
    } catch (error) {
      console.error('Erro ao restaurar sessão', error)
      usuario.value = null
      return null
    }
  }

  async function login(email: string, senha: string): Promise<AuthResult> {
    if (!email || !senha) {
      return { ok: false, message: 'Preencha todos os campos' }
    }

    const usuarios = await realizarLogin(email, senha)

    if (usuarios.length > 0) {
      const dados = usuarios[0] as { id?: number; nome?: string; login?: string }
      const sessao = {
        id: dados.id,
        nome: dados.nome,
        email: dados.login
      }

      localStorage.setItem('usuarioLogado', JSON.stringify(sessao))
      usuario.value = sessao
      return { ok: true, message: 'Login realizado com sucesso!', user: sessao }
    }

    return { ok: false, message: 'Email ou senha inválidos' }
  }

  function logout() {
    localStorage.removeItem('usuarioLogado')
    usuario.value = null
  }

  async function cadastrar(nome: string, email: string, senha: string): Promise<AuthResult> {
    if (!nome || !email || !senha) {
      return { ok: false, message: 'Preencha todos os campos' }
    }

    if (senha.length < 6) {
      return { ok: false, message: 'Senha fraca' }
    }

    await addUsuario(nome, email, senha)
    return { ok: true, message: 'Cadastro realizado!' }
  }

  async function resetarSenha(email: string): Promise<AuthResult> {
    if (!email) {
      return { ok: false, message: 'Digite um e-mail' }
    }

    return { ok: true, message: 'E-mail de redefinição enviado!' }
  }

  return {
    usuario,
    syncSession,
    login,
    logout,
    cadastrar,
    resetarSenha
  }
}