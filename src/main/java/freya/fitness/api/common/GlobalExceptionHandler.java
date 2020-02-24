package freya.fitness.api.common;

import freya.fitness.utils.exception.ActionNotAllowedException;
import freya.fitness.utils.exception.EntityNotFoundException;
import freya.fitness.utils.exception.InvalidResetTokenException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler  {

  /**
   * Global exception handling for {@link InvalidResetTokenException}.
   * @param exception exception that should be handled
   * @return bad request with error message
   */
  @ExceptionHandler(value = InvalidResetTokenException.class)
  public ResponseEntity<MessageDto> catchInvalidResetTokenException(
      final InvalidResetTokenException exception) {
    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(new MessageDto(exception.getMessage()));
  }

  /**
   * Global exception handling for {@link EntityNotFoundException}.
   * @param exception exception that should be handled
   * @return bad request with error message
   */
  @ExceptionHandler(value = EntityNotFoundException.class)
  public ResponseEntity<MessageDto> catchEntityNotFoundException(
      final EntityNotFoundException exception) {
    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(new MessageDto(exception.getMessage()));
  }

  /**
   * Global exception handling for {@link ActionNotAllowedException}.
   * @param exception exception that should be handled
   * @return bad request with error message
   */
  @ExceptionHandler(value = ActionNotAllowedException.class)
  public ResponseEntity<MessageDto> catchActionNotAllowedException(
      final ActionNotAllowedException exception) {
    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(new MessageDto(exception.getMessage()));
  }

}
