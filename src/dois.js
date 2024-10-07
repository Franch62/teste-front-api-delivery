window.onload = function () {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:3000/menu', true);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      const response = JSON.parse(xhr.responseText);
      console.log("Dados recebidos da API:", response);

      response.forEach((menuItem) => {
        // Função auxiliar para criar o card
        const createMenuItemCard = (menuItem) => {
          const menuItemCard = document.createElement("a");
          menuItemCard.href = `/details.html?id=${menuItem._id}`; // Atualize o link para a página de detalhes
          menuItemCard.className = "menu-item-card"; // Classe CSS para estilizar o card
          
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
      
          return menuItemCard;
        };

        // Adiciona os cards nas categorias apropriadas
        if (Array.isArray(menuItem.categories)) {
          menuItem.categories.forEach((category) => {
            const normalizedCategory = category.trim().toLowerCase();

            switch (normalizedCategory) {
              case "crepesalgado":
                document.getElementById("crepe-salgado-list").appendChild(createMenuItemCard(menuItem));
                break;
              case "crepedoce":
                document.getElementById("crepe-doce-list").appendChild(createMenuItemCard(menuItem));
                break;
              case "cuscuz":
                document.getElementById("cuscuz-list").appendChild(createMenuItemCard(menuItem));
                break;
              case "lanchenatural":
                document.getElementById("lanche-natural-list").appendChild(createMenuItemCard(menuItem));
                break;
              case "garapa":
                document.getElementById("garapa-list").appendChild(createMenuItemCard(menuItem));
                break;
              case "suco":
                document.getElementById("suco-list").appendChild(createMenuItemCard(menuItem));
                break;
              default:
                console.error(`Categoria desconhecida: ${category}`);
            }
          });
        } else {
          console.error("Categorias indefinidas ou inválidas para o item: ", menuItem);
        }
      });
    } else {
      alert("Erro ao carregar os itens do menu");
    }
  };

  xhr.onerror = function () {
    console.error("Erro de conexão");
  };

  xhr.send();
};

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `http://localhost:3000/menu/${id}`, true);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);

      document.getElementById("item-name").textContent = data.name;
      document.getElementById("item-image").src = data.image_url;
      document.getElementById("item-description").textContent = data.description;
      document.getElementById("item-price").textContent = `Preço: R$ ${data.price}`;
    } else {
      alert('Erro ao carregar os detalhes do item');
    }
  };

  xhr.onerror = function () {
    console.error('Erro ao carregar os detalhes do item');
  };

  xhr.send();
});
