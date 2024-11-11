document.addEventListener("DOMContentLoaded", function () {
    const svgObject = document.getElementById("svgMap");

    svgObject.addEventListener("load", function () {
        const svgDoc = svgObject.contentDocument;
        const paths = svgDoc.querySelectorAll("path");

        // Caixa de notícias
        const newsBox = document.getElementById("newsBox");
        let currentCountry = null; // Armazena o país atual selecionado

        paths.forEach(path => {
            path.style.fill = "gray"; // Cor inicial

            path.addEventListener("mouseover", function (event) {
                const countryId = path.getAttribute("id"); // Usa o id do país
                const countryName = path.getAttribute("title"); // Nome completo do país para exibição

                console.log("País selecionado:", countryName, "ID:", countryId); // Log para confirmar o país selecionado

                // Só busca novas notícias se o país selecionado for diferente do anterior
                if (countryId && countryId !== currentCountry) {
                    currentCountry = countryId; // Atualiza o país atual
                    path.style.fill = "#FFA629"; // Cor ao passar o mouse
                    fetchNewsFromSource(countryId, countryName, newsBox, event); // Obtém notícias de fontes específicas
                }
            });

            path.addEventListener("mouseout", function () {
                path.style.fill = "gray"; // Cor ao retirar o mouse
                newsBox.style.display = "none"; // Oculta a caixa de notícias
                currentCountry = null; // Reseta o país atual ao sair
            });
        });
    });
});

// Função para buscar notícias de fontes específicas
async function fetchNewsFromSource(countryId, countryName, newsBox, event) {
    const apiKey = "2777ac59cc1842359659b52fddb6cf39";

    // Mapeando fontes específicas de notícias por país
    const sourcesByCountry = {
        "BR": ["globo", "folha", "uol"],  // Fontes do Brasil
        "US": ["cnn", "nytimes", "bbc-news"],  // Fontes dos EUA
        "GB": ["bbc-news", "guardian", "independent"],  // Fontes do Reino Unido
        "DE": ["der-tagesspiegel", "spiegel", "welt"],  // Fontes da Alemanha
        "FR": ["le-monde", "le-figaro", "france-24"],  // Fontes da França
        "IN": ["times-of-india", "the-hindu", "ndtv"],  // Fontes da Índia
        "AU": ["the-australian"],
        // Adicione mais países conforme necessário
    };

    const sources = sourcesByCountry[countryId];

    if (!sources || sources.length === 0) {
        console.warn(`Nenhuma fonte específica encontrada para ${countryName}.`);
        newsBox.innerHTML = `<p>Não há fontes específicas de notícias disponíveis para ${countryName}.</p>`;
        newsBox.style.display = "block";
        positionNewsBox(newsBox, event);
        return;
    }

    const sourcesParam = sources.join(",");  // Junta as fontes separadas por vírgula
    const url = `https://newsapi.org/v2/top-headlines?sources=${sourcesParam}&apiKey=${apiKey}`;

    try {
        console.log(`Fazendo requisição para URL: ${url}`);  // Verifica a URL da requisição

        const response = await fetch(url);

        // Verifique o status da resposta
        console.log(`Status da resposta da API para ${countryName}: ${response.status}`);

        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Dados retornados da API para ${countryName}:`, data);  // Verifique os dados retornados

        if (data.status === "ok" && data.articles && data.articles.length > 0) {
            let articlesHTML = `<h3>Notícias de ${countryName}</h3><ul>`;
            data.articles.slice(0, 5).forEach(article => {
                articlesHTML += `<li><a href="${article.url}" target="_blank">${article.title}</a></li>`;
            });
            articlesHTML += "</ul>";

            newsBox.innerHTML = articlesHTML;
            newsBox.style.display = "block";
            positionNewsBox(newsBox, event);
        } else {
            console.warn(`Sem notícias para ${countryName} (${countryId}).`);
            newsBox.innerHTML = `
                <p>Não há notícias disponíveis para ${countryName} no momento.</p>
                <p><button onclick="fetchNewsFromSource('${countryId}', '${countryName}', newsBox, event)">Tentar novamente</button></p>
            `;
            newsBox.style.display = "block";
            positionNewsBox(newsBox, event);
        }
    } catch (error) {
        console.error(`Erro ao obter notícias para ${countryName}:`, error.message);
        newsBox.innerHTML = `<p>Erro ao carregar notícias para ${countryName}. Verifique a conexão e as permissões de CORS da API.</p>`;
        newsBox.style.display = "block";
        positionNewsBox(newsBox, event);
    }
}

// Função para posicionar a caixa de notícias
function positionNewsBox(newsBox, event) {
    const offsetX = 10; // Ajuste para posicionamento horizontal
    const offsetY = 30; // Ajuste para posicionamento vertical acima

    newsBox.style.left = `${event.pageX - offsetX}px`;
    newsBox.style.top = `${event.pageY - offsetY}px`;
}

// Função para obter o código do país
function countryCode(countryId) {
    const codes = {
        "BR": "br",  // Brasil Já tem
        "US": "us",  // Estados Unidos já tem
        "GB": "gb",  // Reino Unido já tem
        "DE": "de",  // Alemanha já tem 
        "FR": "fr",  // França já tem
        "IN": "in",  // Índia já tem
        "AU": "au",  // Austrália
        "AE": "ae",  // Emirados Árabes
        "BS": "bs",  // Bahamas
        "AD": "ad",  // Andorra
        "AR": "ar",  // Argentina
        "CN": "cn",  // China
        "IT": "it",  // Itália
        "RU": "ru",  // Rússia
        "MX": "mx",  // México
        // Adicione mais países conforme necessário
    };
    return codes[countryId];
}
