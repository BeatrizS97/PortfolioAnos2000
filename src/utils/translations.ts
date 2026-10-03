// src/utils/translations.ts
import type { Language } from '../types/language';

// Traduções de textos fixos do site (menus, botões, mensagens de erro, etc.) para português, inglês e espanhol.
const pt = {
  locale: 'pt-BR',

  shell: {
    documentTitle: 'Meu Computador - Portfólio',
    windowTitles: { orkut: 'Orkut - Meu Perfil', msn: 'MSN Messenger', about: 'Meu Computador', trash: 'Lixeira' },
    desktopIcons: {
      myComputer: 'Meu Computador',
      documents: 'Meus Documentos',
      orkut: 'Orkut',
      msn: 'MSN Messenger',
      trash: 'Lixeira',
    },
    taskbar: { start: 'Iniciar', language: 'Idioma', mute: 'Silenciar', unmute: 'Ativar som', network: 'Rede' },
    windowControls: { minimize: 'Minimizar', close: 'Fechar' },
    startMenu: {
      orkutSubtitle: 'Meu perfil e projetos',
      msnSubtitle: 'Conversar com a IA da Bia',
      recentDocuments: 'Documentos recentes',
      resumeFile: 'Currículo.pdf',
      myComputer: 'Meu Computador',
      myPictures: 'Minhas Imagens',
      trash: 'Lixeira',
      controlPanel: 'Painel de Controle',
      run: 'Executar...',
      logOff: 'Log Off',
      shutDown: 'Desligar',
      comingSoon: 'Em breve',
    },
    about: {
      title: 'Sobre mim',
      paragraph1:
        'Beatriz Silva Santos — Desenvolvedora Full Stack Júnior, formada em Análise e Desenvolvimento de Sistemas (FATEC). Atuo com React.js, Next.js, TypeScript no front-end e C#/.NET no back-end, com passagem também por PHP e SQL.',
      paragraph2:
        'Abra o Orkut para ver o perfil completo (projetos, skills e depoimentos) ou espere o MSN chamar. 😉',
    },
    trash: { message: 'A lixeira está vazia... ou será que não? 👀' },
    boot: { ariaLabel: 'Carregando ambiente', caption: 'Portfólio', title: 'Retrô', skip: 'pular »' },
  },

  orkut: {
    searchPlaceholder: 'Buscar no orkut...',
    searchLabel: 'Buscar',
    tabs: { home: 'Home', perfil: 'Perfil', scraps: 'Scraps', comunidades: 'Comunidades' },
    online: 'Online',
    welcome: (name: string) => `Bem-vindo(a), ${name}!`,
    quickLinks: {
      fullProfile: 'Ver perfil completo',
      writeTestimonial: 'Escrever depoimento',
      testimonialTooltip: 'Ao enviar um "depoimento", um e-mail será enviado para a Beatriz.',
      downloadResume: 'Baixar currículo em PDF',
    },
    commentsTitle: (n: number) => `Comentários (${n})`,
    commentsCount: (n: number) => `${n} comentários`,
    projectsCount: (n: number) => `${n} projetos`,
    projectsTitle: 'Meus Projetos (álbum de fotos)',
    loading: 'Carregando...',
    seeMore: 'Ver mais',
    seeLess: 'Ver menos',
  },

  scraps: {
    namePlaceholder: 'Seu nome',
    messagePlaceholder: 'Deixe um recado...',
    send: 'Enviar recado',
    sending: 'Enviando...',
    saveError: 'Não foi possível salvar seu recado agora. Tente novamente em instantes.',
    deleteLabel: 'Excluir recado',
    deleteConfirm: 'Excluir este recado?',
    deleteError: 'Não foi possível excluir. Tente novamente.',
    prevPage: 'Anterior',
    nextPage: 'Próxima',
    adminLoginLabel: 'Sou a Beatriz',
    adminLogoutLabel: 'Sair do modo admin',
    adminPromptLabel: 'Chave de administrador:',
  },

  friends: {
    title: 'Amigos',
    seeAll: 'ver todos »',
  },

  communities: {
    title: 'Comunidades',
    seeAll: 'ver todas »',
    members: 'membros',
  },

  projects: {
    empty: 'Nenhum projeto encontrado ainda.',
    github: 'GitHub',
    viewOnline: 'Ver online',
  },

  testimonials: {
    title: 'Depoimentos',
    empty: 'Ainda não há depoimentos.',
    items: [
      {
        author: 'Membro da diretoria',
        role: 'Associação Pedra Que Canta',
        text: 'Como vice-presidente por 3 anos, ela conduziu a equipe voluntária com muita organização, mesmo com recursos limitados.',
      },
    ],
  },

  testimonialForm: {
    ariaLabel: 'Deixar um depoimento',
    title: 'Escrever depoimento',
    close: 'Fechar',
    sent: 'Depoimento enviado! Obrigada 💌',
    closeButton: 'fechar',
    to: 'Para:',
    namePlaceholder: 'Seu nome',
    emailPlaceholder: 'Seu e-mail',
    messagePlaceholder: 'Escreva seu depoimento...',
    error: 'Erro ao enviar, tente novamente.',
    post: 'postar',
    sending: 'enviando...',
    cancel: 'cancelar',
  },

  luckyMessage: {
    title: 'Sorte de hoje',
    messages: [
      'Hoje é um bom dia para aprender algo novo em Node.js.',
      'Um código limpo hoje evita um bug amanhã.',
      'Liderar é servir — não esqueça disso na próxima daily.',
      'A próxima grande oportunidade pode estar a um commit de distância.',
    ],
  },

  profileDetails: {
    aboutTitle: 'Sobre mim',
    aboutExtra:
      'Minha formação em Letras reforça minha comunicação e trabalho em equipes multidisciplinares (design, produto, QA). Estou aberta a oportunidades como Desenvolvedora Front-End ou Full Stack Júnior — vamos conversar?',
    contactTitle: 'Contato',
    emailLabel: 'E-mail',
    educationTitle: 'Formação acadêmica',
    languagesTitle: 'Idiomas',
    exchangeTitle: 'Intercâmbio',
    exchange:
      'Um mês de imersão em Dublin, Irlanda, na ISI Dublin – English Language School (jul–ago/2025), curso de inglês geral nível A2. A vivência reforçou autonomia, comunicação intercultural e adaptabilidade em um ambiente totalmente novo.',
    certificationsTitle: 'Certificações',
    experienceTitle: 'Experiência & Voluntariado',
    publicationTitle: 'Publicação científica',
  },

  msn: {
    contactName: 'Suporte IA Beatriz',
    toolbar: {
      invite: 'Convidar',
      sendFile: 'Enviar arquivo',
      webcam: 'Webcam',
      audio: 'Áudio',
      activities: 'Atividades',
      games: 'Jogos',
      comingSoon: 'Em breve',
    },
    notification: {
      close: 'Fechar notificação',
      text: 'acabou de ficar disponível para conversar.',
      options: 'Opções',
    },
    greeting: 'Oi! Eu sou a assistente virtual da Beatriz :) Pergunte sobre projetos, tecnologias ou carreira!',
    to: 'Para:',
    securityTip: 'Nunca informe sua senha ou dados de cartão em uma conversa.',
    botSays: 'Suporte IA Beatriz diz:',
    userSays: 'Você diz:',
    you: 'Você',
    viewProjects: 'Ver Projetos',
    nudge: 'Nudge',
    nudgeSent: 'Você acabou de enviar um nudge!',
    tools: { font: 'Fonte', emoticons: 'Emoticons', winks: 'Winks', backgrounds: 'Planos de fundo' },
    inputPlaceholder: 'Digite uma pergunta...',
    send: 'Enviar',
    lastMessage: (dateText: string, timeText: string) =>
      `Última mensagem recebida em ${dateText} às ${timeText}.`,
    fallbackAnswer: 'Não tenho essa resposta ainda — que tal usar o formulário de contato?',
    kb: [
      { keywords: ['projeto', 'projetos'], answer: 'Você pode ver todos os projetos no perfil dela — já vou te levar lá!' },
      { keywords: ['stack', 'tecnologia', 'tecnologias'], answer: 'Trabalho principalmente com React.js, Next.js, TypeScript, C# e .NET.' },
      { keywords: ['contato', 'email', 'e-mail'], answer: 'Você pode entrar em contato pelo formulário do site ou pelo LinkedIn!' },
      { keywords: ['disponível', 'disponibilidade', 'vaga'], answer: 'A Beatriz está aberta a oportunidades como Desenvolvedora Front-end/Full Stack Júnior!' },
      { keywords: ['idioma', 'idiomas', 'inglês', 'espanhol'], answer: 'Fala português nativo, inglês nível B1 e espanhol nível A2.' },
      { keywords: ['certificação', 'certificado', 'certificações'], answer: 'Tem certificações em Scrum Fundamentals, Formação Web Essencial (BIT) e Crescendo no Trabalho (JobRise), entre outras — veja na aba Perfil!' },
    ],
  },
};

