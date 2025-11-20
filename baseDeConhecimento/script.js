let dados = []

async function iniciarBuscar() {
    let response = await fetch("data.json");
    dados = await response.json();
    console.log(dados);
}