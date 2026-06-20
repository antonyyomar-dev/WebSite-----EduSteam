
/* -----------------------------PANTALLA BUSCAR TUTORES -----------------*/


document.addEventListener('DOMContentLoaded', () => {

  /* ── Chips: quitar filtro con botón interno ── */
  const filtersRow = document.querySelector('.filters-row');
  if (filtersRow) {
    filtersRow.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;
      chip.classList.add('removing');
      chip.addEventListener('transitionend', () => chip.remove(), { once: true });
    });
  }

  /* ── Búsqueda en tiempo real ── */
  const searchInput = document.getElementById('searchInput');
  const tutorCards  = document.querySelectorAll('.tutor-card:not(.more-card)');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();

      tutorCards.forEach((card) => {
        const name    = card.querySelector('.card-name')?.textContent.toLowerCase()    ?? '';
        const subject = card.querySelector('.card-subject')?.textContent.toLowerCase() ?? '';
        const desc    = card.querySelector('.card-desc')?.textContent.toLowerCase()    ?? '';
        const tags    = [...card.querySelectorAll('.tag')].map(t => t.textContent.toLowerCase()).join(' ');

        const matches = !query
          || name.includes(query)
          || subject.includes(query)
          || desc.includes(query)
          || tags.includes(query);

        card.style.display = matches ? '' : 'none';
      });
    });
  }

  /* ── "Más tutores": teclado + click ── */
  const moreCard = document.querySelector('.more-card');
  if (moreCard) {
    const loadMore = () => console.log('Cargar más tutores…');
    moreCard.addEventListener('click', loadMore);
    moreCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); loadMore(); }
    });
  }

});


 /* ── Botón Contratar tutor ── */
const btnContratar = document.querySelector('.btn-encontrar');
  if (btnContratar) {
    btnContratar.addEventListener('click', () => {
      window.location.href = 'buscar_tutores.html';

    });
  }

/* ------------------------ PANTALLA PERFIL TUTORES----------------------------------

/* ═══════════════════════════════════════════════
   perfil.js  —  SOLO AGREGAR al script.js base
   No modifica ninguna función existente.
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Botón Enviar mensaje ── */
  const btnMensaje = document.querySelector('.btn-mensaje');
  if (btnMensaje) {
    btnMensaje.addEventListener('click', () => {
      window.location.href = '#';
    });
  }

  /* ── Botón Contratar tutor ── */
  const btnContratar = document.querySelector('.btn-contratar');
  if (btnContratar) {
    btnContratar.addEventListener('click', () => {
      window.location.href = 'agendar_sesion.html';

    });
  }

  /* ── Play de video (placeholder) ── */
  const playBtn = document.querySelector('.play-btn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      console.log('Reproducir video de presentación…');
    });
  }

});

const profileButtons = document.querySelectorAll('.btn-perfil');
if (profileButtons.length > 0) {
  profileButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.tutor-card');
      if (!card) return;
      const name = card.querySelector('.card-name')?.textContent.trim();
      const subject = card.querySelector('.card-subject')?.textContent.trim();
      if (!name) return;

      const url = new URL('perfil_usuario.html', window.location.href);
      url.searchParams.set('tutor', name);
      if (subject) url.searchParams.set('subject', subject);
      window.location.href = url.toString();
    });
  });
}

const tutorContactButtons = document.querySelectorAll('.tutor-card .btn-contactar');
if (tutorContactButtons.length > 0) {
  tutorContactButtons.forEach((button) => {
    button.addEventListener('click', function() {
      window.location.href = 'buscar_tutores.html';
    });
  });
}

