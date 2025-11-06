import UserModel from '@/lib/models/user.model';

/*
  Adapter module to match the import used in routes (`@/models/User`).
  The project's canonical model lives at `@/lib/models/user.model` (Mongoose schema)
  and expects `passwordHash`. Route code expects to call `User.findOne` and
  `User.create({ email, password })`. This adapter maps `password` -> `passwordHash`
  when creating so existing routes work without changing their code.
*/

const User = {
  findOne: (query: any) => UserModel.findOne(query),
  create: (data: any) => {
    const payload = { ...data };
    if (payload.password) {
      // Map route's `password` field to the schema's `passwordHash` field
      payload.passwordHash = payload.password;
      delete payload.password;
    }
    return UserModel.create(payload);
  },
  // Expose the underlying model for other direct operations if needed
  model: UserModel,
};

export default User;
