import { prismaMock } from "../setup_test/singleton";
import { getUser } from "../setup_test/function";

test("should return an array of users", async () => {
  const sampleUsers = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@gmail.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Dine",
      email: "jane.dine@gmail.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  prismaMock.user.findMany.mockResolvedValue(sampleUsers);

  await expect(getUser()).resolves.toEqual(sampleUsers);
});
