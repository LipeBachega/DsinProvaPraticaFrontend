const TOKEN_KEY = "cabeleleila:token";

export function saveToken(token: string) {
  // O token é salvo localmente para ser reaproveitado nas rotas autenticadas.
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken() {
  // As APIs autenticadas consultam este valor antes de enviar requests.
  return localStorage.getItem(TOKEN_KEY);
}
