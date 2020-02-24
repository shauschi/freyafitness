package freya.fitness.api.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {

  private String message;

  public static MessageDto formatted(final String message, final String value) {
    return new MessageDto(String.format(message, value));
  }
}
