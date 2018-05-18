package freya.fitness.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MessageDto {

  private String message;

  public static MessageDto formatted(final String message, final String value) {
    return new MessageDto(String.format(message, value));
  }
}
