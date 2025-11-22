document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('main');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    let allData = []; // Armazena todos os itens carregados do JSON

    // 1. Carrega os dados do JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            allData = data;
            renderCards(allData); // Exibe todos os cards inicialmente
        })
        .catch(error => console.error('Erro ao carregar dados:', error));

    // 2. Função para renderizar os cards na tela
    function renderCards(items) {
        mainContainer.innerHTML = ''; // Limpa os cards existentes
        if (items.length === 0) {
            mainContainer.innerHTML = '<p>Nenhum item encontrado.</p>';
            return;
        }

        items.forEach(item => {
            const card = document.createElement('article');
            
            // Cria o HTML para as tags, envolvendo cada uma em um span clicável
            const tagsHtml = item.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

            card.innerHTML = `
                <div class="card-header">
                    <div class="card-title">
                        <i class="${item.icon_class}"></i>
                        <h2>${item.nome}</h2>
                    </div>
                    <span class="arrow-icon">▲</span>
                </div>
                <div class="card-details">
                    <p>${item.descricao}</p>
                    <p><strong>Data de Criação:</strong> ${item.data_criacao}</p>
                    <div class="tags-container">
                        ${tagsHtml}
                    </div>
                    <a href="${item.link}" target="_blank">Acessar Documentação</a>
                </div>
            `;
            mainContainer.appendChild(card);
        });
    }

    // 3. Função de busca por nome
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = allData.filter(item => 
            item.nome.toLowerCase().includes(searchTerm)
        );
        renderCards(filteredData);
    }

    // 4. Função para filtrar por tag
    function filterByTag(tagToFilter) {
        const filteredData = allData.filter(item => 
            item.tags.includes(tagToFilter)
        );
        renderCards(filteredData);
        searchInput.value = `tag: ${tagToFilter}`; // Atualiza o input para mostrar o filtro ativo
    }

    // --- Event Listeners ---

    // Listener para a busca em tempo real (enquanto digita)
    searchInput.addEventListener('input', performSearch);

    // Listener para cliques nas tags (usando delegação de eventos)
    mainContainer.addEventListener('click', (event) => {
        // Delegação de evento para expandir/recolher o card
        const cardHeader = event.target.closest('.card-header');
        if (cardHeader) {
            const card = cardHeader.closest('article');
            // Fecha outros cards abertos
            document.querySelectorAll('article.expanded').forEach(openCard => {
                if (openCard !== card) {
                    openCard.classList.remove('expanded');
                }
            });
            // Alterna o estado do card clicado
            card.classList.toggle('expanded');
            return; // Sai para não acionar a lógica da tag se o clique foi no header
        }

        // Verifica se o elemento clicado tem a classe 'tag'
        if (event.target.classList.contains('tag')) {
            const tagName = event.target.textContent;
            filterByTag(tagName);
        }
    });

});