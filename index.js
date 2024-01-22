const TelegramApi = require("node-telegram-bot-api");
const adminId = 1991291074;
const devId = 540756101;
const token = "6580839606:AAFH19wqumqjaULUFP2Q2eXAvBT6LqEcHHA";
const {
  startText,
  promotionsText,
  firstTimeText,
  priceText,
  contactsText,
  questionText,
  workoutNames,
} = require("./constans/text-constant");

const {
  workoutTypeOptions,
  getWeightliftingDayOptions,
  getStretchingDayOptions,
  getBoxDayOptions,
  timeOptions,
  weightliftingTimeOptions,
  stretchingTimeOptions,
  boxTimeOptions,
  getScheduleAllDayOptions,
  infoCommandOptions,
  days,
} = require("./constans/options-constant");

const bot = new TelegramApi(token, { polling: true });

bot.setMyCommands([
  { command: "/info", description: "Информация" },
  { command: "/schedule", description: "Записаться" },
]);

// Обработка ошибок для асинхронных операций
const asyncErrorHandler = (fn) => {
  return async (message) => {
    try {
      await fn(message);
    } catch (error) {
      console.error("Произошла ошибка:", error);
      bot.sendMessage(
        devId,
        `Произошла ошибка asyncErrorHandler: ${error.message}`
      );
    }
  };
};

const getUserName = (user) => {
  const name = user.first_name;
  const lastName = user.last_name || "";
  const username = user.username ? `@${user.username}` : "";

  const fullName = `${lastName} ${name} ${username}`;
  return fullName.trim();
};

const sayHello = async (currentChatId) => {
  try {
    await bot.sendMessage(currentChatId, startText);
  } catch (error) {
    bot.sendMessage(devId, `Произошла ошибка sayHello: ${error.message}`);
  }
};

const questionHandler = async (message) => {
  try {
    const text = `Пользователь ${getUserName(message.chat)} задал вопрос:\n\n${
      message.text
    }`;
    await bot.sendMessage(adminId, text);
    bot.removeListener("message");
  } catch (error) {
    bot.sendMessage(
      devId,
      `Произошла ошибка questionHandler: ${error.message}`
    );
  }
};

const scheduleHandler = async (query, id, workoutName) => {
  try {
    if (query.data.includes("scheduleTime")) {
      bot.answerCallbackQuery(query.id);
      bot.removeListener("callback_query");

      const time = query.data.split("~")[1];
      const currentChatId = query.message.chat.id;

      await bot.sendMessage(
        adminId,
        `${getUserName(query.from)} записался на ${
          workoutNames[workoutName]
        }: ${days[id]} - ${time}`
      );

      await bot.sendMessage(
        currentChatId,
        `Вы записаны на ${workoutNames[workoutName]}: ${days[id]} - ${time}`
      );
    }
  } catch (error) {
    bot.sendMessage(
      devId,
      `Произошла ошибка scheduleHandler: ${error.message}`
    );
  }
};

const scheduleDayHandler = async (
  query,
  currentChatId,
  timeOptions,
  workoutName
) => {
  try {
    if (query.data.includes("scheduleDay")) {
      bot.answerCallbackQuery(query.id);
      bot.removeAllListeners("callback_query");

      const id = query.data.split(":")[1];

      const isNightTime = workoutName === "stretching" && id == 3;
      const isSaturday =
        (workoutName === "crossfit" || workoutName === "free") && id == 6;
      const options = timeOptions(isNightTime || isSaturday);

      await bot.sendMessage(currentChatId, "Доступное время", options);

      bot.addListener("callback_query", (query) =>
        scheduleHandler(query, id, workoutName)
      );
    }
  } catch (error) {
    bot.sendMessage(
      devId,
      `Произошла ошибка scheduleDayHandler: ${error.message}`
    );
  }
};

bot.onText(
  /\/start/,
  asyncErrorHandler(async (message) => {
    const currentChatId = message.chat.id;
    await sayHello(currentChatId);
  })
);

