import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";
import { ISchedule } from "./schedule.interface";
import { Schedule } from "@prisma/client";

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

export const ScheduleService = {
  inserIntoDB,
};
