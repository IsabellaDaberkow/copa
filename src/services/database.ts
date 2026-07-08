import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection
} from '@capacitor-community/sqlite'
 
const dbName = 'appdata'
 
let db: SQLiteDBConnection | null = null
let initialized = false
 
const sqliteConnection = new SQLiteConnection(CapacitorSQLite)
 
const figurinhasPadrao = [
  {
    nome: 'Neymar',
    selecao: 'Brasil',
    foto: 'src/imgs/neymar.jpg',
    coletada: false,
    raridade: 'Comum'
  },
  {
    nome: 'Messi',
    selecao: 'Argentina',
    foto: 'src/imgs/messi.jpg',
    coletada: true,
    raridade: 'Brilhante'
  },
  {
    nome: 'Mbappé',
    selecao: 'França',
    foto: 'src/imgs/mbappe.jpg',
    coletada: false,
    raridade: 'Rara'
  },
  {
    nome: 'Vinicius Jr',
    selecao: 'Brasil',
    foto: 'src/imgs/vinijr.jpg',
    coletada: false,
    raridade: 'Rara'
  },
  {
    nome: 'Haaland',
    selecao: 'Noruega',
    foto: 'src/imgs/haaland.jpg',
    coletada: false,
    raridade: 'Comum'
  }
]

const achievementDefinitions = [
  {
    id: 1,
    nome: 'Primeira Figurinha',
    descricao: 'Desbloquear ao coletar a primeira figurinha.',
    icone: '🥇'
  },
  {
    id: 2,
    nome: 'Iniciante',
    descricao: 'Coletar 10 figurinhas.',
    icone: '🌱'
  },
  {
    id: 3,
    nome: 'Colecionador',
    descricao: 'Coletar 25 figurinhas.',
    icone: '🧺'
  },
  {
    id: 4,
    nome: 'Álbum em Construção',
    descricao: 'Coletar 50 figurinhas.',
    icone: '📚'
  },
  {
    id: 5,
    nome: 'Caçador de Raras',
    descricao: 'Coletar 5 figurinhas raras.',
    icone: '🦌'
  },
  {
    id: 6,
    nome: 'Especialista em Raras',
    descricao: 'Coletar 15 figurinhas raras.',
    icone: '💎'
  },
  {
    id: 7,
    nome: 'Brilho Inicial',
    descricao: 'Coletar 3 figurinhas brilhantes.',
    icone: '✨'
  },
  {
    id: 8,
    nome: 'Mestre das Brilhantes',
    descricao: 'Coletar 10 figurinhas brilhantes.',
    icone: '🌟'
  },
  {
    id: 9,
    nome: 'Álbum Quase Completo',
    descricao: 'Completar 80% do álbum.',
    icone: '🏁'
  },
  {
    id: 10,
    nome: 'Campeão da Copa',
    descricao: 'Completar 100% do álbum.',
    icone: '🏆'
  },
  {
    id: 11,
    nome: 'Coleção Brasil',
    descricao: 'Completar todas as figurinhas da seleção brasileira.',
    icone: '🇧🇷'
  },
  {
    id: 12,
    nome: 'Coleção Argentina',
    descricao: 'Completar todas as figurinhas da seleção argentina.',
    icone: '🇦🇷'
  }
]

