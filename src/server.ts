import { Server } from "http";
import app from "./app";

const port = 3000;
async function main() {
  try {
    const server: Server = app.listen(port, () => {
      console.log(`PH_Health_Care Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

main();
