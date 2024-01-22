// Будние дни, кроссфит и пробные тренировки
const allTime = [
  ["7:00", "8:00"],
  ["9:00", "10:00"],
  ["11:00"],
  ["18:00", "19:00"],
  ["20:00"],
];

// Выходные дни, кроссфит и пробные тренировки
const saturdayTime = [["10:00"], ["11:00"], ["12:00"]];

// Тяжелая атлетика
const weightliftingTime = ["17:00"];

// Стретчинг среда
const stretchingNightTime = [
  [{ text: "19:00", callback_data: `scheduleTime~19:00` }],
];

// Стретчинг суббота
const stretchingTime = [
  [{ text: "10:00", callback_data: `scheduleTime~10:00` }],
];

// Бокс для детей
const boxTime = [[{ text: "16:00", callback_data: `scheduleTime~16:00` }]];

const getScheduleDate = (targetDayId, isWeightliftin) => {
  const today = new Date();
  const currentDay = today.getDay();
  let targetDay = currentDay === 0 ? targetDayId : targetDayId - currentDay;
  if (isWeightliftin && currentDay === 6) {
    targetDay = targetDayId + 1;
  }
  const targetDate = new Date(today.setDate(today.getDate() + targetDay));
  const day = targetDate.getDate();
  const month = targetDate.getMonth() + 1;
  const year = targetDate.getFullYear();

  return `${day < 10 ? `0${day}` : day}.${
    month < 10 ? `0${month}` : month
  }.${year}`;
};

const getAvailableDays = (days, isWeightlifti) => {
  const today = new Date().getDay();
  if (today === 6 && isWeightlifti) {
    return days;
  }
  if (today !== 0) {
    return days.filter((day) => day.id >= today);
  }
  return days;
};

const days = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

const infoOptions = [
  [
    { text: "О нас", callback_data: "about" },
    { text: "Расписание", callback_data: "timetable" },
  ],
  [
    { text: "Стоимость занятий", callback_data: "price" },
    { text: "Первая тренировка", callback_data: "firstTime" },
  ],
  [
    { text: "Акции", callback_data: "promotions" },
    { text: "Контакты", callback_data: "contacts" },
  ],
  [{ text: "Задать вопрос", callback_data: "question" }],
];
const workoutType = [
  [{ text: "Кроссфит", callback_data: "crossfit" }],
  [{ text: "Тяжелая атлетика", callback_data: "weightlifting" }],
  [{ text: "Stretching", callback_data: "stretching" }],
  [{ text: "Бокс для детей", callback_data: "box" }],
  [{ text: "Пробная бесплатная тренировка", callback_data: "free" }],
];

const workoutTypeOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: workoutType,
  }),
};

const infoCommandOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: infoOptions,
  }),
};

const getScheduleAllDay = () => [
  { id: 1, day: days[1], date: `${getScheduleDate(1)}` },
  { id: 2, day: days[2], date: `${getScheduleDate(2)}` },
  { id: 3, day: days[3], date: `${getScheduleDate(3)}` },
  { id: 4, day: days[4], date: `${getScheduleDate(4)}` },
  { id: 5, day: days[5], date: `${getScheduleDate(5)}` },
  { id: 6, day: days[6], date: `${getScheduleDate(6)}` },
];

const getStretchingDay = () => [
  { id: 3, day: days[3], date: `${getScheduleDate(3)}` },
  { id: 6, day: days[6], date: `${getScheduleDate(6)}` },
];

const getBoxDay = () => [
  { id: 4, day: days[4], date: `${getScheduleDate(4)}` },
];

const getWeightliftingDay = () => [
  { id: 1, day: days[1], date: `${getScheduleDate(1, true)}` },
  { id: 3, day: days[3], date: `${getScheduleDate(3, true)}` },
  { id: 5, day: days[5], date: `${getScheduleDate(5, true)}` },
];

const getScheduleAllDayOptions = () => ({
  reply_markup: JSON.stringify({
    inline_keyboard: getAvailableDays(getScheduleAllDay()).map((day) => {
      return [
        {
          text: `${day.day} ${day.date}`,
          callback_data: `scheduleDay:${day.id}`,
        },
      ];
    }),
  }),
});

const getStretchingDayOptions = () => {
  return {
    reply_markup: JSON.stringify({
      inline_keyboard: getAvailableDays(getStretchingDay()).map((day) => {
        return [
          {
            text: `${day.day} ${day.date}`,
            callback_data: `scheduleDay:${day.id}`,
          },
        ];
      }),
    }),
  };
};

const getWeightliftingDayOptions = () => {
  return {
    reply_markup: JSON.stringify({
      inline_keyboard: getAvailableDays(getWeightliftingDay(), true).map(
        (day) => {
          return [
            {
              text: `${day.day} ${day.date}`,
              callback_data: `scheduleDay:${day.id}`,
            },
          ];
        }
      ),
    }),
  };
};

const getBoxDayOptions = () => {
  return {
    reply_markup: JSON.stringify({
      inline_keyboard: getAvailableDays(getBoxDay()).map((day) => {
        return [
          {
            text: `${day.day} ${day.date}`,
            callback_data: `scheduleDay:${day.id}`,
          },
        ];
      }),
    }),
  };
};

const timeOptions = (isSaturday) => {
  return {
    reply_markup: JSON.stringify({
      inline_keyboard: isSaturday
        ? saturdayTime.map((row) => {
            return row.map((time) => {
              return {
                text: time,
                callback_data: `scheduleTime~${time}`,
              };
            });
          })
        : allTime.map((row) => {
            return row.map((time) => {
              return {
                text: time,
                callback_data: `scheduleTime~${time}`,
              };
            });
          }),
    }),
  };
};

const stretchingTimeOptions = (nightTime) => {
  return {
    reply_markup: JSON.stringify({
      inline_keyboard: nightTime ? stretchingNightTime : stretchingTime,
    }),
  };
};

const boxTimeOptions = () => {
  return {
    reply_markup: JSON.stringify({
      inline_keyboard: boxTime,
    }),
  };
};

const weightliftingTimeOptions = () => {
  return {
    reply_markup: JSON.stringify({
      inline_keyboard: weightliftingTime.map((time) => {
        return [
          {
            text: time,
            callback_data: `scheduleTime~${time}`,
          },
        ];
      }),
    }),
  };
};

module.exports = {
  infoCommandOptions,
  workoutTypeOptions,
  getScheduleAllDayOptions,
  getWeightliftingDayOptions,
  getStretchingDayOptions,
  getBoxDayOptions,
  timeOptions,
  weightliftingTimeOptions,
  stretchingTimeOptions,
  boxTimeOptions,
  days,
};
