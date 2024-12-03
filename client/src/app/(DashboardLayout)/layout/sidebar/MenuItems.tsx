import {
  IconCash,
  IconCategory,
  IconChartHistogram,
  IconReport,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";
import { FormattedMessage } from "react-intl";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconChartHistogram,
    href: "/",
  },

  /* TRANSACTION SECTION */
  { navlabel: true, subheader: <FormattedMessage id="GENERAL.TRANSACTIONS" /> },
  {
    id: uniqueId(),
    title: <FormattedMessage id="NAVBAR.ITEM.TRANSACTIONS.TITLE.OVERVIEW" />,
    icon: IconCash,
    href: "/transactions/overview",
  },
  {
    id: uniqueId(),
    title: <FormattedMessage id="NAVBAR.ITEM.TRANSACTIONS.TITLE.REPORT" />,
    icon: IconReport,
    href: "/transactions/report",
  },

  { navlabel: true, subheader: <FormattedMessage id="GENERAL.GENERAL" /> },
  {
    id: uniqueId(),
    title: <FormattedMessage id="NAVBAR.ITEM.CATEGORIES.TITLE" />,
    icon: IconCategory,
    href: "/general/categories",
  },

  /* CRYPTO SECTION */
  // { navlabel: true, subheader: <FormattedMessage id="GENERAL.CRYPTO" /> },
  // {
  //   id: uniqueId(),
  //   title: <FormattedMessage id="NAVBAR.ITEM.CRYPTO.TITLE.OVERVIEW" />,
  //   icon: IconCoinBitcoin,
  //   href: "/crypto/overview",
  // },
  // {
  //   id: uniqueId(),
  //   title: <FormattedMessage id="NAVBAR.ITEM.CRYPTO.TITLE.REPORT" />,
  //   icon: IconReport,
  //   href: "/crypto/report",
  // },
];

export default Menuitems;
