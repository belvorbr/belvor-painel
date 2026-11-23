# Painel Bëlvor (teste com login)

Site estático. Login pelo Supabase Auth; os dados vêm só das funções `painel_*`,
que conferem o perfil de quem está logado (tabela `painel_usuarios`).
A chave em `app.js` é a chave pública (publishable): sozinha não lê nenhum dado.
