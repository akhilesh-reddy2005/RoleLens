import app from "./app";
import { env } from "./config/env";
import { startJobRefreshCron } from "./services/jobs/jobRefresh.job";

app.listen(env.port, () => {
  console.log(`RoleLens API listening on port ${env.port} [${env.nodeEnv}]`);
  startJobRefreshCron();
});
