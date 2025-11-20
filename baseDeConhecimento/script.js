let cardContainer = document.querySelector(".card-container");
let searchInput = document.querySelector("#searchInput");
let searchButton = document.querySelector("#searchButton");

let dados = []

// 1. Carrega os dados e renderiza os cards assim que a página abre.
async function carregarDados() {
    let response = await fetch("data.json");
    dados = await response.json();
    renderCards(dados);
}

// 2. Adiciona o evento de 'input' ao campo de busca para chamar a função a cada tecla digitada.
searchInput.addEventListener("input", realizarBusca);

// 3. Função que executa a lógica de busca.
function realizarBusca() {
    const termoBusca = searchInput.value.toLowerCase();

    // Se o campo de busca estiver vazio, mostra todos os dados.
    if (termoBusca === "") {
        renderCards(dados);
    } else {
        // Caso contrário, filtra os dados normalmente.
        const dadosFiltrados = dados.filter(dado => {
            return dado.nome.toLowerCase().includes(termoBusca);
        });
        renderCards(dadosFiltrados);
    }
}

function renderCards(dados) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes antes de renderizar novos
    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
            <h2>${dado.nome}</h2>
            <p>Criado em ${dado.ano}</p>
            <p>${dado.descricao}</p>
            <a href="${dado.link}" target="_blank">Saiba Mais</a>
        `;
        cardContainer.appendChild(article);
    
    }
}

// 4. Chama a função para carregar os dados iniciais.
carregarDados();