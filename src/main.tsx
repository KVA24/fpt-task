import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import "./i18n"
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import appConfig from "@/config/appConfig.ts";
import ReactGA from "react-ga4";

declare const window: any;

if (window.GA_ID) {
  console.log("ID: " + window.GA_ID)
  // @ts-ignore
  ReactGA.initialize(window.GA_ID, {});
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleReCaptchaProvider
    reCaptchaKey={appConfig.GOOGLE_RECAPTCHA_KEY}
    language='en-GB'
    useRecaptchaNet={true}
    useEnterprise={false}
    scriptProps={{
      async: false,
      defer: false,
      appendTo: 'head',
      nonce: undefined,
    }}
  >
    <App/>
  </GoogleReCaptchaProvider>
)
