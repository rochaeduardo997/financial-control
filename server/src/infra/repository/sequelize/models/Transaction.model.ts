import {
  HasMany,
  ForeignKey,
  DataType,
  Table,
  Model,
  PrimaryKey,
  Column,
} from "sequelize-typescript";
import UserModel from "./User.model";
import TransactionCategoryRelationModel from "./TransactionCategoryRelation.model";

@Table({ tableName: "transactions", timestamps: true })
class TransactionModel extends Model {
  @PrimaryKey
  @Column
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false, type: DataType.FLOAT })
  declare value: number;

  @Column({ allowNull: false, type: DataType.ENUM("in", "out") })
  declare direction: string;

  @Column({ allowNull: false })
  declare when: Date;

  @Column
  declare description: string;

  @ForeignKey(() => UserModel)
  @Column({
    allowNull: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  declare fk_user_id: string;

  @HasMany(() => TransactionCategoryRelationModel)
  declare categories: TransactionCategoryRelationModel[];
}

export default TransactionModel;