bot.onText(
  /\/info/,
  asyncErrorHandler(async (message) => {
    const currentChatId = message.chat.id;
    await bot.sendMessage(currentChatId, "Информация", infoCommandOptions);

    bot.addListener("callback_query", async (query) => {
      const currentChatId = query.message.chat.id;
      const data = query.data;

      try {
        if (data === "about") {
          bot.answerCallbackQuery(query.id);
          bot.removeAllListeners("callback_query");
          sayHello(currentChatId);
        }
        if (data === "price") {
          bot.answerCallbackQuery(query.id);
          bot.removeAllListeners("callback_query");
          await bot.sendPhoto(currentChatId, "./assets/price.jpg", {
            caption: priceText,
          });
        }
        if (data === "timetable") {
          bot.answerCallbackQuery(query.id);
          bot.removeAllListeners("callback_query");
          await bot.sendPhoto(currentChatId, "./assets/timetable.jpg");
        }
        if (data === "promotions") {
          bot.answerCallbackQuery(query.id);
          bot.removeAllListeners("callback_query");
          await bot.sendMessage(currentChatId, promotionsText);
        }
        if (data === "firstTime") {
          bot.answerCallbackQuery(query.id);
          bot.removeAllListeners("callback_query");
          await bot.sendPhoto(currentChatId, "./assets/firstTime.jpg", {
            caption: firstTimeText,
          });
        }
        if (data === "contacts") {
          bot.answerCallbackQuery(query.id);
          bot.removeAllListeners("callback_query");
          await bot.sendMessage(currentChatId, contactsText);
        }
        if (data === "question") {
          bot.answerCallbackQuery(query.id);
          bot.removeListener("callback_query");
          await bot.sendMessage(currentChatId, questionText);
          bot.addListener("message", (message) =>
            questionHandler(message, currentChatId)
          );
        }
      } catch (error) {
        bot.sendMessage(devId, `Произошла ошибка info: ${error.message}`);
      }
    });
  })
);

bot.onText(
  /\/schedule/,
  asyncErrorHandler(async (message) => {
    const currentChatId = message.chat.id;
    await bot.sendMessage(
      currentChatId,
      "Выберите тип тренировки",
      workoutTypeOptions
    );

    bot.addListener("callback_query", async (query) => {
      const currentChatId = query.message.chat.id;
      const data = query.data;

      try {
        if (data === "crossfit") {
          bot.answerCallbackQuery(query.id);
          bot.removeAllListeners("callback_query");

          await bot.sendMessage(
            currentChatId,
            "Доступные дни",
            getScheduleAllDayOptions()
          );

          bot.addListener("callback_query", (query) =>
            scheduleDayHandler(query, currentChatId, timeOptions, "crossfit")
          );
        }
        if (data === "weightlifting") {
          bot.answerCallbackQuery(query.id);
          bot.removeAllListeners("callback_query");

          await bot.sendMessage(
            currentChatId,
            "Доступные дни",
            getWeightliftingDayOptions()
          );

          bot.addListener("callback_query", (query) =>
            scheduleDayHandler(
              query,
              currentChatId,
              weightliftingTimeOptions,
              "weightlifting"
            )
          );
        }
        if (data === "stretching") {
          bot.answerCallbackQuery(query.id);
          bot.removeAllListeners("callback_query");

          await bot.sendMessage(
            currentChatId,
            "Доступные дни",
            getStretchingDayOptions()
          );

          bot.addListener("callback_query", (query) =>
            scheduleDayHandler(
              query,
              currentChatId,
              stretchingTimeOptions,
              "stretching"
            )
          );
        }
        if (data === "box") {
          bot.removeAllListeners("callback_query");

          await bot.sendMessage(
            currentChatId,
            "Доступные дни",
            getBoxDayOptions()
          );

          bot.addListener("callback_query", (query) =>
            scheduleDayHandler(query, currentChatId, boxTimeOptions, "box")
          );
        }
        if (data === "free") {
          bot.removeAllListeners("callback_query");

          await bot.sendMessage(
            currentChatId,
            "Доступные дни",
            getScheduleAllDayOptions()
          );

          bot.addListener("callback_query", (query) =>
            scheduleDayHandler(query, currentChatId, timeOptions, "free")
          );
        }
      } catch (error) {
        bot.sendMessage(devId, `Произошла ошибка schedule: ${error.message}`);
      }
    });
  })
);

bot.on("polling_error", (error) => {
  console.error("Ошибка в polling:", error);
  bot.sendMessage(devId, `Произошла ошибка polling: ${error.message}`);
});
