package freya.fitness.domain;

import lombok.Data;

import javax.persistence.Embeddable;
import java.time.LocalDateTime;

@Data
@Embeddable
public class Validity {

  public Validity(LocalDateTime from, LocalDateTime to) {
    this.from = from;
    this.to = to;
  }

  private LocalDateTime from;

  private LocalDateTime to;

}
