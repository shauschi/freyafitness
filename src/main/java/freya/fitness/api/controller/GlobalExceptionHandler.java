package freya.fitness.api.controller;

import freya.fitness.api.dto.MessageDto;
import freya.fitness.utils.InvalidResetTokenException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.mail.MessagingException;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler  {

  @ExceptionHandler(value = InvalidResetTokenException.class)
  public ResponseEntity<MessageDto> catchInvalidResetTokenException(
      final Exception exception) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(new MessageDto(exception.getMessage()));
  }

  @ExceptionHandler(value = UsernameNotFoundException.class)
  public ResponseEntity<MessageDto> catchUsernameNotFoundException(
      final Exception exception) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(new MessageDto(exception.getMessage()));
  }

  @ExceptionHandler(value = MessagingException.class)
  public ResponseEntity<MessageDto> catchMessagingException(
      final Exception exception) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(new MessageDto(exception.getMessage()));
  }

}
