async function loadProductsByCategory() {
  try {
    const response = await fetch("http://localhost:3000/v1/menu/"); // Endpoint para buscar todos os produtos
    if (!response.ok) {
      throw new Error("Erro ao carregar produtos"); // Erro caso a resposta não seja ok
    }
    const products = await response.json();

    const productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML = ""; // Limpa o conteúdo antes de carregar

    // Organiza os produtos por categoria
    const productsByCategory = {};
    products.forEach((product) => {
      const categoryName = product.category.name;

      // Se a categoria não existir no objeto, cria um array para ela
      if (!productsByCategory[categoryName]) {
        productsByCategory[categoryName] = [];
      }

      // Adiciona o produto à categoria
      productsByCategory[categoryName].push(product);
    });

    // Cria o HTML para cada categoria e seus produtos
    for (const [category, items] of Object.entries(productsByCategory)) {
      const categoryElement = document.createElement("div");
      const categoryTitle = document.createElement("h1");
      categoryTitle.textContent = category;
      categoryElement.appendChild(categoryTitle);

      // Cria um card para cada produto na categoria
      items.forEach((item) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        const productName = document.createElement("h2");
        productName.textContent = item.name;

        const productImage = document.createElement("img");
        const findImage = `http://localhost:3000/v1/${item.image_url}`;
        const srcImage = findImage.replace("\\", "/");
        productImage.src = findImage;
        productImage.alt = item.name;
        //    const image = `http://localhost:3000/v1/menu/${src}`
        //    const formattedImageUrl = srcImage.replace(/\\/g, "/");

        const productDescription = document.createElement("p");
        productDescription.textContent = item.description;

        const productPrice = document.createElement("p");
        productPrice.textContent = `Preço: R$ ${item.price}`;

        // Botão de editar
        const editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.classList.add("edit-button");
        editButton.addEventListener("click", () => {
          window.location.href = `editProduct.html?id=${item._id}`;
        });

        // Botão de excluir
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Excluir";
        deleteButton.classList.add("delete-button"); 
        deleteButton.addEventListener("click", async () => {
          if (confirm(`Tem certeza que deseja excluir ${item.name}?`)) {
            const success = await deleteProduct(item._id);
            if (success) {
              alert(`${item.name} foi excluído com sucesso.`);
              loadProductsByCategory(); 
            } else {
              alert("Erro ao excluir o produto."); // Mensagem de erro se a exclusão falhar
            }
          }
        });

        // Adiciona os elementos ao card do produto
        productCard.appendChild(productName);
        productCard.appendChild(productImage);
        productCard.appendChild(productDescription);
        productCard.appendChild(productPrice);
        productCard.appendChild(editButton); // Adiciona o botão de editar
        productCard.appendChild(deleteButton); // Adiciona o botão de excluir

        // Adiciona o card ao container da categoria
        categoryElement.appendChild(productCard);
      });

      // Adiciona a categoria e seus produtos ao container principal
      productsContainer.appendChild(categoryElement);
    }
  } catch (error) {
    console.error("Erro ao carregar os produtos por categoria:", error);
    const productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML =
      "<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>"; // Mensagem de erro amigável
  }
}

// Implementação da função deleteProduct
async function deleteProduct(productId) {
  try {
    const response = await fetch(`http://localhost:3000/v1/menu/${productId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Falha ao excluir o produto"); // Lança um erro se a resposta não for ok
    }

    return true; // Retorna true se a exclusão for bem-sucedida
  } catch (error) {
    console.error("Erro ao excluir o produto:", error);
    return false; // Retorna false se ocorrer um erro
  }
}

// Carregar os produtos ao carregar a página
window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("updated")) {
    loadProductsByCategory(); // Chama a função corretamente
  } else {
    loadProductsByCategory(); // Carrega os produtos na inicialização
  }
};
