const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Incorrect credentials!");
      }
      const isCorrectPassword = await user.isCorrectPassword(args.password);
      console.log(isCorrectPassword);
      if (!isCorrectPassword) {
        throw new Error("Incorrect credentials!");
      }
      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, { userName, email, password }) => {
      const user = await User.create({ userName, email, password });
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, book, context) => {
      if (context.user) {
        const updateUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          {
            $push: {
              savedBooks: arg.input,
            },
          },
          { new: true }
        );
        return updateUser;
      }
      throw new Error("User not found");
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updateUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          {
            $pull: {
              savedBooks: { bookId },
            },
          },
          { new: true }
        );
        return updateUser;
      }
      throw new Error("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
