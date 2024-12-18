import Transaction from "../../core/entity/Transaction";

export default (res: any) => {
  return new Transaction(
    res.id,
    res.name,
    res.value,
    res.direction,
    new Date(res.when),
    new Date(res.createdAt),
    new Date(res.updatedAt),
    res.fk_user_id,
    res.description,
    res.currency,
    res.quantity,
  );
};
