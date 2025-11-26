document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.querySelector('.card-container');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    let knowledgeData = [];

    // Elementos do Tema
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const themeIcon = document.getElementById('theme-icon');

    // Elementos do Modal
    const modal = document.getElementById('modal');
    const modalCloseButton = document.getElementById('modalCloseButton');
    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalCreationDate = document.getElementById('modalCreationDate');
    const modalTags = document.getElementById('modalTags');
    const modalLink = document.getElementById('modalLink');

    // Carrega os dados do JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            knowledgeData = data;
            displayCards(knowledgeData);
        })
        .catch(error => console.error('Erro ao carregar dados:', error));

    // Função para exibir os cards
    const displayCards = (items) => {
        cardContainer.innerHTML = '';
        items.forEach(item => {
            const card = document.createElement('article');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-header">
                    <h3>${item.nome}</h3>
                </div>
            `;
            
            // Adiciona o evento de clique para abrir o modal
            card.addEventListener('click', () => {
                openModal(item);
            });

            cardContainer.appendChild(card);
        });
    };

    // Função para abrir e popular o modal
    const openModal = (item) => {
        modalTitle.textContent = item.nome;
        modalDescription.textContent = item.descricao;
        modalCreationDate.textContent = item.data_criacao;
        modalLink.href = item.link;
        
        modalTags.innerHTML = item.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ');

        modal.classList.add('open'); // Mostra o modal adicionando a classe
    };

    // Função para fechar o modal
    const closeModal = () => {
        modal.classList.remove('open'); // Esconde o modal removendo a classe
    };

    // Eventos para fechar o modal
    modalCloseButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        // Fecha se clicar no fundo (fora do conteúdo do modal)
        if (event.target === modal) {
            closeModal();
        }
    });
    window.addEventListener('keydown', (event) => {
        // Fecha se a tecla 'Escape' for pressionada
        if (event.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    // Funcionalidade de busca
    const handleSearch = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = knowledgeData.filter(item => 
            item.nome.toLowerCase().includes(searchTerm) ||
            item.descricao.toLowerCase().includes(searchTerm) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
        displayCards(filteredData);
    };
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });

    // --- Lógica de Troca de Tema ---

    const setTema = (isLight) => {
        if (isLight) {
            document.body.classList.add('light-theme');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    };

    themeToggleButton.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-theme');
        setTema(!isLight);
    });

    // Verifica o tema salvo no carregamento da página
    const savedTheme = localStorage.getItem('theme');
    // Define o tema claro se estiver salvo, caso contrário, o padrão (escuro) será aplicado
    setTema(savedTheme === 'light');
});