import Person, { IPerson } from '../models/Person';

class PersonRepository {
  async findByUser(userId: string): Promise<IPerson[]> {
    return Person.find({ user: userId });
  }

  async create(personData: Partial<IPerson>): Promise<IPerson> {
    return Person.create(personData);
  }

  async findById(id: string): Promise<IPerson | null> {
    return Person.findById(id);
  }

  async update(id: string, userId: string, data: Partial<IPerson>): Promise<IPerson | null> {
    return Person.findOneAndUpdate({ _id: id, user: userId }, data, { new: true });
  }

  async delete(id: string, userId: string): Promise<IPerson | null> {
    return Person.findOneAndDelete({ _id: id, user: userId });
  }
}

export default new PersonRepository();
