package freya.fitness.domain;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Embeddable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Embeddable
public class Validity {

  private LocalDateTime from;

  private LocalDateTime to;

}
