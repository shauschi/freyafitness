package freya.fitness.api.common;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import javax.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Embeddable
public class Validity {

  private LocalDateTime from;

  private LocalDateTime to;

  /**
   * Creates a new Validity object beginning midnight the next day.
   * @return tomorrow midnight
   */
  public static Validity startTomorrow() {
    final Validity validity = new Validity();
    validity.setFrom(LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.MIDNIGHT));
    return validity;
  }

  public static Validity startNow() {
    final Validity validity = new Validity();
    validity.setFrom(LocalDateTime.now());
    return validity;
  }

  /**
   * A {@link Validity} is considered valid at a given LocalDateTime t,
   * if t is equal to or after {@code from} and equal to or before {@code to}
   * (exept when to is null what means an infinite validity).
   *
   * @param dateTime given time that should be checked
   * @return true if the given date is within from - to
   */
  public boolean isValid(final LocalDateTime dateTime) {
    return !dateTime.isBefore(from) && (to == null || !dateTime.isAfter(to));
  }

}
