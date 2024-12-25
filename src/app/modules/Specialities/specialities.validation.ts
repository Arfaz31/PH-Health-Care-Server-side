import { z } from "zod";

const SpecialitiesValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required!",
    }),
  }),
});

export const SpecialtiesValidtaion = {
  SpecialitiesValidationSchema,
};
