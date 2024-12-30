import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";
import { IFilterRequest, ISchedule } from "./schedule.interface";
import { Prisma, Schedule } from "@prisma/client";
import { IPaginationOptions } from "../../Interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelpers";

const convertDateTime = async (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + offset);
};

const inserIntoDB = async (payload: ISchedule): Promise<Schedule[]> => {
  const { startDate, endDate, startTime, endTime } = payload;

  const interverlTime = 30; // Interval between slots, in minutes

  const schedules = [];

  const currentDate = new Date(startDate); // start date
  const lastDate = new Date(endDate); // end date

  while (currentDate <= lastDate) {
    // Loop through each day from start to end.
    // 09:30  ---> ['09', '30']
    // sartTime.split(':') splits the start time (09:30) into ['09', '30'].
    // addHours() and addMinutes() add the hour (09) and minute (30) to the current date.

    // Result:
    // If currentDate is 2024-12-29 and startTime is 09:30, the startDateTime becomes 2024-12-29T09:30:00.
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      // Loop through time slots for the current day.
      //Create Slot and Check for Duplicates
      const s = await convertDateTime(startDateTime);
      const e = await convertDateTime(addMinutes(startDateTime, interverlTime));

      const scheduleData = {
        startDateTime: s,
        endDateTime: e,
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });

      if (!existingSchedule) {
        // If slot does not exist, create it
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(result); // Add the created slot to the list.
      }

      startDateTime.setMinutes(startDateTime.getMinutes() + interverlTime); //Move to the next time slot by adding the interval (30 minutes).
    }

    currentDate.setDate(currentDate.getDate() + 1); //After processing all slots for the day, move to the next day.
  }

  return schedules;
};

const getAllFromDB = async (
  filters: IFilterRequest,
  options: IPaginationOptions,
  user: any
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { startDate, endDate, ...filterData } = filters;

  const andConditions = []; // Initialize an array to store AND conditions for the Prisma query.

  // Add date range conditions if startDate and endDate are provided.
  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: startDate,
          },
        },
        {
          endDateTime: {
            lte: endDate,
          },
        },
      ],
    });
  }

  // Add conditions for other filters if filterData is not empty.
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
            // Match records where the filter key equals the provided value.
            //const filterData = {
            //   status: 'active',
            //   type: 'online',
            // };

            //const key = 'status';
            //const value = filterData[key]; // Accesses filterData.status -> 'active'
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.ScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const doctorSchedules = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user?.email,
      },
    },
  });

  // Extract the IDs of the schedules from the doctor's schedules.
  const doctorScheduleIds = doctorSchedules.map(
    (schedule) => schedule.scheduleId
  );
  console.log(doctorScheduleIds);

  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorScheduleIds, // Exclude schedules that the doctor is already assigned to.
      },
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
  });

  // Count the total number of schedules matching the conditions.
  const total = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorScheduleIds,
      },
    },
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Schedule | null> => {
  const result = await prisma.schedule.findUnique({
    where: {
      id,
    },
  });
  //console.log(result?.startDateTime.getHours() + ":" + result?.startDateTime.getMinutes())
  return result;
};

export const ScheduleService = {
  inserIntoDB,
  getAllFromDB,
  getByIdFromDB,
};
