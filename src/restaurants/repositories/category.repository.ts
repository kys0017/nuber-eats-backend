import { EntityRepository, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  async getOrCreate(name: string): Promise<Category> {
    const categoryName = name.trim().toLowerCase();
    const categogrySlug = categoryName.replace(/ /g, '-'); // 정규표현식이 아닌 replace(' ', '-') 는 첫번째 blank 만 - 로 바뀜.
    let category = await this.findOne({
      where: { slug: categogrySlug },
    });
    if (!category) {
      category = await this.save(
        this.create({
          slug: categogrySlug,
          name: categoryName,
        }),
      );
    }

    return category;
  }
}
