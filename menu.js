let btnMenu = document.getElementById('btn-menu')
let menu = document.getElementById('menu-mobile')
let overlay = document.getElementById('overlay-menu')

btnMenu.addEventListener('click', ()=>{
    menu.classList.add('abrir-menu')
})

menu.addEventListener('click', ()=>{
    menu.classList.remove('abrir-menu')
})

overlay.addEventListener('click', ()=>{
    menu.classList.remove('abrir-menu')
})

// Esta parte já garante que ao recarregar a página os campos sumam
window.addEventListener('pageshow', ()=>{
    let formulario = document.querySelector('.formulario form');
    if (formulario) {
        formulario.reset();
    }
})

// --- FUNÇÃO PARA ENVIAR PARA O WHATSAPP ---
function enviarWhatsApp() {
    const formulario = document.querySelector('.formulario form');
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const celular = document.getElementById('celular').value;
    const mensagem = document.getElementById('mensagem').value;

    const numeroLoja = "5519974073245"; 

    const textoMensagem = `🏁 *CLAUDINHO MOTO PREPARAÇÕES* 🏁%0A%0A` +
                      `👤 *Cliente:* ${nome}%0A` +
                      `📧 *Cidade:* ${email}%0A` +
                      `📱 *Celular:* ${celular}%0A` +
                      `──────────────────%0A` +
                      `📝 *Dúvida/Pedido:*%0A${mensagem}`;

    const urlFinal = `https://api.whatsapp.com/send?phone=${numeroLoja}&text=${textoMensagem}`;
    
    window.open(urlFinal, '_blank');

    if (formulario) {
        formulario.reset();
    }
}

// --- CONTROLE DE NAVEGAÇÃO E ENVIO PELO TECLADO ---
const formContato = document.querySelector('.formulario form');
const camposInputs = Array.from(document.querySelectorAll('.formulario form input:not([type="hidden"]):not([type="button"]), .formulario form textarea'));

camposInputs.forEach((campo, index) => {
    campo.addEventListener('keydown', (e) => {
        
        if (e.key === 'ArrowDown' && campo.tagName !== 'TEXTAREA') {
            e.preventDefault();
            if (index < camposInputs.length - 1) {
                camposInputs[index + 1].focus();
            }
        }
        
        else if (e.key === 'ArrowUp') {
            if (campo.tagName === 'TEXTAREA') {
                if (campo.selectionStart === 0) {
                    e.preventDefault();
                    if (index > 0) camposInputs[index - 1].focus();
                }
            } else {
                e.preventDefault();
                if (index > 0) camposInputs[index - 1].focus();
            }
        }

        else if (e.key === 'Enter') {
            if (campo.tagName === 'TEXTAREA') {
                return; 
            }

            e.preventDefault();

            if (formContato.checkValidity()) {
                enviarWhatsApp(); 
            } else {
                if (index < camposInputs.length - 1) {
                    camposInputs[index + 1].focus();
                } else {
                    formContato.reportValidity();
                }
            }
        }
    });
});

/* SETAS DO CARROSSEL DE PROJETOS */
function scrollCarrossel(direcao) {
    const lista = document.getElementById('listaProjetos');
    const larguraCard = lista.querySelector('a').offsetWidth + 20; // Largura do card + gap
    
    // No PC, pula 3 cards. No Celular, pula 1.
    const scrollAmount = window.innerWidth > 1024 ? larguraCard * 3 : larguraCard;

    lista.scrollBy({
        left: direcao * scrollAmount,
        behavior: 'smooth'
    });
}

// Mostrar/esconder as setas automaticamente
const lista = document.getElementById('listaProjetos');
const btnAnt = document.getElementById('btnAnt');
const btnProx = document.getElementById('btnProx');

if (lista && btnAnt && btnProx) {
    lista.addEventListener('scroll', () => {
        btnAnt.style.display = lista.scrollLeft > 5 ? 'block' : 'none';
        
        const fimDaPagina = lista.scrollWidth - lista.clientWidth;
        btnProx.style.display = lista.scrollLeft >= fimDaPagina - 5 ? 'none' : 'block';
    });
}

// Overlay e texto aparecem no celular por 5 segundos e saem
document.addEventListener("DOMContentLoaded", function() {
    const overlays = document.querySelectorAll('.img-port .overlay');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('anima-mobile');
            } else {
                entry.target.classList.remove('anima-mobile');
            }
        });
    }, { threshold: 0.5 });

    if (window.innerWidth <= 1024) {
        overlays.forEach(overlay => {
            observer.observe(overlay);
        });
    }
});

// Lista de cidades do Brasil (API do IBGE)
document.addEventListener("DOMContentLoaded", function() {
    const dataList = document.getElementById('lista-cidades');

    if (dataList) {
        fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios')
            .then(response => response.json())
            .then(cidades => {
                cidades.forEach(cidade => {
                    const option = document.createElement('option');
                    option.value = `${cidade.nome} - ${cidade.microrregiao.mesorregiao.UF.sigla}`;
                    dataList.appendChild(option);
                });
            })
            .catch(error => console.error('Erro ao carregar a lista de cidades:', error));
    }
});

// --- ARRASTAR O CARROSSEL COM O MOUSE (NOTEBOOK) ---
(function () {
    const carrossel = document.getElementById('listaProjetos');
    if (!carrossel) return;

    let arrastando = false;
    let inicioX = 0;
    let scrollInicial = 0;
    let moveu = false;

    carrossel.addEventListener('mousedown', (e) => {
        arrastando = true;
        moveu = false;
        inicioX = e.pageX;
        scrollInicial = carrossel.scrollLeft;
    });

    window.addEventListener('mousemove', (e) => {
        if (!arrastando) return;
        const distancia = e.pageX - inicioX;
        if (Math.abs(distancia) > 5) {
            moveu = true;
            carrossel.classList.add('arrastando');
        }
        carrossel.scrollLeft = scrollInicial - distancia;
    });

    window.addEventListener('mouseup', () => {
        arrastando = false;
        carrossel.classList.remove('arrastando');
    });

    carrossel.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (moveu) {
                e.preventDefault();
                moveu = false;
            }
        });
    });
})();