/* ---------------------- PANTALLA INICIAR SESIÓN ---------------------*/
/* ══════════════════════════════════════════════════
   agendar_sesion.js  —  AGREGAR AL FINAL de script.js
   ══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Solo ejecutar en la página de agendar ── */
  const calBody = document.getElementById('calBody');
  if (!calBody) return;

  /* ── Estado del calendario ── */
  const DIAS_SEMANA  = ['Lu','Ma','Mi','Ju','Vi','Sa','Do'];
  const MESES        = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                        'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const MESES_CORTO  = ['enero','febrero','marzo','abril','mayo','junio',
                        'julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const DIAS_LARGO   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

  /* Días con horarios disponibles (día del mes) — ajusta según datos reales */
  const DISPONIBLES  = new Set([5, 7, 8, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 25, 26, 27, 28, 29]);

  let viewYear  = 2026;
  let viewMonth = 4; // 0-based → mayo
  let selectedDay = 12;

  /* ── Horarios por día (mock) ── */
  const horariosBase = [
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
    '5:00 PM - 6:00 PM',
    '6:00 PM - 7:00 PM',
  ];
  let selectedHora = '5:00 PM - 6:00 PM';

  /* ── Referencias DOM ── */
  const calMonthTitle  = document.getElementById('calMonthTitle');
  const btnAnterior    = document.getElementById('btnAnterior');
  const btnSiguiente   = document.getElementById('btnSiguiente');
  const horariosTitulo = document.getElementById('horariosTitulo');
  const horariosList   = document.getElementById('horariosList');
  const resumenFecha   = document.getElementById('resumenFecha');
  const resumenHora    = document.getElementById('resumenHora');
  const btnConfirmar   = document.getElementById('btnConfirmar');

  /* ── Renderizar calendario ── */
  function renderCalendar() {
    calMonthTitle.textContent = `${MESES[viewMonth]} ${viewYear}`;
    calBody.innerHTML = '';

    const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=dom
    /* Convertir domingo=0 a lunes=0 */
    const startOffset = (firstDay === 0) ? 6 : firstDay - 1;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrev  = new Date(viewYear, viewMonth, 0).getDate();
    const today       = new Date();

    let dayCount = 1;
    let nextCount = 1;
    let cellIndex = 0;

    /* ── Crear filas ── */
    for (let row = 0; row < 6; row++) {
      const tr = document.createElement('tr');
      let rowHasContent = false;

      for (let col = 0; col < 7; col++) {
        const td = document.createElement('td');
        const span = document.createElement('span');
        span.classList.add('cal-day');

        const globalCell = row * 7 + col;

        if (globalCell < startOffset) {
          /* Mes anterior */
          const d = daysInPrev - startOffset + globalCell + 1;
          span.textContent = d;
          span.classList.add('otro-mes');
          rowHasContent = true;
        } else if (dayCount <= daysInMonth) {
          /* Mes actual */
          const d = dayCount;
          span.textContent = d;

          if (DISPONIBLES.has(d)) span.classList.add('disponible');

          /* Hoy */
          if (d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
            span.classList.add('hoy');
          }

          /* Seleccionado */
          if (d === selectedDay) span.classList.add('selected');

          /* Click solo en días disponibles */
          if (DISPONIBLES.has(d)) {
            span.addEventListener('click', () => selectDay(d));
          }

          dayCount++;
          rowHasContent = true;
        } else {
          /* Mes siguiente */
          span.textContent = nextCount;
          span.classList.add('otro-mes');
          nextCount++;
          rowHasContent = true;
        }

        td.appendChild(span);
        tr.appendChild(td);
      }

      if (rowHasContent) calBody.appendChild(tr);
      if (dayCount > daysInMonth && row >= 4) break;
    }
  }

  /* ── Seleccionar un día ── */
  function selectDay(d) {
    selectedDay = d;
    renderCalendar();
    updateHorarios(d);
    updateResumen();
  }

  /* ── Actualizar panel de horarios ── */
  function updateHorarios(d) {
    const fecha = new Date(viewYear, viewMonth, d);
    const nombreDia  = DIAS_LARGO[fecha.getDay()];
    const nombreMes  = MESES_CORTO[viewMonth];
    horariosTitulo.textContent = `${nombreDia} ${d} de ${nombreMes}`;

    /* Resetear hora seleccionada al primer horario */
    selectedHora = horariosBase[0];

    horariosList.innerHTML = '';
    horariosBase.forEach((h) => {
      const li = document.createElement('li');
      li.className = 'horario-item' + (h === selectedHora ? ' selected' : '');
      li.dataset.hora = h;
      li.textContent = h;
      li.addEventListener('click', () => selectHora(h));
      horariosList.appendChild(li);
    });

    updateResumen();
  }

  /* ── Seleccionar una hora ── */
  function selectHora(h) {
    selectedHora = h;
    horariosList.querySelectorAll('.horario-item').forEach((li) => {
      li.classList.toggle('selected', li.dataset.hora === h);
    });
    updateResumen();
  }

  /* ── Actualizar resumen ── */
  function updateResumen() {
    const fecha = new Date(viewYear, viewMonth, selectedDay);
    const nombreDia = DIAS_LARGO[fecha.getDay()];
    const nombreMes = MESES_CORTO[viewMonth];

    resumenFecha.textContent = `${nombreDia} ${selectedDay} ${nombreMes}`;

    /* Convertir "5:00 PM - 6:00 PM" → "5:00 - 6:00 PM" */
    const horaShort = selectedHora.replace(/(\d+:\d+ [AP]M) - (\d+:\d+) ([AP]M)/, '$1 - $2 $3')
                                  .replace(/(\d+:\d+) PM - (\d+:\d+) PM/, '$1 - $2 PM');
    resumenHora.textContent = horaShort;
  }

  /* ── Navegación meses ── */
  btnAnterior.addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    selectedDay = null;
    renderCalendar();
  });

  btnSiguiente.addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    selectedDay = null;
    renderCalendar();
  });

  /* ── Botón confirmar ── */
  if (btnConfirmar) {
    btnConfirmar.addEventListener('click', () => {
      console.log('Reserva confirmada:', {
        fecha: resumenFecha.textContent,
        hora: resumenHora.textContent,
      });
      // Aquí: redirigir a pantalla de pago o mostrar modal de confirmación
    });
  }

  /* ── Horarios: evento por delegación (para los precargados en HTML) ── */
  if (horariosList) {
    horariosList.addEventListener('click', (e) => {
      const item = e.target.closest('.horario-item');
      if (!item) return;
      selectHora(item.dataset.hora);
    });
  }

  /* ── Init ── */
  renderCalendar();
  updateHorarios(selectedDay);
});

