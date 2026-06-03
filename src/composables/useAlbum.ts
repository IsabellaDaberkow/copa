import { ref } from 'vue'
import { stickers } from '../data/stickers'

const figurinhas = ref(stickers)

export function useAlbum() {

  function marcarColetada(id:number){

    const figurinha = figurinhas.value.find(
      f => f.id === id
    )

    if(figurinha){
      figurinha.coletada = !figurinha.coletada
    }
  }

  return {
    figurinhas,
    marcarColetada
  }
}