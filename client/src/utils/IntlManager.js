import { IntlProvider } from "react-intl";
import br from "./i18n/br.json";

const messages = { br };

export function IntlManager({ children, locale }) {
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {children}
    </IntlProvider>
  );
}
