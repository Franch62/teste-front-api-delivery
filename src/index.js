window.onload = function () {
  fetch("http://localhost:3000/menu")
    .then(async (data) => {
      const response = await data.json();
      console.log("Dados recebidos da API:", response);

      response.forEach((menuItem) => {
        // Cria o card do item
        
        
        const menuItemCard = document.createElement("a");
        menuItemCard.href = `/details.html?id=${menuItem._id}`; // Atualize o link para a página de detalhes
        menuItemCard.className = "menu-item-card"; // Classe CSS para estilizar o cardcard
      
        // Cria o contêiner do texto
        const textContainer = document.createElement("div");
        textContainer.className = "text-container";

        const menuItemName = document.createElement("h2");
        menuItemName.textContent = menuItem.name;

        const menuItemDescription = document.createElement("p");
        menuItemDescription.textContent = menuItem.description;

        const menuItemValue = document.createElement("p");
        menuItemValue.textContent = `Preço: R$ ${menuItem.price}`;

        textContainer.appendChild(menuItemName);
        textContainer.appendChild(menuItemDescription);
        textContainer.appendChild(menuItemValue);

        const imageContainer = document.createElement("div");
        const menuItemImage = document.createElement("img");
        menuItemImage.src = menuItem.image_url;
        menuItemImage.className = "menu-item-image"; // Classe CSS para a imagem
        imageContainer.appendChild(menuItemImage);

        menuItemCard.appendChild(textContainer);
        menuItemCard.appendChild(imageContainer);

        // Verifica se a categoria está definida e é um array
        if (Array.isArray(menuItem.categories)) {
          // Para cada categoria no array, adicione o item ao container correspondente
          menuItem.categories.forEach((category) => {
            const normalizedCategory = category.trim().toLowerCase();

            switch (normalizedCategory) {
              case "crepesalgado":
                document
                  .getElementById("crepe-salgado-list")
                  .appendChild(menuItemCard.cloneNode(true));
                break;
              case "crepedoce":
                document
                  .getElementById("crepe-doce-list")
                  .appendChild(menuItemCard.cloneNode(true));
                break;
              case "cuscuz":
                document
                  .getElementById("cuscuz-list")
                  .appendChild(menuItemCard.cloneNode(true));
                break;
              case "lanchenatural":
                document
                  .getElementById("lanche-natural-list")
                  .appendChild(menuItemCard.cloneNode(true));
                break;
              case "garapa":
                document
                  .getElementById("garapa-list")
                  .appendChild(menuItemCard.cloneNode(true));
                break;
              case "suco":
                document
                  .getElementById("suco-list")
                  .appendChild(menuItemCard.cloneNode(true));
                break;
              default:
                console.error(`Categoria desconhecida: ${category}`);
            }
          });
        } else {
          console.error(
            "Categorias indefinidas ou inválidas para o item: ",
            menuItem
          );
        }

      });
    })
    .catch((error) => {
      console.log({ error });
      alert("Erro ao carregar os itens do menu");
    });
};


document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  fetch(`http://localhost:3000/menu/${id}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById("item-name").textContent = data.name;
      document.getElementById("item-image").src = data.image_url;
      document.getElementById("item-description").textContent = data.description;
      document.getElementById("item-price").textContent = `Preço: R$ ${data.price}`;
    })
    .catch(error => {
      console.error('Erro ao carregar os detalhes do item:', error);
    });
});