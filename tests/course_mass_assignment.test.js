const { updateCourse } = require("../controllers/coursesController");
const { Course } = require("../models");

jest.mock("../models", () => ({
  Course: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe("Course Controller - Mass Assignment Security", () => {
  it("should strip user and bootcamp fields from req.body when updating a course", async () => {
    const mockCourse = {
      _id: "course123",
      user: "user123",
      bootcamp: "bootcamp123",
      title: "Old Course Title",
    };

    Course.findById.mockResolvedValue(mockCourse);
    Course.findByIdAndUpdate.mockResolvedValue({
      ...mockCourse,
      title: "Updated Course Title",
    });

    const req = {
      params: { id: "course123" },
      user: { id: "user123", role: "publisher" },
      body: {
        title: "Updated Course Title",
        user: "attacker456", // Attempted ownership transfer
        bootcamp: "attackerBootcamp789", // Attempted bootcamp relocation
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      next.mockImplementation((err) => resolve(err));
      updateCourse(req, res, next);
    });

    expect(Course.findByIdAndUpdate).toHaveBeenCalledWith(
      "course123",
      { title: "Updated Course Title" },
      { new: true, runValidators: true },
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
