async function loadProductsByCategory() {
  try {
    const token = localStorage.getItem("token"); // Obtém o token do localStorage
    if (!token) {
      alert("Você precisa estar autenticado para ver os produtos.");
      window.location.href = "login.html"; // Redireciona para a página de login
      return;
    }

    const response = await fetch("http://localhost:3000/api/menu/", {
      headers: {
        Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar produtos");
    }

    const products = await response.json();

    const productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML = ""; // Limpa o conteúdo antes de carregar

    // Organiza os produtos por categoria
    const productsByCategory = {};
    products.forEach((product) => {
      // Verifica se a categoria existe
      if (product.category && product.category.name) {
        const categoryName = product.category.name;
        const categoryId = product.category._id; // Obtém o ID da categoria

        if (!productsByCategory[categoryId]) {
          productsByCategory[categoryId] = {
            name: categoryName,
            items: [],
          };
        }
        productsByCategory[categoryId].items.push(product);
      }
    });

    // Cria o HTML para cada categoria e seus produtos
    for (const [categoryId, { name: categoryName, items }] of Object.entries(
      productsByCategory
    )) {
      const categoryElement = document.createElement("div");
      const categoryTitle = document.createElement("h1");
      const deleteCategoryButton = document.createElement("button");

      deleteCategoryButton.textContent = "Excluir";
      deleteCategoryButton.classList.add("delete-category-button");

      // Função de clique para excluir a categoria
      deleteCategoryButton.addEventListener("click", async () => {
        if (confirm(`Tem certeza que deseja excluir a categoria ${categoryName}?`)) {
          const success = await deleteCategory(categoryId, token); // Passa o ID correto da categoria e o token
          if (success) {
            alert(`${categoryName} foi excluído com sucesso.`);
            loadProductsByCategory(); // Recarrega a lista de produtos após exclusão
          } else {
            alert("Erro ao excluir a categoria.");
          }
        }
      });

      categoryTitle.textContent = categoryName;
      categoryElement.appendChild(categoryTitle);
      categoryElement.appendChild(deleteCategoryButton);

      items.forEach((item) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        const productName = document.createElement("h2");
        productName.textContent = item.name;

        const productImage = document.createElement("img");
        const srcImage = `http://localhost:3000/api/${item.image_url}`.replace(
          "\\",
          "/"
        );
        productImage.src = srcImage;
        productImage.alt = item.name;

        const productDescription = document.createElement("p");
        productDescription.textContent = item.description;

        const productPrice = document.createElement("p");
        productPrice.textContent = `Preço: R$ ${item.price}`;

        const editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.classList.add("edit-button");
        editButton.addEventListener("click", () => {
          window.location.href = `editProduct.html?id=${item._id}`;
        });

        const deleteProductButton = document.createElement("button");
        deleteProductButton.textContent = "Excluir";
        deleteProductButton.classList.add("delete-product-button");
        deleteProductButton.addEventListener("click", async () => {
          if (confirm(`Tem certeza que deseja excluir ${item.name}?`)) {
            const success = await deleteProduct(item._id, token); // Passa o token para a função de exclusão
            if (success) {
              alert(`${item.name} foi excluído com sucesso.`);
              loadProductsByCategory(); // Recarrega a lista de produtos após exclusão
            } else {
              alert("Erro ao excluir o produto.");
            }
          }
        });

        productCard.appendChild(productName);
        productCard.appendChild(productImage);
        productCard.appendChild(productDescription);
        productCard.appendChild(productPrice);
        productCard.appendChild(editButton);
        productCard.appendChild(deleteProductButton);

        categoryElement.appendChild(productCard);
      });

      productsContainer.appendChild(categoryElement);
    }
  } catch (error) {
    console.error("Erro ao carregar os produtos por categoria:", error);
    const productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML =
      "<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>";
  }
}

async function deleteProduct(productId, token) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/menu/${productId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`, // Adiciona o token ao cabeçalho
        },
      }
    );

    if (!response.ok) {
      throw new Error("Falha ao excluir o produto");
    }

    return true;
  } catch (error) {
    console.error("Erro ao excluir o produto:", error);
    return false;
  }
}

async function deleteCategory(categoryId, token) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/categories/${categoryId}`, // Certifique-se de que a rota de exclusão de categoria está correta
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`, // Adiciona o token ao cabeçalho
        },
      }
    );

    if (!response.ok) {
      throw new Error("Falha ao excluir a categoria");
    }

    return true;
  } catch (error) {
    console.error("Erro ao excluir a categoria:", error);
    return false;
  }
}

window.onload = () => {
  loadProductsByCategory();
};
