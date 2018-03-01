package freya.fitness.utils;

import java.time.LocalDateTime;
import java.time.LocalTime;

public class TimeUtils {

  /**
   * Calls @nextFullHour with LocalDateTime.now().
   * @return the beginning of the next hour
   */
  public static LocalDateTime nextFullHour() {
    return nextFullHour(LocalDateTime.now());
  }

  /**
   * This function returns a LocalDateTime that represents the beginning of the next hour
   * after a given LocalDateTime.
   * @param localDateTime any LocalDateTime
   * @return the beginning of the next hour
   */
  public static LocalDateTime nextFullHour(final LocalDateTime localDateTime) {
    if (localDateTime == null) {
      return nextFullHour();
    }
    final LocalTime normalizedTime =
        LocalTime.of(localDateTime.getHour(), 0, 0);
    final LocalDateTime normalized =
        LocalDateTime.of(localDateTime.toLocalDate(), normalizedTime);

    return normalized.plusHours(1);
  }

}
