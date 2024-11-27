import { Card, CardContent, Typography } from "@mui/material";

type Props = {
  className?: string;
  title?: string;
  children: JSX.Element | JSX.Element[];
};

const BlankCard = ({ children, className, title }: Props) => {
  return (
    <Card
      sx={{ p: 0, position: "relative" }}
      className={className}
      elevation={9}
      variant={undefined}
    >
      <CardContent sx={{ flex: "1 0 auto" }}>
        {title ? (
          <Typography component="div" variant="h5" sx={{ paddingBottom: 3 }}>
            {title}
          </Typography>
        ) : (
          <></>
        )}
        {children}
      </CardContent>
    </Card>
  );
};

export default BlankCard;
