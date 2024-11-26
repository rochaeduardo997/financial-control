import { IconLayoutDashboard, IconCash, IconReport } from "@tabler/icons-react";

import { uniqueId } from "lodash";
import { FormattedMessage } from "react-intl";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
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
