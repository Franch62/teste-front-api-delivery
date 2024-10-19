// Função para enviar as alterações
document
  .getElementById("edit-product-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = new URLSearchParams(window.location.search).get("id");
    const name = document.getElementById("product-name").value;
    const description = document.getElementById("product-description").value;
    const price = document.getElementById("product-price").value;
    const category = document.getElementById("product-category").value;
    const image = document.getElementById("product-image").files[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    if (image) {
      formData.append("image_url", image);
    }

    try {
      const response = await fetch(`http://localhost:3000/v1/menu/${id}`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();
      document.getElementById("edit-result").textContent = result.message;

      // Redireciona o usuário de volta para a página de produtos após 200ms
      setTimeout(() => {
        window.location.href = `products.html?${Date.now()}`;
      }, 200);
    } catch (error) {
      console.error("Erro ao editar o produto:", error);
    }
  });
