import api, { setAuthTokens } from "./api";

function formatDateForApi(value) {
  const match = String(value || "").match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) throw new Error("Informe a data de nascimento no formato DD/MM/AAAA.");

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    throw new Error("A data de nascimento informada não é válida.");
  }
  return `${year}-${month}-${day}`;
}

function toOptionalNumber(value) {
  if (value == null || String(value).trim() === "") return null;
  const number = Number(String(value).replace(",", "."));
  if (!Number.isFinite(number)) throw new Error("Altura e peso devem ser números válidos.");
  return number;
}

class UsuarioServices {
  async login(email, senha) {
    const { data } = await api.post("/api/auth/login", { email, senha });
    setAuthTokens(data.accessToken, data.refreshToken);
    return data;
  }

  async cadastrar(form) {
    const phoneUser = String(form.phone || "").replace(/\D/g, "");
    const sexoUser = {
      Masculino: "MASCULINO",
      Feminino: "FEMININO",
      "Prefiro não informar": "PREFIRO_NAO_INFORMAR",
    }[form.sexo];

    const payload = {
      nomeUser: String(form.nome || "").trim(),
      apelidoUser: String(form.apelido || "").trim(),
      emailUser: String(form.email || "").trim().toLowerCase(),
      senhaUser: form.senha,
      nascimentoUser: formatDateForApi(form.dataNascimento),
      phoneUser,
      sexoUser: sexoUser || "PREFIRO_NAO_INFORMAR",
      alturaCm: toOptionalNumber(form.altura) == null ? null : Math.round(toOptionalNumber(form.altura)),
      pesoKg: toOptionalNumber(form.peso),
      esportesUser: Array.isArray(form.esportes) ? form.esportes : [],
    };

    const { data } = await api.post("/api/usuarios/cadastrar", payload);
    await this.login(payload.emailUser, payload.senhaUser);
    return data;
  }

  async getProfile() {
    const { data } = await api.get("/api/usuarios/me");
    return data;
  }

  async updateProfile(form) {
    const sexoUser = {
      Masculino: "MASCULINO",
      Feminino: "FEMININO",
      "Prefiro não informar": "PREFIRO_NAO_INFORMAR",
    }[form.sexo];
    const payload = {
      nomeUser: String(form.nome || "").trim(),
      emailUser: String(form.email || "").trim().toLowerCase(),
      nascimentoUser: formatDateForApi(form.dataNascimento),
      sexoUser: sexoUser || "PREFIRO_NAO_INFORMAR",
      alturaCm: toOptionalNumber(form.altura) == null ? null : Math.round(toOptionalNumber(form.altura)),
      pesoKg: toOptionalNumber(form.peso),
    };
    const { data } = await api.put("/api/usuarios/me", payload);
    return data;
  }

  logout() {
    setAuthTokens(undefined, undefined);
  }
}

const userService = new UsuarioServices();
export default userService;
