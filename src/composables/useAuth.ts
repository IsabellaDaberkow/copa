import { ref } from 'vue'

const usuario = ref<any>(null)

export function useAuth(){

  function login(email:string, senha:string){

    if(email && senha){
      usuario.value = {
        email
      }
    }
  }

  function logout(){
    usuario.value = null
  }

  function cadastrar(){
    alert('Usuário cadastrado!')
  }

  function resetarSenha(){
    alert('E-mail enviado!')
  }

  return{
    usuario,
    login,
    logout,
    cadastrar,
    resetarSenha
  }
}