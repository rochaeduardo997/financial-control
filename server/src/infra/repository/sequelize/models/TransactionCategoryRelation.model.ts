import { ForeignKey, BelongsTo, DataType, Table, Model, PrimaryKey, Column, Unique, Default } from "sequelize-typescript";
import UserModel from './User.model';
import TransactionModel from './Transaction.model';
import CategoryModel from './Category.model';

@Table({ tableName: "transaction_category_relation", timestamps: true })
class TransactionCategoryRelationModel extends Model {
  @PrimaryKey
  @ForeignKey(() => TransactionModel)
  @Column({
    allowNull: false,
    onDelete:  'CASCADE',
    onUpdate:  'CASCADE'
  })
  declare fk_transaction_id: string;

  @PrimaryKey
  @ForeignKey(() => CategoryModel)
  @Column({
    allowNull: false,
    onDelete:  'CASCADE',
    onUpdate:  'CASCADE'
  })
  declare fk_category_id: string;

  @PrimaryKey
  @ForeignKey(() => UserModel)
  @Column({
    allowNull: false,
    onDelete:  'CASCADE',
    onUpdate:  'CASCADE'
  })
  declare fk_user_id: string;

  @BelongsTo(() => TransactionModel) declare transaction: TransactionModel;
  @BelongsTo(() => CategoryModel)    declare category: CategoryModel;
}

export default TransactionCategoryRelationModel;

