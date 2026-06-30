import "./AuthForm.css";

export function createAuthForm({ onLogin, onRegister }) {
  const container = document.createElement("div");
  container.className = "auth-form";

  let mode = "login"; // 'login' | 'register'

  function field(type, name, placeholder) {
    const wrapper = document.createElement("label");
    wrapper.className = "auth-form__field";
    const input = document.createElement("input");
    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    input.required = true;
    wrapper.appendChild(input);
    return { wrapper, input };
  }

  function render() {
    container.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = mode === "login" ? "Iniciar sesión" : "Crear cuenta";

    const form = document.createElement("form");
    form.className = "auth-form__form";

    const nameField = mode === "register" ? field("text", "name", "Nombre") : null;
    const emailField = field("email", "email", "Email");
    const passwordField = field("password", "password", "Contraseña");

    if (nameField) form.appendChild(nameField.wrapper);
    form.append(emailField.wrapper, passwordField.wrapper);

    let imageInput = null;
    if (mode === "register") {
      const imageWrapper = document.createElement("label");
      imageWrapper.className = "auth-form__field";
      imageWrapper.textContent = "Foto de perfil (opcional)";
      imageInput = document.createElement("input");
      imageInput.type = "file";
      imageInput.name = "image";
      imageInput.accept = "image/*";
      imageWrapper.appendChild(imageInput);
      form.appendChild(imageWrapper);
    }

    const errorMsg = document.createElement("p");
    errorMsg.className = "auth-form__error";

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.className = "auth-form__submit";
    submitBtn.textContent = mode === "login" ? "Entrar" : "Registrarme";

    form.append(errorMsg, submitBtn);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorMsg.textContent = "";
      submitBtn.disabled = true;

      try {
        if (mode === "login") {
          await onLogin({
            email: emailField.input.value,
            password: passwordField.input.value,
          });
        } else {
          const formData = new FormData();
          formData.append("name", nameField.input.value);
          formData.append("email", emailField.input.value);
          formData.append("password", passwordField.input.value);
          if (imageInput.files[0]) formData.append("image", imageInput.files[0]);
          await onRegister(formData);
        }
      } catch (error) {
        errorMsg.textContent = error.message;
      } finally {
        submitBtn.disabled = false;
      }
    });

    const toggle = document.createElement("p");
    toggle.className = "auth-form__toggle";
    toggle.textContent = mode === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? ";

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "auth-form__toggle-btn";
    toggleBtn.textContent = mode === "login" ? "Regístrate" : "Inicia sesión";
    toggleBtn.addEventListener("click", () => {
      mode = mode === "login" ? "register" : "login";
      render();
    });
    toggle.appendChild(toggleBtn);

    container.append(title, form, toggle);
  }

  render();
  return container;
}
