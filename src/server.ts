import { Server } from "http";
import app from "./app";
import { config } from "./app/config";

async function main() {
  try {
    const server: Server = app.listen(config.port, () => {
      console.log(`PH_Health_Care Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

main();