const btnContactarSesion = document.querySelector('.btn-contactar');
if (btnContactarSesion) {
  btnContactarSesion.addEventListener('click', function() {
    window.location.href = '#';
  });
}

function getQueryParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search).entries());
}

const tutorProfiles = {
  'maría perez': {
    name: 'María Perez',
    subject: 'Matemáticas - Física',
    initials: 'MP',
    available: true,
    rating: '★★★★★',
    reviews: 75,
    university: 'UNI',
    experience: '3 años como tutor',
    availability: 'Lun - Vie · 4pm - 8pm',
    price: 'S/35 x hora',
    teachingSubjects: ['Matemáticas', 'Física', 'Preuniversitario'],
    bio: 'Egresada de Ingeniería Civil, especialista en preparación preuniversitaria. Combino teoría y práctica con ejercicios paso a paso.',
    certificate: 'Diploma_INGCIV.pdf',
    videoLabel: 'No hay video de presentación'
  },
  'roberto castro': {
    name: 'Roberto Castro',
    subject: 'Algebra - Cálculo',
    initials: 'RC',
    available: true,
    rating: '★★★★☆',
    reviews: 97,
    university: 'PUCP',
    experience: '2 años como tutor',
    availability: 'Lun - Vie · 3pm - 9pm',
    price: 'S/30 x hora',
    teachingSubjects: ['Álgebra', 'Cálculo', 'Preuniversitario'],
    bio: 'Estudiante de Matemáticas en PUCP, tutor con metodología personalizada y material propio. Refuerzo desde la base hasta exámenes competitivos.',
    certificate: 'Diploma_PUCP.pdf',
    videoLabel: 'No hay video de presentación'
  },
  'ana gutiérrez': {
    name: 'Ana Gutiérrez',
    subject: 'Geometría - Trigonometría',
    initials: 'AG',
    available: false,
    rating: '★★★☆☆',
    reviews: 67,
    university: 'Universidad Nacional',
    experience: '5 años como tutora',
    availability: 'Sólo fines de semana',
    price: 'S/40 x hora',
    teachingSubjects: ['Geometría', 'Trigonometría', 'Universitario'],
    bio: 'Docente universitaria con amplia experiencia en preparación de exámenes de admisión. Aula muy didáctica y visual.',
    certificate: 'Certificado_Maestra.pdf',
    videoLabel: 'No hay video de presentación'
  },
  'luis vargas': {
    name: 'Luis Vargas',
    subject: 'Matemáticas - Estadísticas',
    initials: 'LV',
    available: true,
    rating: '★★★☆☆',
    reviews: 87,
    university: 'UNI',
    experience: '4 años como tutor',
    availability: 'Mar - Vie · 2pm - 8pm',
    price: 'S/25 x hora',
    teachingSubjects: ['Matemáticas', 'Estadística', 'Preuniversitario'],
    bio: 'Egresado de Estadística en UNI. Especializado en cursos universitarios de primer y segundo ciclo con enfoque práctico.',
    certificate: 'Diploma_ESTAD.pdf',
    videoLabel: 'No hay video de presentación'
  },
  'carmen morales': {
    name: 'Carmen Morales',
    subject: 'Algebra - Cálculo II',
    initials: 'CM',
    available: true,
    rating: '★★★★☆',
    reviews: 66,
    university: 'PUCP',
    experience: '4 años como profesora',
    availability: 'Lun - Vie · 5pm - 9pm',
    price: 'S/28 x hora',
    teachingSubjects: ['Álgebra', 'Cálculo II', 'Universitario'],
    bio: 'Profesora de secundaria con experiencia enseñando matemáticas avanzadas. Clases claras, estructuradas y con muchos ejemplos.',
    certificate: 'Certificado_Maestra2.pdf',
    videoLabel: 'No hay video de presentación'
  }
};