async function ensureDatabase() {
  if (initialized && db) {
    return
  }
 
  try {
    if (!db) {
      db = await sqliteConnection.createConnection(
        dbName,
        false,
        'no-encryption',
        1,
        false
      )
    }
 
    await db.open()
 
    await db.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        login TEXT NOT NULL UNIQUE,
        senha TEXT
      );
    `)

    await db.execute(`
CREATE TABLE IF NOT EXISTS figurinhas(
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  selecao TEXT NOT NULL,
  foto TEXT NOT NULL,
  coletada INTEGER DEFAULT 0,
  raridade TEXT NOT NULL
);
`)

    await db.execute(`
      CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY,
        nome TEXT NOT NULL,
        descricao TEXT NOT NULL,
        icone TEXT NOT NULL
      );
    `)

    await db.execute(`
      CREATE TABLE IF NOT EXISTS user_achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        achievement_id INTEGER NOT NULL,
        data_desbloqueio TEXT,
        UNIQUE(user_id, achievement_id)
      );
    `)
 
    await db.execute(`
      CREATE TABLE IF NOT EXISTS contatos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL,
        telefone TEXT
      );
    `)

    const countResult = await getDB().query('SELECT COUNT(*) AS total FROM figurinhas;')
    const total = Number(countResult.values?.[0]?.total ?? 0)

    if (total === 0) {
      for (const figurinha of figurinhasPadrao) {
        await getDB().run(
          `INSERT INTO figurinhas (nome, selecao, foto, coletada, raridade) VALUES (?, ?, ?, ?, ?);`,
          [
            figurinha.nome,
            figurinha.selecao,
            figurinha.foto,
            figurinha.coletada ? 1 : 0,
            figurinha.raridade
          ]
        )
      }
    }

    const achievementsCountResult = await getDB().query('SELECT COUNT(*) AS total FROM achievements;')
    const achievementsTotal = Number(achievementsCountResult.values?.[0]?.total ?? 0)

    if (achievementsTotal === 0) {
      for (const achievement of achievementDefinitions) {
        await getDB().run(
          `INSERT INTO achievements (id, nome, descricao, icone) VALUES (?, ?, ?, ?);`,
          [achievement.id, achievement.nome, achievement.descricao, achievement.icone]
        )
      }
    }
 
    initialized = true
 
    console.log('Banco inicializado com sucesso')
  } catch (error) {
    console.error('Erro ao inicializar banco', error)
    throw error
  }
}
 
export function getDB() {
  if (!db) {
    throw new Error('Banco de dados ainda não inicializado')
  }
 
  return db
}

function getCurrentUserId() {
  if (typeof window === 'undefined') {
    return null
  }

  const sessao = localStorage.getItem('usuarioLogado')

  if (!sessao) {
    return null
  }

  try {
    const dados = JSON.parse(sessao) as { id?: number }
    return dados.id ?? null
  } catch (error) {
    console.error('Erro ao ler usuário atual', error)
    return null
  }
}

export async function recalcularConquistasDB(userId: number | null = getCurrentUserId()) {
  await ensureDatabase()

  if (!userId) {
    return []
  }

  const totalFigurinhasResult = await getDB().query('SELECT COUNT(*) AS total FROM figurinhas;')
  const totalFigurinhas = Number(totalFigurinhasResult.values?.[0]?.total ?? 0)

  const coletadasResult = await getDB().query('SELECT COUNT(*) AS total FROM figurinhas WHERE coletada = 1;')
  const totalColetadas = Number(coletadasResult.values?.[0]?.total ?? 0)

  const rarasResult = await getDB().query("SELECT COUNT(*) AS total FROM figurinhas WHERE coletada = 1 AND raridade = 'Rara';")
  const rarasColetadas = Number(rarasResult.values?.[0]?.total ?? 0)

  const brilhantesResult = await getDB().query("SELECT COUNT(*) AS total FROM figurinhas WHERE coletada = 1 AND raridade = 'Brilhante';")
  const brilhantesColetadas = Number(brilhantesResult.values?.[0]?.total ?? 0)

  const brasilTotalResult = await getDB().query("SELECT COUNT(*) AS total FROM figurinhas WHERE selecao = 'Brasil';")
  const brasilTotal = Number(brasilTotalResult.values?.[0]?.total ?? 0)

  const brasilColetadasResult = await getDB().query("SELECT COUNT(*) AS total FROM figurinhas WHERE selecao = 'Brasil' AND coletada = 1;")
  const brasilColetadas = Number(brasilColetadasResult.values?.[0]?.total ?? 0)

  const argentinaTotalResult = await getDB().query("SELECT COUNT(*) AS total FROM figurinhas WHERE selecao = 'Argentina';")
  const argentinaTotal = Number(argentinaTotalResult.values?.[0]?.total ?? 0)

  const argentinaColetadasResult = await getDB().query("SELECT COUNT(*) AS total FROM figurinhas WHERE selecao = 'Argentina' AND coletada = 1;")
  const argentinaColetadas = Number(argentinaColetadasResult.values?.[0]?.total ?? 0)

  const percentual = totalFigurinhas > 0 ? totalColetadas / totalFigurinhas : 0

  const desbloqueadas = new Set<number>()

  if (totalColetadas >= 1) desbloqueadas.add(1)
  if (totalColetadas >= 10) desbloqueadas.add(2)
  if (totalColetadas >= 25) desbloqueadas.add(3)
  if (totalColetadas >= 50) desbloqueadas.add(4)
  if (rarasColetadas >= 5) desbloqueadas.add(5)
  if (rarasColetadas >= 15) desbloqueadas.add(6)
  if (brilhantesColetadas >= 3) desbloqueadas.add(7)
  if (brilhantesColetadas >= 10) desbloqueadas.add(8)
  if (percentual >= 0.8) desbloqueadas.add(9)
  if (percentual >= 1) desbloqueadas.add(10)
  if (brasilTotal > 0 && brasilColetadas >= brasilTotal) desbloqueadas.add(11)
  if (argentinaTotal > 0 && argentinaColetadas >= argentinaTotal) desbloqueadas.add(12)

  await getDB().run('DELETE FROM user_achievements WHERE user_id = ?;', [userId])

  for (const achievementId of desbloqueadas) {
    await getDB().run(
      'INSERT INTO user_achievements (user_id, achievement_id, data_desbloqueio) VALUES (?, ?, ?);',
      [userId, achievementId, new Date().toISOString()]
    )
  }

  return Array.from(desbloqueadas)
}

export async function listarConquistasDB(userId: number | null = getCurrentUserId()) {
  await ensureDatabase()

  const idParaBuscar = userId ?? -1

  const result = await getDB().query(
    `SELECT a.id, a.nome, a.descricao, a.icone, CASE WHEN ua.id IS NOT NULL THEN 1 ELSE 0 END AS desbloqueada, ua.data_desbloqueio
     FROM achievements a
     LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = ?
     ORDER BY a.id;`,
    [idParaBuscar]
  )

  return (result.values || []).map((item: any) => ({
    ...item,
    desbloqueada: Boolean(item.desbloqueada),
    data_desbloqueio: item.data_desbloqueio ?? null
  }))
}
 
export async function initDatabase() {
  try {
    await ensureDatabase()
  } catch (error) {
    console.error('Erro ao iniciar DB', error)
    throw error
  }
  
}
 

/* ==========================
   USUÁRIOS
========================== */
 
export async function addUsuario(
  nome: string,
  login: string,
  senha: string
) {
  await ensureDatabase()
 
  const query =
    'INSERT INTO usuarios (nome, login, senha) VALUES (?, ?, ?);'
 
  await getDB().run(query, [nome, login, senha])
}
 
export async function updateUsuario(
  id: number,
  nome: string,
  login: string,
  senha: string
) {
  await ensureDatabase()
 
  const query =
    'UPDATE usuarios SET nome = ?, login = ?, senha = ? WHERE id = ?;'
 
  await getDB().run(query, [nome, login, senha, id])
}
 
export async function realizarLogin(
  login: string,
  senha: string
) {
  await ensureDatabase()
 
  const query =
    'SELECT * FROM usuarios WHERE login = ? AND senha = ?;'
 
  const result = await getDB().query(query, [login, senha])
 
  return result.values || []
}
 
export async function listUsuarios() {
  await ensureDatabase()
 
  const result = await getDB().query(
    'SELECT id, nome, login FROM usuarios;'
  )
 
  return result.values || []
}
 
export async function findUsuarioById(id: number) {
  await ensureDatabase()
 
  const query =
    'SELECT id, nome, login FROM usuarios WHERE id = ?;'
 
  const result = await getDB().query(query, [id])
 
  return result.values?.[0] || null
}
 
/* ==========================
   CONTATOS
========================== */
 
export async function addContato(
  nome: string,
  email: string,
  telefone: string
) {
  await ensureDatabase()
 
  const query =
    'INSERT INTO contatos (nome, email, telefone) VALUES (?, ?, ?);'
 
  await getDB().run(query, [nome, email, telefone])
}
 
export async function listContatos() {
  await ensureDatabase()
 
  const result = await getDB().query(
    'SELECT * FROM contatos;'
  )
 
  return result.values || []
}
 
export async function deleteContatoById(id: number) {
  await ensureDatabase()
 
  const query =
    'DELETE FROM contatos WHERE id = ?;'
 
  return await getDB().run(query, [id])
}
 
export async function updateContato(
  id: number,
  nome: string,
  email: string,
  telefone: string
) {
  await ensureDatabase()
 
  const query =
    'UPDATE contatos SET nome = ?, email = ?, telefone = ? WHERE id = ?;'
 
  await getDB().run(query, [
    nome,
    email,
    telefone,
    id
  ])
}
 
export async function findContatoById(id: number) {
  await ensureDatabase()
 
  const query =
    'SELECT * FROM contatos WHERE id = ?;'
 
  const result = await getDB().query(query, [id])
 
  return result.values || []
}

/* ==========================
   FIGURINHAS
========================== */

export async function addFigurinhaDB(payload: {
  nome: string
  selecao: string
  foto: string
  coletada?: boolean
  raridade: string
}) {
  await ensureDatabase()

  const query = `
    INSERT INTO figurinhas (nome, selecao, foto, coletada, raridade)
    VALUES (?, ?, ?, ?, ?);
  `

  await getDB().run(query, [
    payload.nome,
    payload.selecao,
    payload.foto,
    payload.coletada ? 1 : 0,
    payload.raridade
  ])

  const result = await getDB().query('SELECT last_insert_rowid() AS id;')
  const id = Number(result.values?.[0]?.id ?? 0)

  return {
    id,
    ...payload,
    coletada: Boolean(payload.coletada)
  }
}

export async function listarFigurinhasDB() {
  await ensureDatabase()

  const result = await getDB().query(
    'SELECT id, nome, selecao, foto, coletada, raridade FROM figurinhas ORDER BY id;'
  )

  return (result.values || []).map((item: any) => ({
    ...item,
    coletada: Boolean(item.coletada)
  }))
}

export async function atualizarFigurinhaDB(id: number, updates: Partial<{
  nome: string
  selecao: string
  foto: string
  coletada: boolean
  raridade: string
}>) {
  await ensureDatabase()

  const campos: string[] = []
  const valores: any[] = []

  if (updates.nome !== undefined) {
    campos.push('nome = ?')
    valores.push(updates.nome)
  }

  if (updates.selecao !== undefined) {
    campos.push('selecao = ?')
    valores.push(updates.selecao)
  }

  if (updates.foto !== undefined) {
    campos.push('foto = ?')
    valores.push(updates.foto)
  }

  if (updates.coletada !== undefined) {
    campos.push('coletada = ?')
    valores.push(updates.coletada ? 1 : 0)
  }

  if (updates.raridade !== undefined) {
    campos.push('raridade = ?')
    valores.push(updates.raridade)
  }

  if (campos.length === 0) {
    return null
  }

  valores.push(id)

  await getDB().run(
    `UPDATE figurinhas SET ${campos.join(', ')} WHERE id = ?;`,
    valores
  )

  if (updates.coletada !== undefined) {
    await recalcularConquistasDB()
  }

  const result = await getDB().query(
    'SELECT id, nome, selecao, foto, coletada, raridade FROM figurinhas WHERE id = ?;',
    [id]
  )

  const item = result.values?.[0]

  return item ? { ...item, coletada: Boolean(item.coletada) } : null
}

export async function pesquisarFigurinhasDB(termo: string) {
  await ensureDatabase()

  const busca = `%${termo}%`

  const result = await getDB().query(
    'SELECT id, nome, selecao, foto, coletada, raridade FROM figurinhas WHERE nome LIKE ? OR selecao LIKE ? ORDER BY id;',
    [busca, busca]
  )

  return (result.values || []).map((item: any) => ({
    ...item,
    coletada: Boolean(item.coletada)
  }))
}

export async function filtrarFigurinhasDB(options: { termo?: string; coletada?: boolean | null }) {
  await ensureDatabase()

  const whereClauses: string[] = []
  const valores: any[] = []

  const termo = options.termo?.trim() ?? ''
  if (termo) {
    whereClauses.push('(nome LIKE ? OR selecao LIKE ?)')
    valores.push(`%${termo}%`, `%${termo}%`)
  }

  if (options.coletada !== undefined && options.coletada !== null) {
    whereClauses.push('coletada = ?')
    valores.push(options.coletada ? 1 : 0)
  }

  const whereSql = whereClauses.length > 0 ? ` WHERE ${whereClauses.join(' AND ')}` : ''
  const query = `SELECT id, nome, selecao, foto, coletada, raridade FROM figurinhas${whereSql} ORDER BY id;`

  const result = await getDB().query(query, valores)

  return (result.values || []).map((item: any) => ({
    ...item,
    coletada: Boolean(item.coletada)
  }))
}