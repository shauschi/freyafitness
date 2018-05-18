package freya.fitness.domain.jpa;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Embeddable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

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
  public static Validity starTomorrow() {
    final Validity validity = new Validity();
    validity.setFrom(LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.MIDNIGHT));
    return validity;
  }
}
