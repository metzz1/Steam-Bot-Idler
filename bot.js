const SteamUser = require("steam-user");
const SteamTotp = require("steam-totp");
const config = require("./config/cfg");
const client = new SteamUser();
const logOnOptions = {
  accountName: config.username,
  password: config.password,
  twoFactorCode: SteamTotp.getAuthCode(config.sharedSecret)
};

client.logOn(logOnOptions);

// Apos Logado

client.on("loggedOn", () => {
  console.log("Logado com sucesso na conta:", config.username);
  console.log("Respondendo automaticamente:", config.mensagemAutomatica);

  // Colocando Status
  client.setPersona(SteamUser.EPersonaState.Busy);
  client.gamesPlayed(config.jogandoAgora);
  console.log("Jogando:", config.jogandoAgora);
});

// Receber mensagem e enviar resposta / Receber informacoes do usuario.

client.on("friendMessage", function(steamID, message) {
  client.getPersonas([steamID], function(err, personas) {
    if (err) {
      console.log("Erro.");
    } else {
      const persona = personas[steamID.getSteamID64()];
      // Receber Nome do usuario
      let name;
      if (persona) {
        name = persona.player_name;
      } else {
        name = "Nao foi possivel receber informacoes sobre o Nome";
      }
      // Criterio para logar no console.
      if (message != "null") {
        client.chatMessage(steamID, config.mensagemAutomatica);
        console.log("Mensagem Recebida:", message, "||", "De:", name, "||");
      }
    }
  });
});
