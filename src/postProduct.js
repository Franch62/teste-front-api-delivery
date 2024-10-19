document.addEventListener("DOMContentLoaded", async () => {
  // Carregar categorias ao carregar a página
  await loadCategories();
});

// Função para carregar categorias
async function loadCategories() {
  try {
    const categoryResponse = await fetch(
      "http://localhost:3000/v1/categories/"
    );
    const categories = await categoryResponse.json();
    const categorySelect = document.getElementById("product-category");

    categorySelect.innerHTML = ""; // Limpa opções anteriores

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category._id;
      option.textContent = category.name;
      categorySelect.appendChild(option); // Adiciona a opção ao select
    });
  } catch (error) {
    console.error("Erro ao carregar as categorias:", error);
  }
}

async function addProduct(event) {
  event.preventDefault(); // Impede o comportamento padrão do formulário

  // Coleta os valores dos campos
  const name = document.getElementById("product-name").value;
  const description = document.getElementById("product-description").value;
  const price = document.getElementById("product-price").value;
  const category = document.getElementById("product-category").value;
  const image = document.getElementById("product-image").files[0]; // Pega o arquivo da imagem

  if (!category) {
    alert("Por favor, selecione uma categoria!");
    return;
  }

  // Criar um objeto FormData para enviar arquivos junto com o texto
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("category", category);
  if (image) {
    formData.append("image_url", image); // Adiciona o arquivo ao FormData se existir
  }

  try {
    // Enviar o produto para a API
    const response = await fetch("http://localhost:3000/v1/menu/", {
      method: "POST",
      body: formData, // O FormData automaticamente define os headers corretamente
    });

    const result = await response.json();
    document.getElementById("insert-result").textContent =
      result.name + " adicionado com sucesso!";

    // Redireciona o usuário de volta para a página de produtos após 200ms
    setTimeout(() => {
      window.location.href = `products.html?${Date.now()}`;
    }, 200);
  } catch (error) {
    console.error("Erro ao adicionar o produto:", error);
    document.getElementById("insert-result").textContent =
      "Erro ao adicionar o produto.";
  }
}

// Vincular evento de envio do formulário
document.querySelector("form").addEventListener("submit", addProduct);
console.log("success");