function initTutorProfilePage() {
  const profileNameEl = document.querySelector('.perfil-name');
  if (!profileNameEl) return;

  const params = getQueryParams();
  const requestedName = (params.tutor || 'Roberto Castro').trim();
  const profile = tutorProfiles[requestedName.toLowerCase()] || tutorProfiles['roberto castro'];

  profileNameEl.textContent = profile.name;
  document.title = `EduSteam – Perfil de ${profile.name}`;

  const breadcrumbCurrent = document.querySelector('.breadcrumb-current');
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = profile.name;

  const subjectEl = document.querySelector('.perfil-subject');
  if (subjectEl) subjectEl.textContent = profile.subject;

  const avatarEl = document.querySelector('.perfil-avatar');
  if (avatarEl) avatarEl.textContent = profile.initials;

  const badgeAvailable = document.querySelector('.badge--disponible');
  if (badgeAvailable) {
    badgeAvailable.textContent = profile.available ? 'Disponible' : 'No disponible';
    badgeAvailable.classList.toggle('badge--disponible', profile.available);
    badgeAvailable.classList.toggle('badge--no-disponible', !profile.available);
  }

  const scoreEl = document.querySelector('.perfil-score');
  if (scoreEl) scoreEl.textContent = `${profile.rating} (${profile.reviews} reseñas)`;

  const infoValues = document.querySelectorAll('.perfil-info-card .info-value');
  if (infoValues.length >= 4) {
    infoValues[0].textContent = profile.university;
    infoValues[1].textContent = profile.experience;
    infoValues[2].textContent = profile.availability;
    infoValues[3].textContent = profile.price;
  }

  const materiasTags = document.querySelector('.materias-tags');
  if (materiasTags) {
    materiasTags.innerHTML = profile.teachingSubjects.map((subject) => `<span class="materia-tag">${subject}</span>`).join('');
  }

  const sobreMiText = document.querySelector('.sobre-mi-text');
  if (sobreMiText) sobreMiText.textContent = profile.bio;

  const certName = document.querySelector('.cert-name');
  if (certName) certName.textContent = profile.certificate;

  const videoEmpty = document.querySelector('.video-empty');
  if (videoEmpty) videoEmpty.textContent = profile.videoLabel;
}

