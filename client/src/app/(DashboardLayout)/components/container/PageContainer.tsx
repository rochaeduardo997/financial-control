import { Helmet, HelmetProvider } from "react-helmet-async";

type Props = {
  description?: string;
  children: JSX.Element | JSX.Element[];
  title?: string;
};

const PageContainer = ({ title, description, children }: Props) => (
  <HelmetProvider>
    <title>{title}</title>
    <div>{children}</div>
  </HelmetProvider>
);

export default PageContainer;
