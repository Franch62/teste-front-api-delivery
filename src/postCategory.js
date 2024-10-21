document.addEventListener("DOMContentLoaded", () => {
    // Verifica se o usuário está autenticado
    const token = localStorage.getItem("token"); // Obtém o token do localStorage
    if (!token) {
      alert("Você precisa estar autenticado para adicionar uma nova categoria.");
      window.location.href = "login.html"; // Redireciona para a página de login
      return;
    }
  });
  
  // Função para adicionar uma nova categoria
  async function addCategory(event) {
    event.preventDefault(); // Impede o comportamento padrão do formulário
  
    // Coleta os valores dos campos
    const name = document.getElementById("category-name").value;
    const description = document.getElementById("category-description").value;
  
    if (!name) {
      alert("Por favor, insira um nome.");
      return;
    }
  
    // Criar um objeto com os dados a serem enviados
    const categoryData = {
      name: name,
      description: description
    };
  
    try {
      const token = localStorage.getItem("token"); // Obtém o token do localStorage
      if (!token) {
        alert("Você precisa estar autenticado para adicionar categorias.");
        window.location.href = "login.html"; // Redireciona para a página de login
        return;
      }
  
      // Enviar a categoria para a API
      const response = await fetch("http://localhost:3000/api/categories/", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`, // Adiciona o token no cabeçalho
          'Content-Type': 'application/json', // Define o tipo de conteúdo como JSON
        },
        body: JSON.stringify(categoryData), // Converte o objeto em uma string JSON
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Tenta obter detalhes do erro
        throw new Error(errorData.message || "Falha ao adicionar a categoria."); // Lança um erro se a resposta não for ok
      }
  
      const result = await response.json();
      document.getElementById("insert-result").textContent =
        `${result.name} adicionado com sucesso!`;
  
      // Limpa o formulário
      document.getElementById("category-name").value = "";
      document.getElementById("category-description").value = "";
  
      // Redireciona o usuário de volta para a página de categorias após 200ms
      setTimeout(() => {
        window.location.href = `products.html?${Date.now()}`; // Certifique-se de que a página de redirecionamento está correta
      }, 200);
    } catch (error) {
      console.error("Erro ao adicionar a categoria:", error);
      document.getElementById("insert-result").textContent =
        "Erro ao adicionar a categoria. Verifique os dados e tente novamente.";
    }
  }
  
  // Vincular evento de envio do formulário
  document.querySelector("form").addEventListener("submit", addCategory);
  console.log("success");
  