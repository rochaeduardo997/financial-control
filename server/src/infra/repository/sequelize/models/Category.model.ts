import { HasMany, ForeignKey, DataType, Table, Model, PrimaryKey, Column, Unique, Default } from "sequelize-typescript";
import UserModel from './User.model';
import TransactionModel from './Transaction.model';
import TransactionCategoryRelationModel from './TransactionCategoryRelation.model';

@Table({ tableName: "categories", timestamps: true })
class CategoryModel extends Model {
  @PrimaryKey
  @Column
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare description: string;

  @ForeignKey(() => UserModel)
  @Column({
    allowNull: false,
    onDelete:  'CASCADE',
    onUpdate:  'CASCADE'
  })
  declare fk_user_id: string;

  @HasMany(() => TransactionCategoryRelationModel)
  declare categories: TransactionCategoryRelationModel[];
}

export default CategoryModel;