export type Translations = typeof pt;

const en: Translations = {
  locale: 'en-US',

  shell: {
    documentTitle: 'My Computer - Portfolio',
    windowTitles: { orkut: 'Orkut - My Profile', msn: 'MSN Messenger', about: 'My Computer', trash: 'Recycle Bin' },
    desktopIcons: {
      myComputer: 'My Computer',
      documents: 'My Documents',
      orkut: 'Orkut',
      msn: 'MSN Messenger',
      trash: 'Recycle Bin',
    },
    taskbar: { start: 'Start', language: 'Language', mute: 'Mute', unmute: 'Turn sound on', network: 'Network' },
    windowControls: { minimize: 'Minimize', close: 'Close' },
    startMenu: {
      orkutSubtitle: 'My profile and projects',
      msnSubtitle: "Chat with Bia's AI",
      recentDocuments: 'Recent documents',
      resumeFile: 'Resume.pdf',
      myComputer: 'My Computer',
      myPictures: 'My Pictures',
      trash: 'Recycle Bin',
      controlPanel: 'Control Panel',
      run: 'Run...',
      logOff: 'Log Off',
      shutDown: 'Shut Down',
      comingSoon: 'Coming soon',
    },
    about: {
      title: 'About me',
      paragraph1:
        'Beatriz Silva Santos — Junior Full Stack Developer, graduated in Systems Analysis and Development (FATEC). I work with React.js, Next.js and TypeScript on the front end and C#/.NET on the back end, with some experience in PHP and SQL.',
      paragraph2:
        'Open Orkut to see the full profile (projects, skills and testimonials) or wait for MSN to call. 😉',
    },
    trash: { message: 'The recycle bin is empty... or is it? 👀' },
    boot: { ariaLabel: 'Loading environment', caption: 'Portfolio', title: 'Retro', skip: 'skip »' },
  },

  orkut: {
    searchPlaceholder: 'Search orkut...',
    searchLabel: 'Search',
    tabs: { home: 'Home', perfil: 'Profile', scraps: 'Scraps', comunidades: 'Communities' },
    online: 'Online',
    welcome: (name: string) => `Welcome, ${name}!`,
    quickLinks: {
      fullProfile: 'View full profile',
      writeTestimonial: 'Write testimonial',
      testimonialTooltip: 'When you send a "testimonial", an email will be sent to Beatriz.',
      downloadResume: 'Download resume as PDF',
    },
    commentsTitle: (n: number) => `Comments (${n})`,
    commentsCount: (n: number) => `${n} comments`,
    projectsCount: (n: number) => `${n} projects`,
    projectsTitle: 'My Projects (photo album)',
    loading: 'Loading...',
    seeMore: 'See more',
    seeLess: 'See less',
  },

  scraps: {
    namePlaceholder: 'Your name',
    messagePlaceholder: 'Leave a message...',
    send: 'Send message',
    sending: 'Sending...',
    saveError: "Couldn't save your message right now. Please try again shortly.",
    deleteLabel: 'Delete message',
    deleteConfirm: 'Delete this message?',
    deleteError: "Couldn't delete it. Please try again.",
    prevPage: 'Previous',
    nextPage: 'Next',
    adminLoginLabel: 'I am Beatriz',
    adminLogoutLabel: 'Exit admin mode',
    adminPromptLabel: 'Administrator key:',
  },

  friends: {
    title: 'Friends',
    seeAll: 'see all »',
  },

  communities: {
    title: 'Communities',
    seeAll: 'see all »',
    members: 'members',
  },

  projects: {
    empty: 'No projects found yet.',
    github: 'GitHub',
    viewOnline: 'View online',
  },

  testimonials: {
    title: 'Testimonials',
    empty: 'There are no testimonials yet.',
    items: [
      {
        author: 'Board member',
        role: 'Pedra Que Canta Association',
        text: 'As vice president for 3 years, she led the volunteer team with great organization, even with limited resources.',
      },
    ],
  },

  testimonialForm: {
    ariaLabel: 'Leave a testimonial',
    title: 'Write testimonial',
    close: 'Close',
    sent: 'Testimonial sent! Thank you 💌',
    closeButton: 'close',
    to: 'To:',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'Your email',
    messagePlaceholder: 'Write your testimonial...',
    error: 'Error sending, please try again.',
    post: 'post',
    sending: 'sending...',
    cancel: 'cancel',
  },

  luckyMessage: {
    title: "Today's luck",
    messages: [
      'Today is a good day to learn something new in Node.js.',
      'Clean code today prevents a bug tomorrow.',
      "To lead is to serve — don't forget that at the next daily.",
      'The next big opportunity may be just one commit away.',
    ],
  },

  profileDetails: {
    aboutTitle: 'About me',
    aboutExtra:
      'My background in Languages and Literature strengthens my communication and my work in multidisciplinary teams (design, product, QA). I am open to opportunities as a Junior Front-End or Full Stack Developer — shall we talk?',
    contactTitle: 'Contact',
    emailLabel: 'Email',
    educationTitle: 'Education',
    languagesTitle: 'Languages',
    exchangeTitle: 'Study abroad',
    exchange:
      'One month of immersion in Dublin, Ireland, at ISI Dublin – English Language School (Jul–Aug/2025), general English course at A2 level. The experience strengthened autonomy, intercultural communication and adaptability in a completely new environment.',
    certificationsTitle: 'Certifications',
    experienceTitle: 'Experience & Volunteering',
    publicationTitle: 'Scientific publication',
  },

  msn: {
    contactName: 'Beatriz AI Support',
    toolbar: {
      invite: 'Invite',
      sendFile: 'Send file',
      webcam: 'Webcam',
      audio: 'Audio',
      activities: 'Activities',
      games: 'Games',
      comingSoon: 'Coming soon',
    },
    notification: {
      close: 'Close notification',
      text: 'just became available to chat.',
      options: 'Options',
    },
    greeting: "Hi! I'm Beatriz's virtual assistant :) Ask me about projects, technologies or career!",
    to: 'To:',
    securityTip: 'Never share your password or card details in a chat.',
    botSays: 'Beatriz AI Support says:',
    userSays: 'You say:',
    you: 'You',
    viewProjects: 'View Projects',
    nudge: 'Nudge',
    nudgeSent: 'You just sent a nudge!',
    tools: { font: 'Font', emoticons: 'Emoticons', winks: 'Winks', backgrounds: 'Backgrounds' },
    inputPlaceholder: 'Type a question...',
    send: 'Send',
    lastMessage: (dateText: string, timeText: string) =>
      `Last message received on ${dateText} at ${timeText}.`,
    fallbackAnswer: "I don't have that answer yet — how about using the contact form?",
    kb: [
      { keywords: ['project', 'projects'], answer: "You can see all the projects on her profile — I'll take you there right away!" },
      { keywords: ['stack', 'technology', 'technologies'], answer: 'I mainly work with React.js, Next.js, TypeScript, C# and .NET.' },
      { keywords: ['contact', 'email', 'e-mail'], answer: 'You can get in touch through the contact form on the site or on LinkedIn!' },
      { keywords: ['available', 'availability', 'job', 'opening'], answer: 'Beatriz is open to opportunities as a Junior Front-end/Full Stack Developer!' },
      { keywords: ['language', 'languages', 'english', 'spanish'], answer: 'She speaks native Portuguese, B1-level English and A2-level Spanish.' },
      { keywords: ['certification', 'certifications', 'certificate'], answer: 'She holds certifications in Scrum Fundamentals, Formação Web Essencial (BIT) and Crescendo no Trabalho (JobRise), among others — check the Profile tab!' },
    ],
  },
};

