import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class MyRestaurantsInput extends PaginationInput {}

@ObjectType()
export class MyRestaurantsOutput extends PaginationOutput {
  @Field((type) => [Restaurant], { nullable: true })
  results?: Restaurant[];
}
