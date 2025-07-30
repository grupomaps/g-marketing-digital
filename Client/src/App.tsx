import { LocalRoutes } from "./app/routes/LocalRoutes";
import { Analytics } from "@vercel/analytics/react"


export const App = () => {
  return (
    <>
      <Analytics />
    <LocalRoutes />
    </>
  );
}