const es: Translations = {
  locale: 'es-ES',

  shell: {
    documentTitle: 'Mi PC - Portafolio',
    windowTitles: { orkut: 'Orkut - Mi Perfil', msn: 'MSN Messenger', about: 'Mi PC', trash: 'Papelera de reciclaje' },
    desktopIcons: {
      myComputer: 'Mi PC',
      documents: 'Mis documentos',
      orkut: 'Orkut',
      msn: 'MSN Messenger',
      trash: 'Papelera de reciclaje',
    },
    taskbar: { start: 'Inicio', language: 'Idioma', mute: 'Silenciar', unmute: 'Activar sonido', network: 'Red' },
    windowControls: { minimize: 'Minimizar', close: 'Cerrar' },
    startMenu: {
      orkutSubtitle: 'Mi perfil y proyectos',
      msnSubtitle: 'Conversa con la IA de Bia',
      recentDocuments: 'Documentos recientes',
      resumeFile: 'Currículum.pdf',
      myComputer: 'Mi PC',
      myPictures: 'Mis imágenes',
      trash: 'Papelera de reciclaje',
      controlPanel: 'Panel de control',
      run: 'Ejecutar...',
      logOff: 'Cerrar sesión',
      shutDown: 'Apagar',
      comingSoon: 'Próximamente',
    },
    about: {
      title: 'Sobre mí',
      paragraph1:
        'Beatriz Silva Santos — Desarrolladora Full Stack Júnior, graduada en Análisis y Desarrollo de Sistemas (FATEC). Trabajo con React.js, Next.js y TypeScript en el front-end y C#/.NET en el back-end, con experiencia también en PHP y SQL.',
      paragraph2:
        'Abre Orkut para ver el perfil completo (proyectos, skills y testimonios) o espera a que MSN te llame. 😉',
    },
    trash: { message: 'La papelera está vacía... ¿o no? 👀' },
    boot: { ariaLabel: 'Cargando entorno', caption: 'Portafolio', title: 'Retro', skip: 'omitir »' },
  },

  orkut: {
    searchPlaceholder: 'Buscar en orkut...',
    searchLabel: 'Buscar',
    tabs: { home: 'Inicio', perfil: 'Perfil', scraps: 'Scraps', comunidades: 'Comunidades' },
    online: 'En línea',
    welcome: (name: string) => `¡Bienvenido(a), ${name}!`,
    quickLinks: {
      fullProfile: 'Ver perfil completo',
      writeTestimonial: 'Escribir testimonio',
      testimonialTooltip: 'Al enviar un "testimonio", se enviará un correo electrónico a Beatriz.',
      downloadResume: 'Descargar currículum en PDF',
    },
    commentsTitle: (n: number) => `Comentarios (${n})`,
    commentsCount: (n: number) => `${n} comentarios`,
    projectsCount: (n: number) => `${n} proyectos`,
    projectsTitle: 'Mis Proyectos (álbum de fotos)',
    loading: 'Cargando...',
    seeMore: 'Ver más',
    seeLess: 'Ver menos',
  },

  scraps: {
    namePlaceholder: 'Tu nombre',
    messagePlaceholder: 'Deja un mensaje...',
    send: 'Enviar mensaje',
    sending: 'Enviando...',
    saveError: 'No se pudo guardar tu mensaje ahora. Inténtalo de nuevo en unos instantes.',
    deleteLabel: 'Eliminar mensaje',
    deleteConfirm: '¿Eliminar este mensaje?',
    deleteError: 'No se pudo eliminar. Inténtalo de nuevo.',
    prevPage: 'Anterior',
    nextPage: 'Siguiente',
    adminLoginLabel: 'Soy Beatriz',
    adminLogoutLabel: 'Salir del modo admin',
    adminPromptLabel: 'Clave de administrador:',
  },

  friends: {
    title: 'Amigos',
    seeAll: 'ver todos »',
  },

  communities: {
    title: 'Comunidades',
    seeAll: 'ver todas »',
    members: 'miembros',
  },

  projects: {
    empty: 'Aún no se encontraron proyectos.',
    github: 'GitHub',
    viewOnline: 'Ver en línea',
  },

  testimonials: {
    title: 'Testimonios',
    empty: 'Aún no hay testimonios.',
    items: [
      {
        author: 'Miembro de la directiva',
        role: 'Asociación Pedra Que Canta',
        text: 'Como vicepresidenta durante 3 años, condujo al equipo voluntario con mucha organización, incluso con recursos limitados.',
      },
    ],
  },

  testimonialForm: {
    ariaLabel: 'Dejar un testimonio',
    title: 'Escribir testimonio',
    close: 'Cerrar',
    sent: '¡Testimonio enviado! Gracias 💌',
    closeButton: 'cerrar',
    to: 'Para:',
    namePlaceholder: 'Tu nombre',
    emailPlaceholder: 'Tu correo electrónico',
    messagePlaceholder: 'Escribe tu testimonio...',
    error: 'Error al enviar, inténtalo de nuevo.',
    post: 'publicar',
    sending: 'enviando...',
    cancel: 'cancelar',
  },

  luckyMessage: {
    title: 'Suerte de hoy',
    messages: [
      'Hoy es un buen día para aprender algo nuevo en Node.js.',
      'Un código limpio hoy evita un bug mañana.',
      'Liderar es servir — no lo olvides en la próxima daily.',
      'La próxima gran oportunidad puede estar a un commit de distancia.',
    ],
  },

  profileDetails: {
    aboutTitle: 'Sobre mí',
    aboutExtra:
      'Mi formación en Letras refuerza mi comunicación y mi trabajo en equipos multidisciplinarios (diseño, producto, QA). Estoy abierta a oportunidades como Desarrolladora Front-End o Full Stack Júnior — ¿conversamos?',
    contactTitle: 'Contacto',
    emailLabel: 'Correo electrónico',
    educationTitle: 'Formación académica',
    languagesTitle: 'Idiomas',
    exchangeTitle: 'Intercambio',
    exchange:
      'Un mes de inmersión en Dublín, Irlanda, en ISI Dublin – English Language School (jul–ago/2025), curso de inglés general nivel A2. La vivencia reforzó la autonomía, la comunicación intercultural y la adaptabilidad en un entorno totalmente nuevo.',
    certificationsTitle: 'Certificaciones',
    experienceTitle: 'Experiencia y Voluntariado',
    publicationTitle: 'Publicación científica',
  },

  msn: {
    contactName: 'Soporte IA Beatriz',
    toolbar: {
      invite: 'Invitar',
      sendFile: 'Enviar archivo',
      webcam: 'Webcam',
      audio: 'Audio',
      activities: 'Actividades',
      games: 'Juegos',
      comingSoon: 'Próximamente',
    },
    notification: {
      close: 'Cerrar notificación',
      text: 'acaba de conectarse para conversar.',
      options: 'Opciones',
    },
    greeting: '¡Hola! Soy la asistente virtual de Beatriz :) ¡Pregunta sobre proyectos, tecnologías o carrera!',
    to: 'Para:',
    securityTip: 'Nunca compartas tu contraseña ni los datos de tu tarjeta en una conversación.',
    botSays: 'Soporte IA Beatriz dice:',
    userSays: 'Tú dices:',
    you: 'Tú',
    viewProjects: 'Ver Proyectos',
    nudge: 'Nudge',
    nudgeSent: '¡Acabas de enviar un nudge!',
    tools: { font: 'Fuente', emoticons: 'Emoticonos', winks: 'Guiños', backgrounds: 'Fondos' },
    inputPlaceholder: 'Escribe una pregunta...',
    send: 'Enviar',
    lastMessage: (dateText: string, timeText: string) =>
      `Último mensaje recibido el ${dateText} a las ${timeText}.`,
    fallbackAnswer: 'Todavía no tengo esa respuesta — ¿qué tal usar el formulario de contacto?',
    kb: [
      { keywords: ['proyecto', 'proyectos'], answer: 'Puedes ver todos los proyectos en su perfil — ¡ya te llevo ahí!' },
      { keywords: ['stack', 'tecnología', 'tecnologías', 'tecnologia', 'tecnologias'], answer: 'Trabajo principalmente con React.js, Next.js, TypeScript, C# y .NET.' },
      { keywords: ['contacto', 'email', 'e-mail', 'correo'], answer: '¡Puedes contactarla mediante el formulario del sitio o por LinkedIn!' },
      { keywords: ['disponible', 'disponibilidad', 'vacante'], answer: '¡Beatriz está abierta a oportunidades como Desarrolladora Front-end/Full Stack Júnior!' },
      { keywords: ['idioma', 'idiomas', 'inglés', 'ingles', 'español', 'espanol'], answer: 'Habla portugués nativo, inglés nivel B1 y español nivel A2.' },
      { keywords: ['certificación', 'certificaciones', 'certificado', 'certificacion'], answer: 'Tiene certificaciones en Scrum Fundamentals, Formação Web Essencial (BIT) y Crescendo no Trabalho (JobRise), entre otras — ¡mira la pestaña Perfil!' },
    ],
  },
};

export const translations: Record<Language, Translations> = { pt, en, es };