document.addEventListener('DOMContentLoaded', initTutorProfilePage);



/* =====================================================
   mensajes.js — JS ADICIONAL para pantalla de chat
   Agregar como archivo separado: <script src="mensajes.js">
   Se carga DESPUÉS de script.js
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* Solo ejecutar en la página de mensajes */
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;

  /* ── Referencias DOM ── */
  const msgInput   = document.getElementById('msgInput');
  const btnSend    = document.getElementById('btnSend');
  const tutorItems = document.querySelectorAll('.tutor-item');
  const matFilters = document.querySelectorAll('.mat-filter');
  const matList    = document.getElementById('materialsList');

  /* ── Scroll al fondo al cargar ── */
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  scrollToBottom();

  /* ── Enviar mensaje al presionar botón o Enter ── */
  function enviarMensaje() {
    const texto = msgInput.value.trim();
    if (!texto) return;

    const msgRow  = document.createElement('div');
    msgRow.className = 'msg-row msg-right';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble msg-student';

    const p = document.createElement('p');
    p.textContent = texto;

    const time = document.createElement('span');
    time.className = 'msg-time';
    const now = new Date();
    time.textContent = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar jh';
    avatar.textContent = 'JH';

    bubble.appendChild(p);
    bubble.appendChild(time);
    msgRow.appendChild(bubble);
    msgRow.appendChild(avatar);
    chatMessages.appendChild(msgRow);

    msgInput.value = '';
    scrollToBottom();
  }

  if (btnSend) {
    btnSend.addEventListener('click', enviarMensaje);
  }

  if (msgInput) {
    msgInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); enviarMensaje(); }
    });
  }

  /* ── Selección de tutor en sidebar ── */
  tutorItems.forEach((item) => {
    item.addEventListener('click', () => {
      tutorItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      // Aquí se cargaría la conversación del tutor seleccionado
      console.log('Tutor seleccionado:', item.dataset.chat);
    });
  });

  /* ── Filtros de materiales ── */
  matFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      matFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      if (!matList) return;

      matList.querySelectorAll('.material-item').forEach((item) => {
        if (filter === 'todos') {
          item.style.display = '';
        } else {
          item.style.display = item.dataset.type === filter ? '' : 'none';
        }
      });
    });
  });

  /* ── Botón Ingresar sesión ── */
  const btnIngresar = document.querySelector('.btn-ingresar');
  if (btnIngresar) {
    btnIngresar.addEventListener('click', () => {
      window.location.href = 'sala_sesiones.html';
      // Redirigir a pantalla de videollamada o sesión
    });
  }

  /* ── Botones de descarga (delegación) ── */
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-download') || e.target.closest('.btn-download-mat')) {
      console.log('Descargar archivo…');
      // Aquí iría la lógica real de descarga
    }
  });

});
/* =====================================================
   sesion.js — JS ADICIONAL para pantalla Sesión en vivo
   Se carga DESPUÉS de script.js
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const videoMain  = document.getElementById('videoMain');
  if (!videoMain) return;

  /* ── Estado ── */
  const state = { micOn: false, camOn: true, shareOn: false };

  /* ── Toggle micrófono ── */
  const btnMic = document.getElementById('btnMic');
  if (btnMic) {
    btnMic.addEventListener('click', () => {
      state.micOn = !state.micOn;
      btnMic.classList.toggle('ctrl-muted', !state.micOn);
      btnMic.title = state.micOn ? 'Silenciar micrófono' : 'Activar micrófono';
    });
  }

  /* ── Toggle cámara ── */
  const btnCam = document.getElementById('btnCam');
  if (btnCam) {
    btnCam.addEventListener('click', () => {
      state.camOn = !state.camOn;
      btnCam.classList.toggle('ctrl-muted', !state.camOn);
      btnCam.title = state.camOn ? 'Apagar cámara' : 'Encender cámara';
      const videoBg   = videoMain.querySelector('.video-bg');
      const phBg      = videoMain.querySelector('.video-placeholder-bg');
      if (videoBg) videoBg.style.opacity    = state.camOn ? '1' : '0';
      if (phBg)    phBg.style.zIndex        = state.camOn ? '0' : '2';
    });
  }

  /* ── Toggle compartir pantalla ── */
  const btnShare = document.getElementById('btnShare');
  if (btnShare) {
    btnShare.addEventListener('click', () => {
      state.shareOn = !state.shareOn;
      btnShare.classList.toggle('ctrl-muted', !state.shareOn);
      btnShare.title = state.shareOn ? 'Dejar de compartir' : 'Compartir pantalla';
    });
  }

  /* ── Modal de salir ── */
  const modalSalir    = document.getElementById('modalSalir');
  const btnColgar     = document.getElementById('btnColgar');
  const btnVolver     = document.getElementById('btnVolver');
  const modalCancelar = document.getElementById('modalCancelar');
  const modalConfirmar= document.getElementById('modalConfirmar');

  function abrirModal() {
    if (modalSalir) modalSalir.classList.add('visible');
  }

  function cerrarModal() {
    if (modalSalir) modalSalir.classList.remove('visible');
  }

  /* Botón colgar abre el modal en lugar de salir directo */
  if (btnColgar) {
    btnColgar.addEventListener('click', abrirModal);
  }

  /* Botón "Volver" en navbar también abre el modal (evita salir accidentalmente) */
  if (btnVolver) {
    btnVolver.removeAttribute('onclick'); // quitamos el onclick inline
    btnVolver.addEventListener('click', (e) => {
      e.preventDefault();
      abrirModal();
    });
  }

  /* Cancelar: cierra el modal, sigue en sesión */
  if (modalCancelar) {
    modalCancelar.addEventListener('click', cerrarModal);
  }

  /* Confirmar: navega atrás */
  if (modalConfirmar) {
    modalConfirmar.addEventListener('click', () => {
      cerrarModal();
      // Pequeño delay para que se vea el cierre del modal antes de salir
      setTimeout(() => {
        if (window.history.length > 1) {
          history.back();
        } else {
          window.location.href = 'index.html';
        }
      }, 200);
    });
  }

  /* Clic fuera del modal lo cierra */
  if (modalSalir) {
    modalSalir.addEventListener('click', (e) => {
      if (e.target === modalSalir) cerrarModal();
    });
  }

  /* Tecla Escape cierra el modal */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarModal();
  });

  /* ── Auto-ocultar controles al dejar de mover el mouse ── */
  const controlsBar = videoMain.querySelector('.controls-bar');
  let hideTimeout;

  function showControls() {
    if (controlsBar) {
      controlsBar.style.opacity = '1';
      controlsBar.style.transform = 'translateX(-50%) translateY(0)';
    }
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(fadeControls, 3500);
  }

  function fadeControls() {
    if (controlsBar) {
      controlsBar.style.opacity = '0.2';
      controlsBar.style.transform = 'translateX(-50%) translateY(4px)';
    }
  }

  videoMain.addEventListener('mousemove', showControls);
  videoMain.addEventListener('mouseleave', fadeControls);
  hideTimeout = setTimeout(fadeControls, 3500);

});


/* BOTONES DE DIVERSOS PERFILES */

