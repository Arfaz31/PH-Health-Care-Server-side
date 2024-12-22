import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/route";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFoundRoute from "./app/middlewares/notFoundRoute";

const app: Application = express();
//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use(globalErrorHandler);
app.use(notFoundRoute);
export default app;
