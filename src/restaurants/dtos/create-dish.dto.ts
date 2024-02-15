import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { Dish } from '../entities/dish.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class CreateDishInput extends PickType(Dish, [
  'name',
  'price',
  'description',
  'options',
]) {
  @Field((type) => Int)
  restaurantId: number; // dish 를 어떤 restaurant 에 생성할 지 알아야 되므로.
}

@ObjectType()
export class CreateDishOutput extends CoreOutput {}
