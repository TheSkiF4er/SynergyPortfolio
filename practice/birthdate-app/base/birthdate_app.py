
import datetime

def get_weekday(day, month, year):
    date_obj = datetime.date(year, month, day)
    weekdays = [
        "Понедельник", "Вторник", "Среда",
        "Четверг", "Пятница", "Суббота", "Воскресенье"
    ]
    return weekdays[date_obj.weekday()]

def is_leap_year(year):
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)

def calculate_age(day, month, year):
    today = datetime.date.today()
    birth_date = datetime.date(year, month, day)
    age = today.year - birth_date.year
    if (today.month, today.day) < (birth_date.month, birth_date.day):
        age -= 1
    return age

def digit_patterns():
    return {
        "0": [" *** ",
              "*   *",
              "*   *",
              "*   *",
              " *** "],
        "1": ["  *  ",
              " **  ",
              "  *  ",
              "  *  ",
              " *** "],
        "2": [" *** ",
              "*   *",
              "   * ",
              "  *  ",
              "*****"],
        "3": [" *** ",
              "    *",
              " *** ",
              "    *",
              " *** "],
        "4": ["*   *",
              "*   *",
              "*****",
              "    *",
              "    *"],
        "5": ["*****",
              "*    ",
              "**** ",
              "    *",
              "**** "],
        "6": [" *** ",
              "*    ",
              "**** ",
              "*   *",
              " *** "],
        "7": ["*****",
              "    *",
              "   * ",
              "  *  ",
              " *   "],
        "8": [" *** ",
              "*   *",
              " *** ",
              "*   *",
              " *** "],
        "9": [" *** ",
              "*   *",
              " ****",
              "    *",
              " *** "],
        " ": ["     ",
              "     ",
              "     ",
              "     ",
              "     "]
    }

def print_styled_date(day, month, year):
    date_str = f"{day:02d} {month:02d} {year}"
    patterns = digit_patterns()
    
    for row in range(5):
        line = ""
        for char in date_str:
            line += patterns[char][row] + "  "
        print(line)

def main():
    try:
        day = int(input("Введите день рождения: "))
        month = int(input("Введите месяц рождения: "))
        year = int(input("Введите год рождения: "))

        weekday = get_weekday(day, month, year)
        leap = is_leap_year(year)
        age = calculate_age(day, month, year)

        print("\nРезультаты:")
        print(f"День недели: {weekday}")
        print(f"Високосный год: {'Да' if leap else 'Нет'}")
        print(f"Ваш возраст: {age} лет")

        print("\nДата рождения в стилизованном виде:")
        print_styled_date(day, month, year)

    except ValueError:
        print("Ошибка: введите корректные числовые значения.")
    except Exception as e:
        print(f"Произошла ошибка: {e}")

if __name__ == "__main__":
    main()
