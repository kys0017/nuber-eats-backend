import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@InputType('OrderItemOptionInputType', { isAbstract: true })
@ObjectType()
export class OrderItemOption {
  @Field((type) => String)
  name: string;

  @Field((type) => String, { nullable: true })
  choice?: string;
}

@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity {
  // Dish 에선 OrderItem 을 어떻게 가져올 지 신경쓰지 않아도 된다.
  // (e.g. dish => dish.orderItem 같은 것들)
  // 단지 OrderItem 에서 dish 에 접근하기만 원함.
  // 반대의 관계에서 어떻게 되는지 명시해 줄 필요없음. 항상 필요하지는 않음.
  @Field((type) => Dish)
  @ManyToOne((type) => Dish, { nullable: true, onDelete: 'CASCADE' })
  dish: Dish;

  @Field((type) => [OrderItemOption], { nullable: true })
  @Column({ type: 'json', nullable: true }) // dish option 은 entity 에 넣지 않겠다.
  options?: OrderItemOption[];
}
