// Modelo do checklist do diagnóstico (espelha checklist-diagnostico.md).
// As chaves (key) ficam gravadas no banco: não renomeie uma chave já em uso;
// para mudar o texto, altere só o label.

export type ChecklistItem = { key: string; label: string };
export type ChecklistGroup = { title: string; items: ChecklistItem[] };
export type ChecklistSection = {
  key: string;
  title: string;
  description?: string;
  scored: boolean;
  groups: ChecklistGroup[];
};

export const CHECKLIST: ChecklistSection[] = [
  {
    key: "levantamento",
    title: "Etapa 0 — Levantamento inicial",
    description: "O que juntar antes de começar a análise.",
    scored: false,
    groups: [
      {
        title: "Dados do cliente",
        items: [
          { key: "lev.empresa", label: "Nome da empresa, segmento e cidade" },
          { key: "lev.porte", label: "Porte (faturamento ou nº de funcionários) e ticket médio" },
          { key: "lev.objetivo", label: "Objetivo comercial principal (leads, autoridade, recorrência)" },
        ],
      },
      {
        title: "Canais e acessos",
        items: [
          { key: "lev.site", label: "URL do site" },
          { key: "lev.instagram", label: "@ do Instagram" },
          { key: "lev.gmn", label: "Link ou nome exato do Google Meu Negócio" },
          { key: "lev.whatsapp", label: "Número do WhatsApp comercial" },
          { key: "lev.bm_admin", label: "Quem administra hoje o Business Manager / anúncios" },
          { key: "lev.pedidos", label: "Acessos ou prints solicitados ao cliente" },
        ],
      },
    ],
  },
  {
    key: "site",
    title: "Etapa 1 — Site institucional",
    scored: true,
    groups: [
      {
        title: "Proposta de valor",
        items: [
          { key: "site.proposta_5s", label: "Em até 5 segundos dá para entender o que a empresa faz e para quem" },
          { key: "site.primeira_dobra", label: "A primeira dobra tem título claro, não só imagem bonita" },
        ],
      },
      {
        title: "WhatsApp",
        items: [
          { key: "site.wpp_botao", label: "Existe botão de WhatsApp visível (flutuante ou em destaque)" },
          { key: "site.wpp_numero", label: "O botão abre o número comercial correto" },
          { key: "site.wpp_mensagem", label: "A mensagem pré-preenchida faz sentido" },
        ],
      },
      {
        title: "Rastreamento (Pixel/GTM)",
        items: [
          { key: "site.pixel", label: "Pixel da Meta instalado e disparando" },
          { key: "site.gtm", label: "Google Tag Manager / Google Tag instalado" },
          { key: "site.eventos", label: "Eventos de conversão configurados (clique no WhatsApp, formulário)" },
        ],
      },
      {
        title: "CTAs",
        items: [
          { key: "site.cta_paginas", label: "Cada página tem uma chamada para ação clara" },
          { key: "site.cta_destino", label: "Os CTAs levam a um próximo passo real (WhatsApp, formulário, agendamento)" },
          { key: "site.formularios", label: "Formulários são curtos (poucos campos)" },
        ],
      },
      {
        title: "Prova social",
        items: [
          { key: "site.depoimentos", label: "Depoimentos de clientes" },
          { key: "site.cases", label: "Cases, resultados ou portfólio" },
          { key: "site.selos", label: "Logos de clientes, selos, certificações ou números de autoridade" },
        ],
      },
      {
        title: "Indexação no Google Search",
        items: [
          { key: "site.busca_nome", label: "O site aparece ao buscar o nome da empresa" },
          { key: "site.indexadas", label: "Páginas principais indexadas (site:dominio.com.br)" },
          { key: "site.meta", label: "Títulos e meta descrições preenchidos e coerentes" },
        ],
      },
      {
        title: "Velocidade e mobile",
        items: [
          { key: "site.pagespeed", label: "Teste no PageSpeed Insights (registrar nota mobile e desktop nas observações)" },
          { key: "site.mobile", label: "O site abre bem no celular (layout, botões, leitura)" },
        ],
      },
      {
        title: "Extras",
        items: [
          { key: "site.links_redes", label: "Links de redes sociais funcionam e levam aos perfis corretos" },
          { key: "site.sem_erros", label: "Sem páginas quebradas ou erros evidentes" },
        ],
      },
    ],
  },
  {
    key: "instagram",
    title: "Etapa 2 — Instagram",
    scored: true,
    groups: [
      {
        title: "Bio",
        items: [
          { key: "ig.bio_clara", label: "Diz claramente o que a empresa faz e para quem" },
          { key: "ig.bio_local", label: "Tem localização ou área de atendimento, se for negócio local" },
          { key: "ig.bio_cta", label: "Tem chamada para ação" },
        ],
      },
      {
        title: "Link",
        items: [
          { key: "ig.link_existe", label: "Existe link na bio" },
          { key: "ig.link_destino", label: "O link funciona e leva a um destino útil (WhatsApp, site, captura)" },
        ],
      },
      {
        title: "Destaques",
        items: [
          { key: "ig.destaques_org", label: "Destaques organizados e com capas padronizadas" },
          { key: "ig.destaques_duvidas", label: "Respondem dúvidas frequentes (serviços, preços, como funciona)" },
          { key: "ig.destaques_prova", label: "Mostram prova social (depoimentos, antes e depois, bastidores)" },
        ],
      },
      {
        title: "Frequência de publicação",
        items: [
          { key: "ig.ultimo_post", label: "Registrar a data do último post (nas observações)" },
          { key: "ig.posts_30d", label: "Registrar o nº de posts nos últimos 30 dias (nas observações)" },
          { key: "ig.formatos", label: "Mistura formatos (Reels, carrossel, estático)" },
          { key: "ig.ganchos", label: "Conteúdos têm gancho nos primeiros segundos e chamada para ação" },
        ],
      },
      {
        title: "Social selling",
        items: [
          { key: "ig.aborda_seguidores", label: "A empresa aborda novos seguidores no direct" },
          { key: "ig.script", label: "Existe script de boas-vindas ou abordagem" },
          { key: "ig.responde", label: "Responde comentários e directs com agilidade" },
          { key: "ig.engajamento", label: "Engajamento coerente com o nº de seguidores e o público-alvo" },
        ],
      },
    ],
  },
  {
    key: "gmn",
    title: "Etapa 3 — Google Meu Negócio",
    scored: true,
    groups: [
      {
        title: "Reivindicação do perfil",
        items: [
          { key: "gmn.existe", label: "O perfil existe" },
          { key: "gmn.verificado", label: "Está reivindicado e verificado pela empresa" },
          { key: "gmn.conta_empresa", label: "Está no e-mail ou conta da própria empresa" },
        ],
      },
      {
        title: "Score (via ferramenta)",
        items: [
          { key: "gmn.score", label: "Rodar a ferramenta de score e registrar o resultado (nas observações)" },
          { key: "gmn.categoria", label: "Categoria principal correta e secundárias preenchidas" },
          { key: "gmn.info", label: "Informações completas: endereço, horário, telefone, site, WhatsApp" },
          { key: "gmn.descricao", label: "Descrição preenchida com os serviços e palavras-chave" },
        ],
      },
      {
        title: "Avaliações",
        items: [
          { key: "gmn.qtd_nota", label: "Registrar nº de avaliações e nota média (nas observações)" },
          { key: "gmn.responde", label: "A empresa responde às avaliações (positivas e negativas)" },
          { key: "gmn.rotina", label: "Existe rotina para pedir avaliações a clientes" },
        ],
      },
      {
        title: "Fotos",
        items: [
          { key: "gmn.logo_capa", label: "Logo e foto de capa" },
          { key: "gmn.fotos_recentes", label: "Fotos recentes de fachada, ambiente, equipe e produtos/serviços" },
          { key: "gmn.fotos_qualidade", label: "Quantidade e qualidade adequadas (sem sensação de abandono)" },
        ],
      },
      {
        title: "Aba de novidades",
        items: [
          { key: "gmn.novidades", label: "Usa a aba de novidades/postagens" },
          { key: "gmn.ultima_novidade", label: "Registrar a data da última postagem (nas observações)" },
        ],
      },
    ],
  },
  {
    key: "bm",
    title: "Etapa 4 — Business Manager (alerta de risco)",
    description: "Não recebe nota. Se houver risco, entra como alerta de prioridade alta.",
    scored: false,
    groups: [
      {
        title: "Propriedade do BM",
        items: [
          { key: "bm.nome_empresa", label: "O Business Manager está em nome da empresa" },
          { key: "bm.dois_admins", label: "Há pelo menos dois administradores da própria empresa" },
        ],
      },
      {
        title: "Contas de anúncio",
        items: [
          { key: "bm.contas_empresa", label: "Contas de anúncio pertencem ao BM da empresa (não a terceiros)" },
          { key: "bm.pagamento", label: "A forma de pagamento é da empresa" },
        ],
      },
      {
        title: "Pixel",
        items: [
          { key: "bm.pixel_empresa", label: "O pixel pertence ao BM da empresa" },
          { key: "bm.dominio", label: "O domínio do site está verificado no BM" },
        ],
      },
      {
        title: "Páginas",
        items: [
          { key: "bm.pagina_fb", label: "A página do Facebook pertence ao BM da empresa" },
          { key: "bm.instagram", label: "A conta do Instagram está conectada ao BM da empresa" },
        ],
      },
      {
        title: "Risco",
        items: [
          { key: "bm.risco_acesso", label: "Avaliado se a empresa perde acesso caso rompa com quem administra hoje" },
          { key: "bm.nivel_risco", label: "Registrar nível de risco: baixo, médio ou alto (nas observações)" },
        ],
      },
    ],
  },
  {
    key: "fechamento",
    title: "Etapa 5 — Fechamento do diagnóstico",
    scored: false,
    groups: [
      {
        title: "Consolidação",
        items: [
          { key: "fim.notas", label: "Nota de cada canal registrada, com justificativa de uma linha" },
          { key: "fim.impacto", label: "Para cada problema: impacto no negócio (lead perdido, dinheiro parado ou risco)" },
          { key: "fim.acao", label: "Para cada problema: ação correspondente" },
          { key: "fim.prioridade", label: "Ações separadas em Quick Wins e Movimentos Estruturais" },
          { key: "fim.nota_geral", label: "Nota geral calculada" },
          { key: "fim.resumo", label: "Resumo executivo escrito (3 a 5 frases)" },
          { key: "fim.entregue", label: "Relatório revisado e entregue" },
        ],
      },
    ],
  },
];

export const ALL_ITEM_KEYS = CHECKLIST.flatMap((s) => s.groups.flatMap((g) => g.items.map((i) => i.key)));
export const SECTION_KEYS = CHECKLIST.map((s) => s.key);
export const TOTAL_ITEMS = ALL_ITEM_KEYS.length;

export const SECTION_STATUS = {
  pendente: "Pendente",
  avaliado: "Avaliado",
  parcial: "Parcial",
  nao_avaliado: "Não avaliado (sem acesso)",
} as const;

export type SectionStatus = keyof typeof SECTION_STATUS;

export const CLIENT_STATUS = {
  em_andamento: "Em andamento",
  concluido: "Concluído",
  arquivado: "Arquivado",
} as const;

export type ClientStatus = keyof typeof CLIENT_STATUS;
