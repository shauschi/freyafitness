package freya.fitness.api.common;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ValidityDto {

  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime from;

  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime to;

  public ValidityDto(final Validity validity) {
    this.from = validity.getFrom();
    this.to = validity.getTo();
  }

  public Validity toValidity() {
    final Validity validity = new Validity();
    validity.setFrom(from);
    validity.setTo(to);
    return validity;
  }
}
