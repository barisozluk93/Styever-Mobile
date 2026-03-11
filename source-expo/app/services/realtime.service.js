import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

let connection = null;

export async function startNotificationConnection(baseUrl, token, handlers = {}) {
  try {
    console.log("startNotificationConnection çağrıldı");
    console.log("baseUrl:", baseUrl);
    console.log("token var mı:", !!token);

    if (!token) {
      console.log("SignalR başlatılmadı: token yok");
      return null;
    }

    if (connection) {
      try {
        await connection.stop();
      } catch (e) {
        console.log("Eski connection stop hatası:", e);
      }
      connection = null;
    }

    const hubUrl = `${baseUrl}/notificationHub`;
    console.log("SignalR hubUrl:", hubUrl);

    connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    connection.on("notificationReceived", (notification) => {
      console.log("SignalR notificationReceived:", notification);
      handlers.onNotificationReceived?.(notification);
    });

    connection.on("unreadCountChanged", (count) => {
      console.log("SignalR unreadCountChanged:", count);
      handlers.onUnreadCountChanged?.(count);
    });

    connection.onreconnecting((error) => {
      console.log("SignalR reconnecting:", error);
    });

    connection.onreconnected((connectionId) => {
      console.log("SignalR reconnected:", connectionId);
    });

    connection.onclose((error) => {
      console.log("SignalR closed:", error);
    });

    await connection.start();

    console.log("SignalR connected");
    return connection;
  } catch (error) {
    console.log("SignalR start error:", error);
    return null;
  }
}

export async function stopNotificationConnection() {
  try {
    if (connection) {
      await connection.stop();
      console.log("SignalR stopped");
      connection = null;
    }
  } catch (error) {
    console.log("SignalR stop error:", error);
  }
}